import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { User } from '../../generated/prisma';

type RequestWithUser = Request & { user: Omit<User, 'PasswordHash'> };

// Define a type for the login response to use in @ApiResponse

class UserResponse {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'superadmin' })
  username: string;
  @ApiProperty({ example: 'superadmin@example.com' })
  email: string;
  @ApiProperty({ example: 'SuperAdmin' })
  role: string; // Should match Role enum ideally
  @ApiProperty({ example: 'Super Admin User', nullable: true })
  fullName?: string;
  @ApiProperty({ example: null, nullable: true })
  businessId?: number;
}
class LoginSuccessResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;
}

class MessageResponse {
  @ApiProperty({ example: 'Operation successful' })
  message: string;
}

@ApiTags('Authentication') // Group endpoints under 'Authentication' tag in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in a user',
    description:
      'Authenticates a user and returns a JWT access token along with user details.',
  })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in.',
    type: LoginSuccessResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials or user inactive.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Input validation failed.',
  })
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Initiate password reset',
    description:
      "Sends a password reset link to the user's email address if the account exists and is active.",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description:
      'If an account with this email exists and is active, a password reset link has been sent.',
    type: MessageResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Input validation failed.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset user password',
    description:
      "Resets the user's password using a valid token received via email.",
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully reset.',
    type: MessageResponse,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. Invalid or expired token, or input validation failed.',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Example of a protected route to demonstrate JWT auth in Swagger
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth') // Matches the name given in main.ts addBearerAuth
  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile (Protected)',
    description:
      'Returns the profile of the currently authenticated user. Requires JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: UserResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token missing or invalid.',
  })
  getProfile(@Req() req: RequestWithUser) {
    // req.user is populated by JwtStrategy after successful token validation
    // We need to ensure what JwtStrategy returns matches UserResponse structure or adapt it
    const userFromJwt = req.user;
    return {
      id: userFromJwt.UserID,
      username: userFromJwt.Username,
      email: userFromJwt.Email,
      role: userFromJwt.Role,
      fullName: userFromJwt.FullName,
      businessId: userFromJwt.BusinessID,
    } as UserResponse;
  }
}
