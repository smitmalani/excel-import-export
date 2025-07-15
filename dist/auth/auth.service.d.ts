import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { User } from '../../generated/prisma';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, mailService: MailService);
    validateUser(usernameOrEmail: string, pass: string): Promise<Omit<User, 'PasswordHash'> | null>;
    login(loginDto: LoginAuthDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            role: import("../../generated/prisma").$Enums.Role;
            fullName: string | null;
            businessId: number | null;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
