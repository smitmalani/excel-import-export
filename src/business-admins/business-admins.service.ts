import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdateBusinessAdminDto } from './dto/update-business-admin.dto';
import { Role } from '../auth/enums/role.enum';
import { User as PrismaUser, Business, Prisma } from '../../generated/prisma';
import { BusinessAdminResponseDto } from './dto/business-admin-response.dto';
import { PaginatedBusinessAdminResponseDto } from './dto/paginated-business-admin-response.dto';

// Define an augmented type for User with its optional Business relation
type PrismaUserWithBusiness = PrismaUser & {
  Business?: Business | null;
};

@Injectable()
export class BusinessAdminsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  private mapToResponseDto(
    user: PrismaUserWithBusiness,
  ): BusinessAdminResponseDto {
    if (!user.BusinessID) {
      throw new Error('BusinessAdmin user does not have a BusinessID.');
    }
    return {
      UserID: user.UserID,
      BusinessID: user.BusinessID,
      BusinessName: user.Business?.BusinessName,
      Role: user.Role as Role,
      Username: user.Username,
      FullName: user.FullName,
      Email: user.Email,
      IsActive: user.IsActive,
      LastLogin: user.LastLogin,
      CreatedAt: user.CreatedAt,
      UpdatedAt: user.UpdatedAt,
    };
  }

  async create(
    createBusinessAdminDto: CreateBusinessAdminDto,
  ): Promise<BusinessAdminResponseDto> {
    const { businessId, email, fullName, password } = createBusinessAdminDto;

    const business = await this.prisma.business.findUnique({
      where: { BusinessID: businessId },
    });
    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found.`);
    }
    if (!business.IsActive) {
      throw new BadRequestException(
        `Business with ID ${businessId} is not active.`,
      );
    }

    const existingAdminInBusiness =
      await this.usersService.findUserByEmailAndBusinessId(email, businessId);
    if (existingAdminInBusiness) {
      throw new ConflictException(
        `An admin with email '${email}' already exists for this business.`,
      );
    }

    let username = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '');
    let usernameExists = await this.usersService.findOneByUsername(username);
    let attempt = 1;
    const originalUsername = username;
    while (usernameExists) {
      username = `${originalUsername}${attempt}`;
      usernameExists = await this.usersService.findOneByUsername(username);
      attempt++;
      if (attempt > 100) {
        throw new ConflictException(
          'Could not generate a unique username after multiple attempts.',
        );
      }
    }

    try {
      const newUserWithoutRelation = await this.usersService.create({
        username,
        email,
        password,
        fullName,
        role: Role.BusinessAdmin,
        businessId,
      });

      await this.mailService.sendBusinessRegistrationWelcomeEmail(
        newUserWithoutRelation.Email,
        newUserWithoutRelation.FullName || 'Admin',
        business.BusinessName,
        password,
      );

      // Refetch user with business relation for the response
      const newUserWithBusiness = await this.prisma.user.findUnique({
        where: { UserID: newUserWithoutRelation.UserID },
        include: { Business: true },
      });
      if (!newUserWithBusiness) {
        throw new InternalServerErrorException(
          'Failed to retrieve newly created admin details.',
        );
      }

      return this.mapToResponseDto(newUserWithBusiness);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create business admin. Email or username might already be in use globally or for this business.',
      );
    }
  }

  async findAll(
    businessId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedBusinessAdminResponseDto> {
    const skip = (page - 1) * limit;
    const whereClause: Prisma.UserWhereInput = { Role: Role.BusinessAdmin };
    if (businessId) {
      whereClause.BusinessID = businessId;
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: whereClause,
        include: { Business: true },
        skip,
        take: limit,
        orderBy: {
          CreatedAt: 'desc',
        },
      }),
      this.prisma.user.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: users.map((user) =>
        this.mapToResponseDto(user as PrismaUserWithBusiness),
      ),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findOne(userId: number): Promise<BusinessAdminResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { UserID: userId, Role: Role.BusinessAdmin },
      include: { Business: true },
    });

    if (!user) {
      throw new NotFoundException(
        `Business admin with ID ${userId} not found.`,
      );
    }
    return this.mapToResponseDto(user as PrismaUserWithBusiness);
  }

  async update(
    userId: number,
    updateDto: UpdateBusinessAdminDto,
  ): Promise<BusinessAdminResponseDto> {
    const existingAdmin = await this.findOne(userId);

    if (updateDto.email && updateDto.email !== existingAdmin.Email) {
      const emailConflict =
        await this.usersService.findUserByEmailAndBusinessId(
          updateDto.email,
          existingAdmin.BusinessID,
        );
      if (emailConflict && emailConflict.UserID !== userId) {
        throw new ConflictException(
          `Email '${updateDto.email}' is already in use by another admin in this business.`,
        );
      }
    }

    await this.usersService.update(userId, {
      ...(updateDto.fullName && { FullName: updateDto.fullName }),
      ...(updateDto.email && { Email: updateDto.email }),
      ...(updateDto.isActive !== undefined && { IsActive: updateDto.isActive }),
    });

    // Re-fetch user with business relation for the response
    const updatedUserWithBusiness = await this.prisma.user.findUnique({
      where: { UserID: userId },
      include: { Business: true },
    });
    if (!updatedUserWithBusiness) {
      throw new InternalServerErrorException(
        'Failed to retrieve updated admin details.',
      );
    }

    return this.mapToResponseDto(updatedUserWithBusiness);
  }

  async remove(userId: number): Promise<BusinessAdminResponseDto> {
    await this.findOne(userId);

    await this.usersService.update(userId, {
      IsActive: false,
    });

    // Re-fetch user with business relation for the response
    const deactivatedUserWithBusiness = await this.prisma.user.findUnique({
      where: { UserID: userId },
      include: { Business: true },
    });
    if (!deactivatedUserWithBusiness) {
      throw new InternalServerErrorException(
        'Failed to retrieve deactivated admin details.',
      );
    }
    return this.mapToResponseDto(deactivatedUserWithBusiness);
  }
}
