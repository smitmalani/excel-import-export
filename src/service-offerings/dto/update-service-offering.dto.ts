import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
  IsPositive,
} from 'class-validator';

export class UpdateServiceOfferingDto {
  @ApiPropertyOptional({
    description: 'The name of the service offering.',
    example: 'Premium Consultation',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  serviceName?: string;

  @ApiPropertyOptional({
    description:
      'The ID of the CardType this service offering is associated with.',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  cardTypeId?: number;

  @ApiPropertyOptional({
    description: 'Optional description for the service offering.',
    example: 'An extended 60-minute consultation with a specialist.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Set the active status of the service offering.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
