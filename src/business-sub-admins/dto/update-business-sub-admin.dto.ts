import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBusinessSubAdminDto {
  @ApiPropertyOptional({
    description: 'The full name of the business sub-admin.',
    example: 'Johnathan Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'The email address of the business sub-admin.',
    example: 'john.doe.new@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Set the active status of the business sub-admin.',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
