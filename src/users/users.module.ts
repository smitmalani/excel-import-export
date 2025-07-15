import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// PrismaModule is global, so no need to import it here explicitly
// import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // imports: [PrismaModule], // Not strictly necessary if PrismaModule is global
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService for AuthModule to use
})
export class UsersModule {}
