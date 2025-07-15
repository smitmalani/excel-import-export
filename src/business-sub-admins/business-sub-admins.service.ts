import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { CreateBusinessSubAdminDto } from './dto/create-business-sub-admin.dto';
import { UpdateBusinessSubAdminDto } from './dto/update-business-sub-admin.dto';
import { BusinessSubAdminsQueryDto } from './dto/business-sub-admins-query.dto';
import { BusinessSubAdminResponseDto } from './dto/business-sub-admin-response.dto';
import { PaginatedBusinessSubAdminResponseDto } from './dto/paginated-business-sub-admin-response.dto';
import { Role } from '../auth/enums/role.enum';
import { User as PrismaUser, Business, Prisma } from '../../generated/prisma';
import { randomBytes } from 'crypto';

type CurrentUserType = {
  UserID: number;
  Role: Role;
  BusinessID?: number;
};

type PrismaUserWithBusiness = PrismaUser & { Business?: Business | null };

@Injectable()
export class BusinessSubAdminsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  private mapToResponseDto(
    user: PrismaUserWithBusiness,
  ): BusinessSubAdminResponseDto {
    if (!user.Business) {
      throw new Error('Business information is missing for sub-admin mapping.');
    }
    if (user.BusinessID === null) {
      throw new Error('BusinessID is null for sub-admin mapping.');
    }
    return {
      UserID: user.UserID,
      FullName: user.FullName || '',
      Username: user.Username,
      Email: user.Email,
      IsActive: user.IsActive,
      BusinessID: user.BusinessID,
      BusinessName: user.Business.BusinessName,
      Role: user.Role,
      LastLogin: user.LastLogin,
      CreatedAt: user.CreatedAt,
      UpdatedAt: user.UpdatedAt,
    };
  }

  async create(
    createDto: CreateBusinessSubAdminDto,
    currentUser: CurrentUserType,
  ): Promise<BusinessSubAdminResponseDto> {
    if (!currentUser.BusinessID) {
      throw new ForbiddenException(
        'You are not associated with a business and cannot create sub-admins.',
      );
    }

    const business = await this.prisma.business.findUnique({
      where: { BusinessID: currentUser.BusinessID },
    });
    if (!business) {
      throw new NotFoundException(
        'Your associated business could not be found.',
      );
    }

    let password = createDto.password;
    if (!password) {
      password = randomBytes(8).toString('hex');
    }

    const username = createDto.email.split('@')[0];

    const newUser = await this.usersService.create({
      ...createDto,
      username,
      role: Role.BusinessSubAdmin,
      businessId: currentUser.BusinessID,
      password: password,
    });

    await this.mailService.sendBusinessRegistrationWelcomeEmail(
      newUser.Email,
      newUser.FullName || '',
      business.BusinessName,
      password, // Send the plain password here
    );

    const userWithBusiness = await this.prisma.user.findUnique({
      where: { UserID: newUser.UserID },
      include: { Business: true },
    });

    if (!userWithBusiness) {
      throw new NotFoundException(
        `Could not retrieve created user with ID ${newUser.UserID}`,
      );
    }

    return this.mapToResponseDto(userWithBusiness);
  }

  async findAll(
    queryDto: BusinessSubAdminsQueryDto,
    currentUser: CurrentUserType,
  ): Promise<PaginatedBusinessSubAdminResponseDto> {
    if (!currentUser.BusinessID) {
      throw new ForbiddenException(
        'You are not associated with a business and cannot view sub-admins.',
      );
    }

    const { page = 1, limit = 10, search, isActive } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      BusinessID: currentUser.BusinessID,
      Role: Role.BusinessSubAdmin,
    };

    if (isActive !== undefined) {
      where.IsActive = isActive;
    }

    if (search) {
      where.OR = [
        { FullName: { contains: search } },
        { Email: { contains: search } },
        { Username: { contains: search } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: { Business: true },
        skip,
        take: limit,
        orderBy: { CreatedAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((user) => this.mapToResponseDto(user)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findOne(
    id: number,
    currentUser: CurrentUserType,
  ): Promise<BusinessSubAdminResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { UserID: id },
      include: { Business: true },
    });

    if (!user) {
      throw new NotFoundException(`Sub-admin with ID ${id} not found.`);
    }

    if (
      user.BusinessID !== currentUser.BusinessID ||
      user.Role !== Role.BusinessSubAdmin
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this user.',
      );
    }

    return this.mapToResponseDto(user);
  }

  async update(
    id: number,
    updateDto: UpdateBusinessSubAdminDto,
    currentUser: CurrentUserType,
  ): Promise<BusinessSubAdminResponseDto> {
    const userToUpdate = await this.prisma.user.findUnique({
      where: { UserID: id },
    });

    if (!userToUpdate) {
      throw new NotFoundException(`Sub-admin with ID ${id} not found.`);
    }

    if (
      userToUpdate.BusinessID !== currentUser.BusinessID ||
      userToUpdate.Role !== Role.BusinessSubAdmin
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this user.',
      );
    }

    if (updateDto.email && updateDto.email !== userToUpdate.Email) {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException(
          'Current user has no business associated.',
        );
      }
      const existing = await this.usersService.findUserByEmailAndBusinessId(
        updateDto.email,
        currentUser.BusinessID,
      );
      if (existing && existing.UserID !== id) {
        throw new ConflictException(
          'Another user with this email already exists in this business.',
        );
      }
    }

    const { fullName, email, isActive } = updateDto;
    const dataToUpdate: Prisma.UserUpdateInput = {};
    if (fullName) {
      dataToUpdate.FullName = fullName;
    }
    if (email) {
      dataToUpdate.Email = email;
    }
    if (isActive !== undefined) {
      dataToUpdate.IsActive = isActive;
    }

    const updatedUser = await this.prisma.user.update({
      where: { UserID: id },
      data: dataToUpdate,
      include: { Business: true },
    });

    return this.mapToResponseDto(updatedUser);
  }

  async remove(
    id: number,
    currentUser: CurrentUserType,
  ): Promise<BusinessSubAdminResponseDto> {
    const userToRemove = await this.prisma.user.findUnique({
      where: { UserID: id },
    });

    if (!userToRemove) {
      throw new NotFoundException(`Sub-admin with ID ${id} not found.`);
    }

    if (
      userToRemove.BusinessID !== currentUser.BusinessID ||
      userToRemove.Role !== Role.BusinessSubAdmin
    ) {
      throw new ForbiddenException(
        'You do not have permission to deactivate this user.',
      );
    }

    // Instead of deleting, we deactivate the user
    const deactivatedUser = await this.prisma.user.update({
      where: { UserID: id },
      data: { IsActive: false },
      include: { Business: true },
    });

    return this.mapToResponseDto(deactivatedUser);
  }
}
