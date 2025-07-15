import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateBusinessDto {
  @ApiPropertyOptional({
    description: 'The name of the business',
    example: 'Health Plus Clinic Updated',
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Address of the business',
    example: '456 Wellness Rd, City, State',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the business',
    example: '+14155552672',
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Activation status of the business',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
