import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class UpdateLoyaltyRuleDto {
  @ApiPropertyOptional({
    description:
      'Percentage of transaction amount to earn as points. Applicable only if rule type is "Earn". Max 999.99.',
    type: Number,
    format: 'decimal',
    example: 10.5,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Earn point percentage must be a number with up to 2 decimal places.',
    },
  )
  @Min(0.01)
  @Max(999.99)
  earnPointPercentage?: number;

  @ApiPropertyOptional({
    description:
      'Points equivalent to one unit of currency for redemption. Applicable only if rule type is "Redeem".',
    type: Number,
    format: 'decimal',
    example: 100.0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Points per unit currency must be a number with up to 2 decimal places.',
    },
  )
  @Min(0.01)
  pointsPerUnitCurrency?: number;

  @ApiPropertyOptional({ description: 'Optional description for the rule.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Set rule as active or inactive.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
