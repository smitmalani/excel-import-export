import { Module } from "@nestjs/common";
import { PointTransactionsService } from "./point-transactions.service";
import { PointTransactionsController } from "./point-transactions.controller";
import { PrismaModule } from "@/prisma/prisma.module";
import { AuthModule } from "@/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PointTransactionsController],
  providers: [PointTransactionsService],
})
export class PointTransactionsModule {}
