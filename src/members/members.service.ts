import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersQueryDto } from './dto/members-query.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { PaginatedMembersResponseDto } from './dto/paginated-members-response.dto';
import { Role } from '../auth/enums/role.enum';
import { Decimal } from '@prisma/client/runtime/library';
import {
  PointTransactionType,
  Member,
  Business,
  CardType,
} from '../../generated/prisma';
import { Prisma } from '../../generated/prisma';
import * as fs from 'fs/promises';
import { generateLoyaltyCard } from '../utils/loyalty-card.utils';
import { MailService } from '../mail/mail.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';

type CurrentUserType = {
  UserID: number;
  Role: Role;
  BusinessID?: number;
};

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService,
  ) {}

  private mapToResponseDto(
    member: Member & {
      Business?: Business | null;
      HeldCardType?: CardType | null;
    },
    currentUser: CurrentUserType,
  ): MemberResponseDto {
    const response: MemberResponseDto = {
      memberID: member.MemberID,
      businessID: member.BusinessID,
      memberType: member.MemberType as any,
      firstName: member.FirstName,
      lastName: member.LastName ?? null,
      mobileNumber: member.MobileNumber,
      email: member.Email ?? null,
      gender: member.Gender as any,
      address: member.Address ?? null,
      age: member.Age ?? null,
      profileImageURL: member.ProfileImageURL ?? null,
      smartCardNumber: member.SmartCardNumber ?? null,
      cardTypeID: member.CardTypeID ?? null,
      currentLoyaltyPoints: new Decimal(member.CurrentLoyaltyPoints).toNumber(),
      isActive: member.IsActive,
      registeredByUserID: member.RegisteredByUserID ?? null,
      createdAt: member.CreatedAt,
      updatedAt: member.UpdatedAt,
      cardTypeName: member.HeldCardType?.CardName ?? undefined,
      loyaltyCardUrl: member.LoyaltyCardURL,
    };

    if (currentUser.Role === Role.SuperAdmin) {
      response.businessName = member.Business?.BusinessName;
    }

    return response;
  }

  async create(
    createMemberDto: CreateMemberDto,
    currentUser: CurrentUserType,
    appUrl: string,
    profileImagePath?: string,
  ) {
    const { businessId, initialPoints, cardTypeId } = createMemberDto;
    let targetBusinessId: number;
    const finalProfileImagePath = profileImagePath
      ? profileImagePath.replace(/^public/, '')
      : undefined;

    if (currentUser.Role === Role.SuperAdmin) {
      if (!businessId) {
        throw new BadRequestException('SuperAdmin must provide a businessId.');
      }
      targetBusinessId = businessId;
      const businessExists = await this.prisma.business.findUnique({
        where: { BusinessID: targetBusinessId },
      });
      if (!businessExists) {
        throw new NotFoundException(
          `Business with ID ${targetBusinessId} not found.`,
        );
      }
    } else {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException(
          'BusinessAdmin does not have an associated business.',
        );
      }
      targetBusinessId = currentUser.BusinessID;
    }

    if (cardTypeId) {
      const cardType = await this.prisma.cardType.findFirst({
        where: {
          CardTypeID: cardTypeId,
          BusinessID: targetBusinessId,
        },
      });
      if (!cardType) {
        throw new BadRequestException(
          `CardType with ID ${cardTypeId} not found or does not belong to the business.`,
        );
      }
    }

    const existingMember = await this.prisma.member.findFirst({
      where: {
        BusinessID: targetBusinessId,
        OR: [
          { MobileNumber: createMemberDto.mobileNumber },
          ...(createMemberDto.smartCardNumber
            ? [{ SmartCardNumber: createMemberDto.smartCardNumber }]
            : []),
        ],
      },
    });
    if (existingMember) {
      if (existingMember.MobileNumber === createMemberDto.mobileNumber) {
        throw new ConflictException(
          'A member with this mobile number already exists in this business.',
        );
      }
      if (
        createMemberDto.smartCardNumber &&
        existingMember.SmartCardNumber === createMemberDto.smartCardNumber
      ) {
        throw new ConflictException(
          'A member with this smart card number already exists in this business.',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const newMember = await tx.member.create({
        data: {
          BusinessID: 1,
          RegisteredByUserID: currentUser.UserID,
          MemberType: createMemberDto.memberType,
          FirstName: createMemberDto.firstName,
          LastName: createMemberDto.lastName,
          MobileNumber: createMemberDto.mobileNumber,
          Email: createMemberDto.email,
          Gender: createMemberDto.gender,
          Address: createMemberDto.address,
          Age: createMemberDto.age,
          ProfileImageURL: finalProfileImagePath,
          SmartCardNumber: createMemberDto.smartCardNumber,
          CardTypeID: cardTypeId,
          CurrentLoyaltyPoints: initialPoints ?? 0,
        },
        include: { Business: true, HeldCardType: true },
      });

      if (initialPoints && initialPoints > 0) {
        await tx.pointTransaction.create({
          data: {
            BusinessID: targetBusinessId,
            MemberID: newMember.MemberID,
            TransactionType: PointTransactionType.ManualAdjust,
            Points: new Decimal(initialPoints),
            Title: 'Initial Points on Registration',
            Description: `Awarded ${initialPoints} points upon member creation.`,
            ProcessedByUserID: currentUser.UserID,
          },
        });
      }

      // Generate and save the loyalty card
      let cardTypeName = newMember.HeldCardType?.CardName ?? 'N/A';

      const loyaltyCardRelativePath = await generateLoyaltyCard(
        newMember,
        cardTypeName,
      );

      // Update member with the card URL
      const memberWithCard = await tx.member.update({
        where: { MemberID: newMember.MemberID },
        data: { LoyaltyCardURL: loyaltyCardRelativePath },
        include: { Business: true, HeldCardType: true },
      });

      // After the transaction commits successfully, send notifications.
      // We do this after the main transaction logic.
      // Note: This part is now outside the atomic DB transaction.
      // If notifications fail, the member is still created.
      // This is a common pattern to avoid long-running transactions.
      const fullLoyaltyCardUrl = `${appUrl}${loyaltyCardRelativePath}`;
      const businessName =
        memberWithCard.Business?.BusinessName || 'our business';

      // Send Welcome Email
      if (memberWithCard.Email) {
        const absoluteCardPath = `public${loyaltyCardRelativePath}`;
        this.mailService
          .sendMemberWelcomeEmail(
            memberWithCard,
            businessName,
            absoluteCardPath,
          )
          .catch((err) =>
            console.error('Failed to send welcome email asynchronously:', err),
          );
      }

      // Send WhatsApp Message
      if (memberWithCard.MobileNumber) {
        this.whatsappService
          .sendWelcomeMessage(
            memberWithCard.MobileNumber,
            memberWithCard.FirstName,
            fullLoyaltyCardUrl,
          )
          .catch((err) =>
            console.error(
              'Failed to send WhatsApp message asynchronously:',
              err,
            ),
          );
      }

      return this.mapToResponseDto(memberWithCard, currentUser);
    });
  }
  
  async findAll(
    queryDto: MembersQueryDto,
    currentUser: CurrentUserType,
  ): Promise<PaginatedMembersResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      cardTypeId,
      memberType,
    } = queryDto;
    const { businessId } = queryDto;

    const where: Prisma.MemberWhereInput = {};

    if (currentUser.Role === Role.SuperAdmin) {
      if (businessId) {
        where.BusinessID = businessId;
      }
    } else {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException(
          'BusinessAdmin has no associated business.',
        );
      }
      where.BusinessID = currentUser.BusinessID;
    }

    if (isActive !== undefined) {
      where.IsActive = isActive;
    } else {
      where.IsActive = true;
    }

    if (cardTypeId) where.CardTypeID = cardTypeId;
    if (memberType) where.MemberType = memberType as any;

    if (search) {
      where.OR = [
        { FirstName: { contains: search } },
        { LastName: { contains: search } },
        { Email: { contains: search } },
        { MobileNumber: { contains: search } },
      ];
    }

    const total = await this.prisma.member.count({ where });
    const data = await this.prisma.member.findMany({
      where,
      include: { Business: true, HeldCardType: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { CreatedAt: 'desc' },
    });

    const mappedData = data.map((member) =>
      this.mapToResponseDto(member, currentUser),
    );
    const totalPages = Math.ceil(total / limit);

    return {
      data: mappedData,
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
  ): Promise<MemberResponseDto> {
    const member = await this.prisma.member.findUnique({
      where: { MemberID: id },
      include: { Business: true, HeldCardType: true },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    if (
      currentUser.Role !== Role.SuperAdmin &&
      member.BusinessID !== currentUser.BusinessID
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this member.',
      );
    }

    return this.mapToResponseDto(member, currentUser);
  }

  async findOneBySmartCardNumber(
    smartCardNumber: string,
    currentUser: CurrentUserType,
  ): Promise<MemberResponseDto> {
    const where: Prisma.MemberWhereInput = {
      SmartCardNumber: smartCardNumber,
    };

    if (
      currentUser.Role === Role.BusinessAdmin ||
      currentUser.Role === Role.BusinessSubAdmin
    ) {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException('User has no associated business.');
      }
      where.BusinessID = currentUser.BusinessID;
    }
    // SuperAdmin can search any card, so no BusinessID filter is applied for them

    const member = await this.prisma.member.findFirst({
      where,
      include: { Business: true, HeldCardType: true },
    });

    if (!member) {
      throw new NotFoundException(
        `Member with Smart Card Number ${smartCardNumber} not found.`,
      );
    }

    // Authorization check: ensure business admin/sub-admin isn't accessing a member from another business
    // This is already handled by the where clause, but as a defense-in-depth, we can check again.
    if (
      (currentUser.Role === Role.BusinessAdmin ||
        currentUser.Role === Role.BusinessSubAdmin) &&
      member.BusinessID !== currentUser.BusinessID
    ) {
      throw new ForbiddenException(
        'You are not authorized to access this member.',
      );
    }

    return this.mapToResponseDto(member, currentUser);
  }

  async update(
    id: number,
    updateMemberDto: UpdateMemberDto,
    currentUser: CurrentUserType,
    profileImagePath?: string,
  ): Promise<MemberResponseDto> {
    // 1. Prepare the new image path if one was uploaded
    const finalProfileImagePath = profileImagePath
      ? profileImagePath.replace(/^public/, '')
      : undefined;

    // 2. Find the existing member
    const member = await this.prisma.member.findUnique({
      where: { MemberID: id },
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    // 3. Authorization Check
    if (
      currentUser.Role !== Role.SuperAdmin &&
      member.BusinessID !== currentUser.BusinessID
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this member.',
      );
    }

    // 4. Validate unique fields if they are being changed
    if (
      updateMemberDto.mobileNumber &&
      updateMemberDto.mobileNumber !== member.MobileNumber
    ) {
      const existing = await this.prisma.member.findFirst({
        where: {
          BusinessID: member.BusinessID,
          MobileNumber: updateMemberDto.mobileNumber,
          NOT: { MemberID: id },
        },
      });
      if (existing) {
        throw new ConflictException(
          'Another member with this mobile number already exists.',
        );
      }
    }

    if (
      updateMemberDto.smartCardNumber &&
      updateMemberDto.smartCardNumber !== member.SmartCardNumber
    ) {
      const existing = await this.prisma.member.findFirst({
        where: {
          BusinessID: member.BusinessID,
          SmartCardNumber: updateMemberDto.smartCardNumber,
          NOT: { MemberID: id },
        },
      });
      if (existing) {
        throw new ConflictException(
          'Another member with this smart card number already exists.',
        );
      }
    }

    // 5. If a new image is uploaded, delete the old one from the filesystem
    if (finalProfileImagePath && member.ProfileImageURL) {
      try {
        const oldImagePath = `public${member.ProfileImageURL}`;
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error(
          `Failed to delete old profile image: ${member.ProfileImageURL}. Error: ${error.message}`,
        );
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            `Update failed due to a conflict. The new mobile number or smart card number might already be in use.`,
          );
        }
        throw new Error(`Failed to update member: ${error.message}`);
      }
    }

    // 7. Prepare the data for the update operation
    const {
      memberType,
      firstName,
      lastName,
      mobileNumber,
      email,
      gender,
      address,
      age,
      smartCardNumber,
      isActive,
    } = updateMemberDto;
    const dataToUpdate: Prisma.MemberUpdateInput = {
      ...(memberType && { MemberType: memberType as any }),
      ...(firstName && { FirstName: firstName }),
      ...(lastName && { LastName: lastName }),
      ...(mobileNumber && { MobileNumber: mobileNumber }),
      ...(email && { Email: email }),
      ...(gender && { Gender: gender as any }),
      ...(address && { Address: address }),
      ...(age && { Age: age }),
      ...(smartCardNumber && { SmartCardNumber: smartCardNumber }),
      ...(isActive !== undefined && { IsActive: isActive }),
    };
    if (finalProfileImagePath) {
      dataToUpdate.ProfileImageURL = finalProfileImagePath;
    }

    // 8. Perform the update
    const updatedMember = await this.prisma.member.update({
      where: { MemberID: id },
      data: dataToUpdate,
      include: { Business: true, HeldCardType: true },
    });

    // 9. Return the mapped DTO
    return this.mapToResponseDto(updatedMember, currentUser);
  }

  async remove(
    id: number,
    currentUser: CurrentUserType,
  ): Promise<MemberResponseDto> {
    const member = await this.prisma.member.findUnique({
      where: { MemberID: id },
      include: { Business: true, HeldCardType: true },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found.`);
    }

    if (
      currentUser.Role !== Role.SuperAdmin &&
      member.BusinessID !== currentUser.BusinessID
    ) {
      throw new ForbiddenException(
        'You do not have permission to deactivate this member.',
      );
    }

    if (!member.IsActive) {
      throw new BadRequestException('This member is already inactive.');
    }

    const deactivatedMember = await this.prisma.member.update({
      where: { MemberID: id },
      data: { IsActive: false },
      include: { Business: true, HeldCardType: true },
    });

    return this.mapToResponseDto(deactivatedMember as any, currentUser);
  }
}
