import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class FindAllCardTypesQueryDto {
  @ApiProperty({
    description: 'Page number for pagination.',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page.',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Max limit to prevent abuse
  limit?: number = 10;

  @ApiProperty({
    description:
      'Filter by Business ID (only applicable for SuperAdmins). BusinessAdmins will have this inferred.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  businessId?: number;

  @ApiProperty({
    description: 'Search term to filter card types by name.',
    example: 'Gold',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
