import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Role } from '../auth/enums/role.enum';
import { Prisma, Business } from '../../generated/prisma';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs/promises';

@Injectable()
export class BusinessesService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async create(
    createBusinessDto: CreateBusinessDto,
    logoPath?: string,
  ): Promise<Business> {
    const {
      adminEmail,
      adminFullName,
      adminPassword,
      businessName,
      address,
      phoneNumber,
    } = createBusinessDto;

    // Remove 'public' from the path. The path from multer is 'public/uploads/...'
    const finalLogoPath = logoPath
      ? logoPath.replace(/^public/, '')
      : undefined;

    const existingUser =
      await this.usersService.findByUsernameOrEmail(adminEmail);
    if (existingUser && !existingUser.BusinessID) {
      throw new ConflictException(
        `User with email ${adminEmail} already exists as a SuperAdmin.`,
      );
    }

    const newBusiness = await this.prisma.$transaction(async (tx) => {
      const createdBusiness = await tx.business.create({
        data: {
          BusinessName: businessName,
          Address: address,
          LogoURL: finalLogoPath,
          PhoneNumber: phoneNumber,
          IsActive: true,
        },
      });

      try {
        await this.usersService.create(
          {
            username: adminEmail,
            email: adminEmail,
            fullName: adminFullName,
            password: adminPassword,
            role: Role.BusinessAdmin,
            businessId: createdBusiness.BusinessID,
          },
          tx as Prisma.TransactionClient,
        );
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            `Admin user with email ${adminEmail} already exists for business ID ${createdBusiness.BusinessID}.`,
          );
        }
        console.error('Error creating admin user in transaction:', error);
        throw new InternalServerErrorException(
          `Could not create admin user: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
      return createdBusiness;
    });

    if (newBusiness) {
      try {
        await this.mailService.sendBusinessRegistrationWelcomeEmail(
          adminEmail,
          adminFullName,
          businessName,
          adminPassword,
        );
      } catch (emailError) {
        console.error(
          `Failed to send welcome email to ${adminEmail}:`,
          emailError,
        );
      }
    }

    return newBusiness;
  }

  async findAll(): Promise<Business[]> {
    return this.prisma.business.findMany({ where: { IsActive: true } });
  }

  async findAllWithInactive(): Promise<Business[]> {
    return this.prisma.business.findMany();
  }

  async findOne(businessId: number): Promise<Business> {
    const business = await this.prisma.business.findUnique({
      where: { BusinessID: businessId },
    });
    if (!business) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }
    return business;
  }

  async update(
    businessId: number,
    updateBusinessDto: UpdateBusinessDto,
    logoPath?: string,
  ): Promise<Business> {
    const { businessName, address, phoneNumber, isActive } = updateBusinessDto;

    // Remove 'public' from the path for the new logo
    const finalLogoPath = logoPath
      ? logoPath.replace(/^public/, '')
      : undefined;

    const existingBusiness = await this.prisma.business.findUnique({
      where: { BusinessID: businessId },
    });
    if (!existingBusiness) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }

    // If a new logo is uploaded, delete the old one from the filesystem
    // Note: The path in DB is relative (/uploads/...), so construct the full path for deletion
    if (logoPath && existingBusiness.LogoURL) {
      const oldLogoPath = `public${existingBusiness.LogoURL}`;
      try {
        await fs.unlink(oldLogoPath);
      } catch (error) {
        console.error(`Failed to delete old logo: ${oldLogoPath}`, error);
      }
    }

    try {
      return await this.prisma.business.update({
        where: { BusinessID: businessId },
        data: {
          ...(businessName && { BusinessName: businessName }),
          ...(address && { Address: address }),
          ...(finalLogoPath && { LogoURL: finalLogoPath }),
          ...(phoneNumber && { PhoneNumber: phoneNumber }),
          ...(isActive !== undefined && { IsActive: isActive }),
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Business with ID ${businessId} not found during update.`,
          );
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Update failed. A business with similar unique details might already exist.',
          );
        }
      }
      console.error('Error updating business:', error);
      throw new InternalServerErrorException(
        `Could not update business: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async remove(businessId: number): Promise<Business> {
    const existingBusiness = await this.prisma.business.findUnique({
      where: { BusinessID: businessId },
    });
    if (!existingBusiness) {
      throw new NotFoundException(`Business with ID ${businessId} not found`);
    }
    if (!existingBusiness.IsActive) {
      throw new ConflictException(
        `Business with ID ${businessId} is already inactive.`,
      );
    }

    try {
      return await this.prisma.business.update({
        where: { BusinessID: businessId },
        data: { IsActive: false },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Business with ID ${businessId} not found during deactivation.`,
        );
      }
      console.error('Error deactivating business:', error);
      throw new InternalServerErrorException(
        `Could not deactivate business: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
