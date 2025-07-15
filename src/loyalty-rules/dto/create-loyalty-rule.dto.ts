import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateIf,
  IsPositive,
} from 'class-validator';
import { LoyaltyRuleType } from '../enums/loyalty-rule-type.enum';

export class CreateLoyaltyRuleDto {
  @ApiProperty({
    description: 'ID of the service offering this rule applies to.',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  serviceOfferingId: number;

  @ApiProperty({
    enum: LoyaltyRuleType,
    description: 'Type of the loyalty rule.',
  })
  @IsNotEmpty()
  @IsEnum(LoyaltyRuleType)
  ruleType: LoyaltyRuleType;

  @ApiPropertyOptional({
    description:
      'Percentage of transaction amount to earn as points. Required if ruleType is "Earn". Max 999.99.',
    type: Number,
    format: 'decimal',
    example: 10.5,
  })
  @ValidateIf((o: CreateLoyaltyRuleDto) => o.ruleType === LoyaltyRuleType.Earn)
  @IsNotEmpty({
    message: 'Earn point percentage is required for Earn type rules.',
  })
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
      'Points equivalent to one unit of currency for redemption. Required if ruleType is "Redeem".',
    type: Number,
    format: 'decimal',
    example: 100.0,
  })
  @ValidateIf(
    (o: CreateLoyaltyRuleDto) => o.ruleType === LoyaltyRuleType.Redeem,
  )
  @IsNotEmpty({
    message: 'Points per unit currency is required for Redeem type rules.',
  })
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
}
