import { Module } from '@nestjs/common';
import { LoyaltyRulesService } from './loyalty-rules.service';
import { LoyaltyRulesController } from './loyalty-rules.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // For guards and user context

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LoyaltyRulesController],
  providers: [LoyaltyRulesService],
})
export class LoyaltyRulesModule {}
