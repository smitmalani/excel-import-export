import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateServiceOfferingDto {
  @ApiProperty({
    description: 'The name of the service offering.',
    example: 'Standard Consultation',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  serviceName: string;

  @ApiProperty({
    description:
      'The ID of the CardType this service offering is associated with.',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  cardTypeId: number;

  @ApiPropertyOptional({
    description: 'Optional description for the service offering.',
    example: 'A standard 30-minute consultation with a general practitioner.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description:
      'The ID of the Business this service offering belongs to. Required for SuperAdmins only. BusinessAdmins will have this inferred from their token.',
    example: 1,
  })
  @IsOptional() // Optional because it can be inferred for BusinessAdmin
  @IsInt()
  @IsPositive()
  businessId?: number;
}
