import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Adjusted path
import { AuthModule } from '../auth/auth.module'; // For JwtAuthGuard, RolesGuard if not global
import { UsersModule } from '../users/users.module'; // For UsersService
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Guards are often part of AuthModule exports or provided globally
    UsersModule,
    MailModule,
  ],
  controllers: [BusinessesController],
  providers: [BusinessesService],
})
export class BusinessesModule {}
