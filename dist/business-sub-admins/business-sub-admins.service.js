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
exports.BusinessSubAdminsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
const role_enum_1 = require("../auth/enums/role.enum");
const crypto_1 = require("crypto");
let BusinessSubAdminsService = class BusinessSubAdminsService {
    prisma;
    usersService;
    mailService;
    constructor(prisma, usersService, mailService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.mailService = mailService;
    }
    mapToResponseDto(user) {
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
    async create(createDto, currentUser) {
        if (!currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You are not associated with a business and cannot create sub-admins.');
        }
        const business = await this.prisma.business.findUnique({
            where: { BusinessID: currentUser.BusinessID },
        });
        if (!business) {
            throw new common_1.NotFoundException('Your associated business could not be found.');
        }
        let password = createDto.password;
        if (!password) {
            password = (0, crypto_1.randomBytes)(8).toString('hex');
        }
        const username = createDto.email.split('@')[0];
        const newUser = await this.usersService.create({
            ...createDto,
            username,
            role: role_enum_1.Role.BusinessSubAdmin,
            businessId: currentUser.BusinessID,
            password: password,
        });
        await this.mailService.sendBusinessRegistrationWelcomeEmail(newUser.Email, newUser.FullName || '', business.BusinessName, password);
        const userWithBusiness = await this.prisma.user.findUnique({
            where: { UserID: newUser.UserID },
            include: { Business: true },
        });
        if (!userWithBusiness) {
            throw new common_1.NotFoundException(`Could not retrieve created user with ID ${newUser.UserID}`);
        }
        return this.mapToResponseDto(userWithBusiness);
    }
    async findAll(queryDto, currentUser) {
        if (!currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You are not associated with a business and cannot view sub-admins.');
        }
        const { page = 1, limit = 10, search, isActive } = queryDto;
        const skip = (page - 1) * limit;
        const where = {
            BusinessID: currentUser.BusinessID,
            Role: role_enum_1.Role.BusinessSubAdmin,
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
    async findOne(id, currentUser) {
        const user = await this.prisma.user.findUnique({
            where: { UserID: id },
            include: { Business: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Sub-admin with ID ${id} not found.`);
        }
        if (user.BusinessID !== currentUser.BusinessID ||
            user.Role !== role_enum_1.Role.BusinessSubAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to view this user.');
        }
        return this.mapToResponseDto(user);
    }
    async update(id, updateDto, currentUser) {
        const userToUpdate = await this.prisma.user.findUnique({
            where: { UserID: id },
        });
        if (!userToUpdate) {
            throw new common_1.NotFoundException(`Sub-admin with ID ${id} not found.`);
        }
        if (userToUpdate.BusinessID !== currentUser.BusinessID ||
            userToUpdate.Role !== role_enum_1.Role.BusinessSubAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to update this user.');
        }
        if (updateDto.email && updateDto.email !== userToUpdate.Email) {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('Current user has no business associated.');
            }
            const existing = await this.usersService.findUserByEmailAndBusinessId(updateDto.email, currentUser.BusinessID);
            if (existing && existing.UserID !== id) {
                throw new common_1.ConflictException('Another user with this email already exists in this business.');
            }
        }
        const { fullName, email, isActive } = updateDto;
        const dataToUpdate = {};
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
    async remove(id, currentUser) {
        const userToRemove = await this.prisma.user.findUnique({
            where: { UserID: id },
        });
        if (!userToRemove) {
            throw new common_1.NotFoundException(`Sub-admin with ID ${id} not found.`);
        }
        if (userToRemove.BusinessID !== currentUser.BusinessID ||
            userToRemove.Role !== role_enum_1.Role.BusinessSubAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to deactivate this user.');
        }
        const deactivatedUser = await this.prisma.user.update({
            where: { UserID: id },
            data: { IsActive: false },
            include: { Business: true },
        });
        return this.mapToResponseDto(deactivatedUser);
    }
};
exports.BusinessSubAdminsService = BusinessSubAdminsService;
exports.BusinessSubAdminsService = BusinessSubAdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        mail_service_1.MailService])
], BusinessSubAdminsService);
//# sourceMappingURL=business-sub-admins.service.js.map