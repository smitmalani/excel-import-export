import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/enums/role.enum';

interface UserCreationPayload {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role: Role;
  businessId?: number | null;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: UserCreationPayload,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const prismaClient = tx || this.prisma;
    const { username, email, password, fullName, role, businessId } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return await prismaClient.user.create({
        data: {
          Username: username,
          Email: email,
          PasswordHash: hashedPassword,
          FullName: fullName,
          Role: role,
          BusinessID: businessId,
          IsActive: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          let conflictField = 'details';
          if (error.meta && Array.isArray(error.meta.target)) {
            conflictField = (error.meta.target as string[]).join(', ');
          }
          throw new ConflictException(
            `User creation failed. A user with the same ${conflictField} already exists.`,
          );
        }
      }
      console.error('Error during user creation:', error);
      throw new InternalServerErrorException('Could not create user.');
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { Username: username } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    // Note: The schema has @@unique([Email, BusinessID]).
    // For a general email lookup (e.g., for SuperAdmin or if email is globally unique for other roles),
    // this might need adjustment or specific handling if BusinessID context is required.
    // For now, assuming email is sought without specific BusinessID context for auth initiation.
    return this.prisma.user.findFirst({ where: { Email: email } });
  }

  async findUserByEmailAndBusinessId(
    email: string,
    businessId: number,
  ): Promise<User | null> {
    if (!businessId) {
      // If businessId is not provided, this specific query is not possible
      // or should fall back to a global email search, which findOneByEmail might cover.
      // For clarity, this method strictly requires a businessId.
      return null;
    }
    return this.prisma.user.findUnique({
      where: {
        Email_BusinessID: {
          Email: email,
          BusinessID: businessId,
        },
      },
    });
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    // First, try to find by username. Usernames are globally unique.
    let user = await this.prisma.user.findUnique({
      where: { Username: usernameOrEmail },
    });
    if (user) {
      return user;
    }
    // If not found by username, try to find by email.
    // This query assumes that for the purpose of this check (e.g. in BusinessesService),
    // finding any user with this email is sufficient.
    // The unique constraint @@unique([Email, BusinessID]) means an email can exist for multiple businesses.
    // If a more specific check (e.g., email for a SuperAdmin, or email for a specific BusinessID) is needed,
    // this logic might need refinement based on the caller's context.
    user = await this.prisma.user.findFirst({
      where: { Email: usernameOrEmail },
    });
    return user;
  }

  async findOneById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { UserID: userId } });
  }

  async update(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { UserID: userId },
      data,
    });
  }

  async setPasswordResetToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<User | null> {
    return this.prisma.user.update({
      where: { UserID: userId },
      data: {
        PasswordResetToken: token,
        PasswordResetTokenExpiresAt: expiresAt,
      },
    });
  }

  async clearPasswordResetToken(userId: number): Promise<User | null> {
    return this.prisma.user.update({
      where: { UserID: userId },
      data: {
        PasswordResetToken: null,
        PasswordResetTokenExpiresAt: null,
      },
    });
  }

  async findUserByValidResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { PasswordResetToken: token },
    });

    if (
      !user ||
      !user.PasswordResetTokenExpiresAt ||
      user.PasswordResetTokenExpiresAt < new Date()
    ) {
      if (user) {
        // Token found but expired or invalid, clear it from the user record
        await this.clearPasswordResetToken(user.UserID);
      }
      return null; // Token is invalid or expired
    }
    return user; // Token is valid
  }

  async changePassword(
    userId: number,
    oldPassword,
    newPassword,
  ): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new InternalServerErrorException('User not found.');
    }

    const isPasswordMatching = await bcrypt.compare(
      oldPassword,
      user.PasswordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await this.update(user.UserID, { PasswordHash: newPasswordHash });
  }
}
