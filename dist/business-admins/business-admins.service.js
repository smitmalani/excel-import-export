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
exports.BusinessAdminsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
const role_enum_1 = require("../auth/enums/role.enum");
let BusinessAdminsService = class BusinessAdminsService {
    prisma;
    usersService;
    mailService;
    constructor(prisma, usersService, mailService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.mailService = mailService;
    }
    mapToResponseDto(user) {
        if (!user.BusinessID) {
            throw new Error('BusinessAdmin user does not have a BusinessID.');
        }
        return {
            UserID: user.UserID,
            BusinessID: user.BusinessID,
            BusinessName: user.Business?.BusinessName,
            Role: user.Role,
            Username: user.Username,
            FullName: user.FullName,
            Email: user.Email,
            IsActive: user.IsActive,
            LastLogin: user.LastLogin,
            CreatedAt: user.CreatedAt,
            UpdatedAt: user.UpdatedAt,
        };
    }
    async create(createBusinessAdminDto) {
        const { businessId, email, fullName, password } = createBusinessAdminDto;
        const business = await this.prisma.business.findUnique({
            where: { BusinessID: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${businessId} not found.`);
        }
        if (!business.IsActive) {
            throw new common_1.BadRequestException(`Business with ID ${businessId} is not active.`);
        }
        const existingAdminInBusiness = await this.usersService.findUserByEmailAndBusinessId(email, businessId);
        if (existingAdminInBusiness) {
            throw new common_1.ConflictException(`An admin with email '${email}' already exists for this business.`);
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
                throw new common_1.ConflictException('Could not generate a unique username after multiple attempts.');
            }
        }
        try {
            const newUserWithoutRelation = await this.usersService.create({
                username,
                email,
                password,
                fullName,
                role: role_enum_1.Role.BusinessAdmin,
                businessId,
            });
            await this.mailService.sendBusinessRegistrationWelcomeEmail(newUserWithoutRelation.Email, newUserWithoutRelation.FullName || 'Admin', business.BusinessName, password);
            const newUserWithBusiness = await this.prisma.user.findUnique({
                where: { UserID: newUserWithoutRelation.UserID },
                include: { Business: true },
            });
            if (!newUserWithBusiness) {
                throw new common_1.InternalServerErrorException('Failed to retrieve newly created admin details.');
            }
            return this.mapToResponseDto(newUserWithBusiness);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create business admin. Email or username might already be in use globally or for this business.');
        }
    }
    async findAll(businessId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const whereClause = { Role: role_enum_1.Role.BusinessAdmin };
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
            data: users.map((user) => this.mapToResponseDto(user)),
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
    async findOne(userId) {
        const user = await this.prisma.user.findFirst({
            where: { UserID: userId, Role: role_enum_1.Role.BusinessAdmin },
            include: { Business: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Business admin with ID ${userId} not found.`);
        }
        return this.mapToResponseDto(user);
    }
    async update(userId, updateDto) {
        const existingAdmin = await this.findOne(userId);
        if (updateDto.email && updateDto.email !== existingAdmin.Email) {
            const emailConflict = await this.usersService.findUserByEmailAndBusinessId(updateDto.email, existingAdmin.BusinessID);
            if (emailConflict && emailConflict.UserID !== userId) {
                throw new common_1.ConflictException(`Email '${updateDto.email}' is already in use by another admin in this business.`);
            }
        }
        await this.usersService.update(userId, {
            ...(updateDto.fullName && { FullName: updateDto.fullName }),
            ...(updateDto.email && { Email: updateDto.email }),
            ...(updateDto.isActive !== undefined && { IsActive: updateDto.isActive }),
        });
        const updatedUserWithBusiness = await this.prisma.user.findUnique({
            where: { UserID: userId },
            include: { Business: true },
        });
        if (!updatedUserWithBusiness) {
            throw new common_1.InternalServerErrorException('Failed to retrieve updated admin details.');
        }
        return this.mapToResponseDto(updatedUserWithBusiness);
    }
    async remove(userId) {
        await this.findOne(userId);
        await this.usersService.update(userId, {
            IsActive: false,
        });
        const deactivatedUserWithBusiness = await this.prisma.user.findUnique({
            where: { UserID: userId },
            include: { Business: true },
        });
        if (!deactivatedUserWithBusiness) {
            throw new common_1.InternalServerErrorException('Failed to retrieve deactivated admin details.');
        }
        return this.mapToResponseDto(deactivatedUserWithBusiness);
    }
};
exports.BusinessAdminsService = BusinessAdminsService;
exports.BusinessAdminsService = BusinessAdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        mail_service_1.MailService])
], BusinessAdminsService);
//# sourceMappingURL=business-admins.service.js.map