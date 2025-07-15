import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User, Member } from '../../generated/prisma';
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    constructor(mailerService: MailerService, configService: ConfigService);
    sendPasswordResetEmail(user: User, token: string): Promise<void>;
    sendBusinessRegistrationWelcomeEmail(to: string, adminFullName: string, businessName: string, password: string): Promise<void>;
    sendMemberWelcomeEmail(member: Member, businessName: string, loyaltyCardPath: string): Promise<void>;
}
