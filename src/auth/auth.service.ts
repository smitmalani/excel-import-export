import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { User } from '../../generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser(
    usernameOrEmail: string,
    pass: string,
  ): Promise<Omit<User, 'PasswordHash'> | null> {
    // Try finding user by username first
    let user = await this.usersService.findOneByUsername(usernameOrEmail);

    // If not found by username, try by email
    if (!user) {
      const potentialUserByEmail =
        await this.usersService.findOneByEmail(usernameOrEmail);
      // SuperAdmins have globally unique emails (BusinessID is NULL)
      // For other roles, email is unique per BusinessID.
      // If usernameOrEmail was an email, this will find the user.
      // If it was a username that didn't match, and also an email that exists, it might lead to issues
      // if emails are not globally unique for login.
      // Current DTO uses 'usernameOrEmail', making it ambiguous.
      // This logic assumes if username fails, we try email.
      // This primarily covers SuperAdmin by email and others if their email was provided and is found.
      // A more robust solution might involve separate login fields or clearer rules.
      user = potentialUserByEmail;
    }
    console.log(user)
    if (
      user &&
      user.IsActive &&
      (await bcrypt.compare(pass, user.PasswordHash))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { PasswordHash, ...result } = user;
      return result;
    }else{
      return null;
    }
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.validateUser(
      loginDto.usernameOrEmail,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials or user inactive.');
    }

    const payload = {
      username: user.Username,
      sub: user.UserID,
      role: user.Role,
      businessId: user.BusinessID,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.UserID,
        username: user.Username,
        email: user.Email,
        role: user.Role,
        fullName: user.FullName,
        businessId: user.BusinessID,
      },
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(
      forgotPasswordDto.email,
    );

    // Security: Always return a generic message to prevent email enumeration,
    // whether the user exists, is inactive, or email sending fails.
    const genericSuccessMessage =
      'If an account with this email exists and is active, a password reset link has been sent.';

    if (!user || !user.IsActive) {
      console.warn(
        `Password reset attempt for non-existent or inactive email: ${forgotPasswordDto.email}`,
      );
      return { message: genericSuccessMessage };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour

    try {
      // This relies on UsersService.setPasswordResetToken and schema update
      await this.usersService.setPasswordResetToken(
        user.UserID,
        token,
        expiresAt,
      );
    } catch (error) {
      console.error(
        'Failed to set password reset token for user: ',
        user.UserID,
        error,
      );
      // Do not throw error to client, maintain generic message
      return { message: genericSuccessMessage };
    }

    try {
      await this.mailService.sendPasswordResetEmail(user, token);
    } catch (error) {
      console.error(
        'Failed to send password reset email for user:',
        user.UserID,
        error,
      );
      // Do not throw error to client, maintain generic message
    }

    return { message: genericSuccessMessage };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.usersService.findUserByValidResetToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Adjust salt rounds as needed

    await this.usersService.update(user.UserID, {
      PasswordHash: hashedPassword,
      // Business logic might require clearing the token here or in a separate step
      // For safety, ensure this method in usersService also clears the token fields.
    });

    // Explicitly clear token after successful password update
    await this.usersService.clearPasswordResetToken(user.UserID);

    // Optionally, send a confirmation email that the password was changed.
    // await this.mailService.sendPasswordChangedEmail(user);

    return { message: 'Password has been successfully reset.' };
  }
}
