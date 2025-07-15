"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../auth/enums/role.enum");
const library_1 = require("@prisma/client/runtime/library");
const prisma_1 = require("../../generated/prisma");
const prisma_2 = require("../../generated/prisma");
const fs = require("fs/promises");
const loyalty_card_utils_1 = require("../utils/loyalty-card.utils");
const mail_service_1 = require("../mail/mail.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const config_1 = require("@nestjs/config");
let MembersService = class MembersService {
    prisma;
    mailService;
    whatsappService;
    configService;
    constructor(prisma, mailService, whatsappService, configService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.whatsappService = whatsappService;
        this.configService = configService;
    }
    mapToResponseDto(member, currentUser) {
        const response = {
            memberID: member.MemberID,
            businessID: member.BusinessID,
            memberType: member.MemberType,
            firstName: member.FirstName,
            lastName: member.LastName ?? null,
            mobileNumber: member.MobileNumber,
            email: member.Email ?? null,
            gender: member.Gender,
            address: member.Address ?? null,
            age: member.Age ?? null,
            profileImageURL: member.ProfileImageURL ?? null,
            smartCardNumber: member.SmartCardNumber ?? null,
            cardTypeID: member.CardTypeID ?? null,
            currentLoyaltyPoints: new library_1.Decimal(member.CurrentLoyaltyPoints).toNumber(),
            isActive: member.IsActive,
            registeredByUserID: member.RegisteredByUserID ?? null,
            createdAt: member.CreatedAt,
            updatedAt: member.UpdatedAt,
            cardTypeName: member.HeldCardType?.CardName ?? undefined,
            loyaltyCardUrl: member.LoyaltyCardURL,
        };
        if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            response.businessName = member.Business?.BusinessName;
        }
        return response;
    }
    async create(createMemberDto, currentUser, appUrl, profileImagePath) {
        const { businessId, initialPoints, cardTypeId } = createMemberDto;
        let targetBusinessId;
        const finalProfileImagePath = profileImagePath
            ? profileImagePath.replace(/^public/, '')
            : undefined;
        if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            if (!businessId) {
                throw new common_1.BadRequestException('SuperAdmin must provide a businessId.');
            }
            targetBusinessId = businessId;
            const businessExists = await this.prisma.business.findUnique({
                where: { BusinessID: targetBusinessId },
            });
            if (!businessExists) {
                throw new common_1.NotFoundException(`Business with ID ${targetBusinessId} not found.`);
            }
        }
        else {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('BusinessAdmin does not have an associated business.');
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
                throw new common_1.BadRequestException(`CardType with ID ${cardTypeId} not found or does not belong to the business.`);
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
                throw new common_1.ConflictException('A member with this mobile number already exists in this business.');
            }
            if (createMemberDto.smartCardNumber &&
                existingMember.SmartCardNumber === createMemberDto.smartCardNumber) {
                throw new common_1.ConflictException('A member with this smart card number already exists in this business.');
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
                        TransactionType: prisma_1.PointTransactionType.ManualAdjust,
                        Points: new library_1.Decimal(initialPoints),
                        Title: 'Initial Points on Registration',
                        Description: `Awarded ${initialPoints} points upon member creation.`,
                        ProcessedByUserID: currentUser.UserID,
                    },
                });
            }
            let cardTypeName = newMember.HeldCardType?.CardName ?? 'N/A';
            const loyaltyCardRelativePath = await (0, loyalty_card_utils_1.generateLoyaltyCard)(newMember, cardTypeName);
            const memberWithCard = await tx.member.update({
                where: { MemberID: newMember.MemberID },
                data: { LoyaltyCardURL: loyaltyCardRelativePath },
                include: { Business: true, HeldCardType: true },
            });
            const fullLoyaltyCardUrl = `${appUrl}${loyaltyCardRelativePath}`;
            const businessName = memberWithCard.Business?.BusinessName || 'our business';
            if (memberWithCard.Email) {
                const absoluteCardPath = `public${loyaltyCardRelativePath}`;
                this.mailService
                    .sendMemberWelcomeEmail(memberWithCard, businessName, absoluteCardPath)
                    .catch((err) => console.error('Failed to send welcome email asynchronously:', err));
            }
            if (memberWithCard.MobileNumber) {
                this.whatsappService
                    .sendWelcomeMessage(memberWithCard.MobileNumber, memberWithCard.FirstName, fullLoyaltyCardUrl)
                    .catch((err) => console.error('Failed to send WhatsApp message asynchronously:', err));
            }
            return this.mapToResponseDto(memberWithCard, currentUser);
        });
    }
    async findAll(queryDto, currentUser) {
        const { page = 1, limit = 10, search, isActive, cardTypeId, memberType, } = queryDto;
        const { businessId } = queryDto;
        const where = {};
        if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            if (businessId) {
                where.BusinessID = businessId;
            }
        }
        else {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('BusinessAdmin has no associated business.');
            }
            where.BusinessID = currentUser.BusinessID;
        }
        if (isActive !== undefined) {
            where.IsActive = isActive;
        }
        else {
            where.IsActive = true;
        }
        if (cardTypeId)
            where.CardTypeID = cardTypeId;
        if (memberType)
            where.MemberType = memberType;
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
        const mappedData = data.map((member) => this.mapToResponseDto(member, currentUser));
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
    async findOne(id, currentUser) {
        const member = await this.prisma.member.findUnique({
            where: { MemberID: id },
            include: { Business: true, HeldCardType: true },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${id} not found.`);
        }
        if (currentUser.Role !== role_enum_1.Role.SuperAdmin &&
            member.BusinessID !== currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You do not have permission to access this member.');
        }
        return this.mapToResponseDto(member, currentUser);
    }
    async findOneBySmartCardNumber(smartCardNumber, currentUser) {
        const where = {
            SmartCardNumber: smartCardNumber,
        };
        if (currentUser.Role === role_enum_1.Role.BusinessAdmin ||
            currentUser.Role === role_enum_1.Role.BusinessSubAdmin) {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('User has no associated business.');
            }
            where.BusinessID = currentUser.BusinessID;
        }
        const member = await this.prisma.member.findFirst({
            where,
            include: { Business: true, HeldCardType: true },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Member with Smart Card Number ${smartCardNumber} not found.`);
        }
        if ((currentUser.Role === role_enum_1.Role.BusinessAdmin ||
            currentUser.Role === role_enum_1.Role.BusinessSubAdmin) &&
            member.BusinessID !== currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You are not authorized to access this member.');
        }
        return this.mapToResponseDto(member, currentUser);
    }
    async update(id, updateMemberDto, currentUser, profileImagePath) {
        const finalProfileImagePath = profileImagePath
            ? profileImagePath.replace(/^public/, '')
            : undefined;
        const member = await this.prisma.member.findUnique({
            where: { MemberID: id },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${id} not found.`);
        }
        if (currentUser.Role !== role_enum_1.Role.SuperAdmin &&
            member.BusinessID !== currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You do not have permission to update this member.');
        }
        if (updateMemberDto.mobileNumber &&
            updateMemberDto.mobileNumber !== member.MobileNumber) {
            const existing = await this.prisma.member.findFirst({
                where: {
                    BusinessID: member.BusinessID,
                    MobileNumber: updateMemberDto.mobileNumber,
                    NOT: { MemberID: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Another member with this mobile number already exists.');
            }
        }
        if (updateMemberDto.smartCardNumber &&
            updateMemberDto.smartCardNumber !== member.SmartCardNumber) {
            const existing = await this.prisma.member.findFirst({
                where: {
                    BusinessID: member.BusinessID,
                    SmartCardNumber: updateMemberDto.smartCardNumber,
                    NOT: { MemberID: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Another member with this smart card number already exists.');
            }
        }
        if (finalProfileImagePath && member.ProfileImageURL) {
            try {
                const oldImagePath = `public${member.ProfileImageURL}`;
                await fs.unlink(oldImagePath);
            }
            catch (error) {
                console.error(`Failed to delete old profile image: ${member.ProfileImageURL}. Error: ${error.message}`);
                if (error instanceof prisma_2.Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002') {
                    throw new common_1.ConflictException(`Update failed due to a conflict. The new mobile number or smart card number might already be in use.`);
                }
                throw new Error(`Failed to update member: ${error.message}`);
            }
        }
        const { memberType, firstName, lastName, mobileNumber, email, gender, address, age, smartCardNumber, isActive, } = updateMemberDto;
        const dataToUpdate = {
            ...(memberType && { MemberType: memberType }),
            ...(firstName && { FirstName: firstName }),
            ...(lastName && { LastName: lastName }),
            ...(mobileNumber && { MobileNumber: mobileNumber }),
            ...(email && { Email: email }),
            ...(gender && { Gender: gender }),
            ...(address && { Address: address }),
            ...(age && { Age: age }),
            ...(smartCardNumber && { SmartCardNumber: smartCardNumber }),
            ...(isActive !== undefined && { IsActive: isActive }),
        };
        if (finalProfileImagePath) {
            dataToUpdate.ProfileImageURL = finalProfileImagePath;
        }
        const updatedMember = await this.prisma.member.update({
            where: { MemberID: id },
            data: dataToUpdate,
            include: { Business: true, HeldCardType: true },
        });
        return this.mapToResponseDto(updatedMember, currentUser);
    }
    async remove(id, currentUser) {
        const member = await this.prisma.member.findUnique({
            where: { MemberID: id },
            include: { Business: true, HeldCardType: true },
        });
        if (!member) {
            throw new common_1.NotFoundException(`Member with ID ${id} not found.`);
        }
        if (currentUser.Role !== role_enum_1.Role.SuperAdmin &&
            member.BusinessID !== currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You do not have permission to deactivate this member.');
        }
        if (!member.IsActive) {
            throw new common_1.BadRequestException('This member is already inactive.');
        }
        const deactivatedMember = await this.prisma.member.update({
            where: { MemberID: id },
            data: { IsActive: false },
            include: { Business: true, HeldCardType: true },
        });
        return this.mapToResponseDto(deactivatedMember, currentUser);
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        whatsapp_service_1.WhatsappService,
        config_1.ConfigService])
], MembersService);
//# sourceMappingURL=members.service.js.map