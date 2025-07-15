import { Module } from '@nestjs/common';
import { BusinessAdminsService } from './business-admins.service';
import { BusinessAdminsController } from './business-admins.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, MailModule],
  controllers: [BusinessAdminsController],
  providers: [BusinessAdminsService],
})
export class BusinessAdminsModule {}
