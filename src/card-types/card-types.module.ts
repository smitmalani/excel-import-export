import { Module } from '@nestjs/common';
import { CardTypesService } from './card-types.service';
import { CardTypesController } from './card-types.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // For guards and user context

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Provides JwtAuthGuard, RolesGuard, and potentially user info via @Req
  ],
  controllers: [CardTypesController],
  providers: [CardTypesService],
  exports: [CardTypesService], // Export if other modules might need to use CardTypesService directly
})
export class CardTypesModule {}
