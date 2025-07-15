import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({
    description: 'The name of the business',
    example: 'Health Plus Clinic',
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiPropertyOptional({
    description: 'Address of the business',
    example: '123 Wellness Ave, City, State',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the business',
    example: '+14155552671',
  })
  @IsPhoneNumber() // Allows any region if argument is omitted
  @IsOptional()
  phoneNumber?: string;

  // Initial Business Admin User Details
  @ApiProperty({
    description: 'Full name of the initial admin user for this business',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  adminFullName: string;

  @ApiProperty({
    description:
      'Email of the initial admin user for this business (will be their username)',
    example: 'jane.doe@healthplus.com',
  })
  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @ApiProperty({
    description: 'Password for the initial admin user',
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Admin password must be at least 8 characters long',
  })
  adminPassword: string;
}
