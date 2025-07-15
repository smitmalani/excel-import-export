import { Module } from '@nestjs/common';
import { BusinessSubAdminsService } from './business-sub-admins.service';
import { BusinessSubAdminsController } from './business-sub-admins.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, MailModule],
  controllers: [BusinessSubAdminsController],
  providers: [BusinessSubAdminsService],
})
export class BusinessSubAdminsModule {}
