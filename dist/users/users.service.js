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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_1 = require("../../generated/prisma");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, tx) {
        const prismaClient = tx || this.prisma;
        const { username, email, password, fullName, role, businessId } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            return await prismaClient.user.create({
                data: {
                    Username: username,
                    Email: email,
                    PasswordHash: hashedPassword,
                    FullName: fullName,
                    Role: role,
                    BusinessID: businessId,
                    IsActive: true,
                },
            });
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    let conflictField = 'details';
                    if (error.meta && Array.isArray(error.meta.target)) {
                        conflictField = error.meta.target.join(', ');
                    }
                    throw new common_1.ConflictException(`User creation failed. A user with the same ${conflictField} already exists.`);
                }
            }
            console.error('Error during user creation:', error);
            throw new common_1.InternalServerErrorException('Could not create user.');
        }
    }
    async findOneByUsername(username) {
        return this.prisma.user.findUnique({ where: { Username: username } });
    }
    async findOneByEmail(email) {
        return this.prisma.user.findFirst({ where: { Email: email } });
    }
    async findUserByEmailAndBusinessId(email, businessId) {
        if (!businessId) {
            return null;
        }
        return this.prisma.user.findUnique({
            where: {
                Email_BusinessID: {
                    Email: email,
                    BusinessID: businessId,
                },
            },
        });
    }
    async findByUsernameOrEmail(usernameOrEmail) {
        let user = await this.prisma.user.findUnique({
            where: { Username: usernameOrEmail },
        });
        if (user) {
            return user;
        }
        user = await this.prisma.user.findFirst({
            where: { Email: usernameOrEmail },
        });
        return user;
    }
    async findOneById(userId) {
        return this.prisma.user.findUnique({ where: { UserID: userId } });
    }
    async update(userId, data) {
        return this.prisma.user.update({
            where: { UserID: userId },
            data,
        });
    }
    async setPasswordResetToken(userId, token, expiresAt) {
        return this.prisma.user.update({
            where: { UserID: userId },
            data: {
                PasswordResetToken: token,
                PasswordResetTokenExpiresAt: expiresAt,
            },
        });
    }
    async clearPasswordResetToken(userId) {
        return this.prisma.user.update({
            where: { UserID: userId },
            data: {
                PasswordResetToken: null,
                PasswordResetTokenExpiresAt: null,
            },
        });
    }
    async findUserByValidResetToken(token) {
        const user = await this.prisma.user.findUnique({
            where: { PasswordResetToken: token },
        });
        if (!user ||
            !user.PasswordResetTokenExpiresAt ||
            user.PasswordResetTokenExpiresAt < new Date()) {
            if (user) {
                await this.clearPasswordResetToken(user.UserID);
            }
            return null;
        }
        return user;
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new common_1.InternalServerErrorException('User not found.');
        }
        const isPasswordMatching = await bcrypt.compare(oldPassword, user.PasswordHash);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await this.update(user.UserID, { PasswordHash: newPasswordHash });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map