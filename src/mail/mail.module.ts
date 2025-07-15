import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is available
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here to use ConfigService in useFactory
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports like 587
          auth: {
            user: configService.get<string>('GMAIL_USER'),
            pass: configService.get<string>('GMAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>(
            'MAIL_FROM',
            '"No Reply" <noreply@example.com>',
          ),
        },
        template: {
          dir: join(__dirname, 'templates'), // Path to email templates
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
