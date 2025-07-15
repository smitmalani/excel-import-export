import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Username or Email of the user',
    example: 'superadmin', // or 'superadmin@example.com'
  })
  @IsNotEmpty()
  @IsString()
  // Allowing either email or username for login, you can choose one or adapt service
  // For simplicity, let's assume username for now as per User model in Prisma schema.
  // If email login is preferred, change this to @IsEmail()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'loyalty@2025',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
