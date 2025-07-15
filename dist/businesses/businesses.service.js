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
exports.BusinessesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const role_enum_1 = require("../auth/enums/role.enum");
const library_1 = require("../../generated/prisma/runtime/library");
const mail_service_1 = require("../mail/mail.service");
const fs = require("fs/promises");
let BusinessesService = class BusinessesService {
    prisma;
    usersService;
    mailService;
    constructor(prisma, usersService, mailService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.mailService = mailService;
    }
    async create(createBusinessDto, logoPath) {
        const { adminEmail, adminFullName, adminPassword, businessName, address, phoneNumber, } = createBusinessDto;
        const finalLogoPath = logoPath
            ? logoPath.replace(/^public/, '')
            : undefined;
        const existingUser = await this.usersService.findByUsernameOrEmail(adminEmail);
        if (existingUser && !existingUser.BusinessID) {
            throw new common_1.ConflictException(`User with email ${adminEmail} already exists as a SuperAdmin.`);
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
                await this.usersService.create({
                    username: adminEmail,
                    email: adminEmail,
                    fullName: adminFullName,
                    password: adminPassword,
                    role: role_enum_1.Role.BusinessAdmin,
                    businessId: createdBusiness.BusinessID,
                }, tx);
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError &&
                    error.code === 'P2002') {
                    throw new common_1.ConflictException(`Admin user with email ${adminEmail} already exists for business ID ${createdBusiness.BusinessID}.`);
                }
                console.error('Error creating admin user in transaction:', error);
                throw new common_1.InternalServerErrorException(`Could not create admin user: ${error instanceof Error ? error.message : String(error)}`);
            }
            return createdBusiness;
        });
        if (newBusiness) {
            try {
                await this.mailService.sendBusinessRegistrationWelcomeEmail(adminEmail, adminFullName, businessName, adminPassword);
            }
            catch (emailError) {
                console.error(`Failed to send welcome email to ${adminEmail}:`, emailError);
            }
        }
        return newBusiness;
    }
    async findAll() {
        return this.prisma.business.findMany({ where: { IsActive: true } });
    }
    async findAllWithInactive() {
        return this.prisma.business.findMany();
    }
    async findOne(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { BusinessID: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${businessId} not found`);
        }
        return business;
    }
    async update(businessId, updateBusinessDto, logoPath) {
        const { businessName, address, phoneNumber, isActive } = updateBusinessDto;
        const finalLogoPath = logoPath
            ? logoPath.replace(/^public/, '')
            : undefined;
        const existingBusiness = await this.prisma.business.findUnique({
            where: { BusinessID: businessId },
        });
        if (!existingBusiness) {
            throw new common_1.NotFoundException(`Business with ID ${businessId} not found`);
        }
        if (logoPath && existingBusiness.LogoURL) {
            const oldLogoPath = `public${existingBusiness.LogoURL}`;
            try {
                await fs.unlink(oldLogoPath);
            }
            catch (error) {
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
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`Business with ID ${businessId} not found during update.`);
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Update failed. A business with similar unique details might already exist.');
                }
            }
            console.error('Error updating business:', error);
            throw new common_1.InternalServerErrorException(`Could not update business: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async remove(businessId) {
        const existingBusiness = await this.prisma.business.findUnique({
            where: { BusinessID: businessId },
        });
        if (!existingBusiness) {
            throw new common_1.NotFoundException(`Business with ID ${businessId} not found`);
        }
        if (!existingBusiness.IsActive) {
            throw new common_1.ConflictException(`Business with ID ${businessId} is already inactive.`);
        }
        try {
            return await this.prisma.business.update({
                where: { BusinessID: businessId },
                data: { IsActive: false },
            });
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException(`Business with ID ${businessId} not found during deactivation.`);
            }
            console.error('Error deactivating business:', error);
            throw new common_1.InternalServerErrorException(`Could not deactivate business: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.BusinessesService = BusinessesService;
exports.BusinessesService = BusinessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        mail_service_1.MailService])
], BusinessesService);
//# sourceMappingURL=businesses.service.js.map