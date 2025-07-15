import { Module } from '@nestjs/common';
import { ServiceOfferingsService } from './service-offerings.service';
import { ServiceOfferingsController } from './service-offerings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule], // AuthModule is needed for RolesGuard and JwtAuthGuard
  controllers: [ServiceOfferingsController],
  providers: [ServiceOfferingsService],
})
export class ServiceOfferingsModule {}
