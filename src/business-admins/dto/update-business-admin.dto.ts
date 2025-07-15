import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateBusinessAdminDto {
  @ApiPropertyOptional({
    description: 'Full name of the business admin.',
    example: 'Johnathan Doe',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiPropertyOptional({
    description:
      'Email address of the business admin. Must be unique for the business.',
    example: 'johnathan.doe@business.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Set the active status of the business admin.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
