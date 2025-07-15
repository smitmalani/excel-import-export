import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessSubAdminDto {
  @ApiProperty({
    description: 'The full name of the business sub-admin.',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'The email address of the business sub-admin.',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description:
      'The password for the business sub-admin. If not provided, a random one will be generated and sent via email.',
    example: 'Str0ngP@ssw0rd!',
  })
  @IsOptional()
  @IsString()
  @Length(6, 50)
  password?: string;
}
