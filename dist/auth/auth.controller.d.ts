import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../../generated/prisma';
type RequestWithUser = Request & {
    user: Omit<User, 'PasswordHash'>;
};
declare class UserResponse {
    id: number;
    username: string;
    email: string;
    role: string;
    fullName?: string;
    businessId?: number;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: RequestWithUser): UserResponse;
}
export {};
