import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password reset token received by email',
    example: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description:
      'The new password for the user account. Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number or special character.',
    example: 'NewSecureP@ssw0rd',
    minLength: 8,
    pattern: '((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number or special character.',
  })
  newPassword: string;
}
