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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    mailerService;
    configService;
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async sendPasswordResetEmail(user, token) {
        const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/reset-password?token=${token}`;
        const mailFrom = this.configService.get('MAIL_FROM');
        try {
            await this.mailerService.sendMail({
                to: user.Email,
                from: mailFrom,
                subject: 'Password Reset Request',
                template: 'password-reset',
                context: {
                    name: user.FullName || user.Username,
                    resetUrl,
                    currentYear: new Date().getFullYear(),
                },
            });
            console.log(`Password reset email sent to ${user.Email}`);
        }
        catch (error) {
            console.error(`Failed to send password reset email to ${user.Email}:`, error);
        }
    }
    async sendBusinessRegistrationWelcomeEmail(to, adminFullName, businessName, password) {
        const loginUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:5173')}/login`;
        const platformName = this.configService.get('PLATFORM_NAME', 'Our Loyalty Platform');
        const mailFrom = this.configService.get('MAIL_FROM');
        try {
            await this.mailerService.sendMail({
                to: to,
                from: mailFrom,
                subject: `Welcome to ${platformName} - Your Business is Registered!`,
                template: './business-registration-welcome',
                context: {
                    adminFullName: adminFullName,
                    businessName: businessName,
                    email: to,
                    password: password,
                    loginUrl: loginUrl,
                    platformName: platformName,
                    currentYear: new Date().getFullYear(),
                },
            });
            console.log(`Business registration welcome email sent to ${to}`);
        }
        catch (error) {
            console.error(`Failed to send business registration welcome email to ${to}:`, error);
        }
    }
    async sendMemberWelcomeEmail(member, businessName, loyaltyCardPath) {
        if (!member.Email) {
            console.log(`Member ${member.MemberID} has no email address. Skipping welcome email.`);
            return;
        }
        const platformName = this.configService.get('PLATFORM_NAME', 'Our Loyalty Platform');
        const mailFrom = this.configService.get('MAIL_FROM');
        try {
            await this.mailerService.sendMail({
                to: member.Email,
                from: mailFrom,
                subject: `Welcome to the ${businessName} Loyalty Program!`,
                template: './member-welcome',
                context: {
                    memberName: member.FirstName,
                    businessName: businessName,
                    platformName: platformName,
                    currentYear: new Date().getFullYear(),
                },
                attachments: [
                    {
                        filename: 'loyalty-card.png',
                        path: loyaltyCardPath,
                        cid: 'loyaltycard',
                    },
                ],
            });
            console.log(`Member welcome email sent to ${member.Email}`);
        }
        catch (error) {
            console.error(`Failed to send member welcome email to ${member.Email}:`, error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map