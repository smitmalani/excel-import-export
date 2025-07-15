import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBusinessAdminDto {
  @ApiProperty({
    description: 'The ID of the business this admin belongs to.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  businessId: number;

  @ApiProperty({
    description: 'Full name of the business admin.',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    description:
      'Email address of the business admin. Must be unique for the business.',
    example: 'john.doe@business.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the business admin account.',
    example: 'SecurePassword123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
