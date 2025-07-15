import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { BusinessesModule } from './businesses/businesses.module';
import { BusinessAdminsModule } from './business-admins/business-admins.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServiceOfferingsModule } from './service-offerings/service-offerings.module';
import { CardTypesModule } from './card-types/card-types.module';
import { LoyaltyRulesModule } from './loyalty-rules/loyalty-rules.module';
import { MembersModule } from './members/members.module';
import { BusinessSubAdminsModule } from './business-sub-admins/business-sub-admins.module';
import { PointTransactionsModule } from './point-transactions/point-transactions.module';
import { ExcelImportExportModule } from './excel-import-export/excel-import-export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available globally
      envFilePath: '.env', // Specify the .env file path
    }),
    PrismaModule, // Prisma ORM setup (already global)
    UsersModule, // User management
    AuthModule, // Authentication logic
    MailModule, // Email sending capabilities
    BusinessesModule,
    BusinessAdminsModule,
    DashboardModule,
    ServiceOfferingsModule,
    CardTypesModule,
    LoyaltyRulesModule,
    MembersModule,
    BusinessSubAdminsModule,
    PointTransactionsModule,
    ExcelImportExportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
