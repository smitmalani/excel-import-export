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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../mail/mail.service");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    mailService;
    constructor(usersService, jwtService, configService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
    }
    async validateUser(usernameOrEmail, pass) {
        let user = await this.usersService.findOneByUsername(usernameOrEmail);
        if (!user) {
            const potentialUserByEmail = await this.usersService.findOneByEmail(usernameOrEmail);
            user = potentialUserByEmail;
        }
        console.log(user);
        if (user &&
            user.IsActive &&
            (await bcrypt.compare(pass, user.PasswordHash))) {
            const { PasswordHash, ...result } = user;
            return result;
        }
        else {
            return null;
        }
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials or user inactive.');
        }
        const payload = {
            username: user.Username,
            sub: user.UserID,
            role: user.Role,
            businessId: user.BusinessID,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.UserID,
                username: user.Username,
                email: user.Email,
                role: user.Role,
                fullName: user.FullName,
                businessId: user.BusinessID,
            },
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findOneByEmail(forgotPasswordDto.email);
        const genericSuccessMessage = 'If an account with this email exists and is active, a password reset link has been sent.';
        if (!user || !user.IsActive) {
            console.warn(`Password reset attempt for non-existent or inactive email: ${forgotPasswordDto.email}`);
            return { message: genericSuccessMessage };
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000);
        try {
            await this.usersService.setPasswordResetToken(user.UserID, token, expiresAt);
        }
        catch (error) {
            console.error('Failed to set password reset token for user: ', user.UserID, error);
            return { message: genericSuccessMessage };
        }
        try {
            await this.mailService.sendPasswordResetEmail(user, token);
        }
        catch (error) {
            console.error('Failed to send password reset email for user:', user.UserID, error);
        }
        return { message: genericSuccessMessage };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const user = await this.usersService.findUserByValidResetToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired password reset token.');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.UserID, {
            PasswordHash: hashedPassword,
        });
        await this.usersService.clearPasswordResetToken(user.UserID);
        return { message: 'Password has been successfully reset.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map