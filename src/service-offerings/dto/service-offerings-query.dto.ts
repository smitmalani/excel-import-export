import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';

export class ServiceOfferingsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by Business ID (SuperAdmin only).',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  businessId?: number;

  @ApiPropertyOptional({
    description: 'Search term for service name.',
    example: 'Consultation',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status.',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean) // Transform to string to handle 'true'/'false' query params
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by CardType ID.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  cardTypeId?: number;
}
