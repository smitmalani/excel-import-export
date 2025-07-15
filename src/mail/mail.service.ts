import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User, Member } from '../../generated/prisma';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(user: User, token: string) {
    // In a real app, you would generate a URL for your frontend reset password page
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
      'http://localhost:5173', // Default frontend URL if not in .env
    )}/reset-password?token=${token}`;

    const mailFrom = this.configService.get<string>('MAIL_FROM');

    try {
      await this.mailerService.sendMail({
        to: user.Email,
        from: mailFrom, // Optional: override default from address
        subject: 'Password Reset Request',
        template: 'password-reset', // We'll need to create this template
        context: {
          name: user.FullName || user.Username,
          resetUrl,
          currentYear: new Date().getFullYear(),
        },
      });
      console.log(`Password reset email sent to ${user.Email}`);
    } catch (error) {
      console.error(
        `Failed to send password reset email to ${user.Email}:`,
        error,
      );
      // Potentially throw an error or handle it as per your app's error handling strategy
    }
  }

  async sendBusinessRegistrationWelcomeEmail(
    to: string,
    adminFullName: string,
    businessName: string,
    password: string, // The plain text password
  ) {
    const loginUrl = `${this.configService.get(
      'FRONTEND_URL',
      'http://localhost:5173',
    )}/login`;
    const platformName = this.configService.get<string>(
      'PLATFORM_NAME',
      'Our Loyalty Platform', // Default platform name
    );
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    try {
      await this.mailerService.sendMail({
        to: to,
        from: mailFrom,
        subject: `Welcome to ${platformName} - Your Business is Registered!`,
        template: './business-registration-welcome', // Path relative to mail/templates directory
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
    } catch (error) {
      console.error(
        `Failed to send business registration welcome email to ${to}:`,
        error,
      );
      // Consider re-throwing or handling more robustly if email is critical
    }
  }

  async sendMemberWelcomeEmail(
    member: Member,
    businessName: string,
    loyaltyCardPath: string,
  ) {
    if (!member.Email) {
      console.log(
        `Member ${member.MemberID} has no email address. Skipping welcome email.`,
      );
      return;
    }

    const platformName = this.configService.get<string>(
      'PLATFORM_NAME',
      'Our Loyalty Platform',
    );
    const mailFrom = this.configService.get<string>('MAIL_FROM');

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
            cid: 'loyaltycard', // content id for embedding in template
          },
        ],
      });
      console.log(`Member welcome email sent to ${member.Email}`);
    } catch (error) {
      console.error(
        `Failed to send member welcome email to ${member.Email}:`,
        error,
      );
    }
  }
}
