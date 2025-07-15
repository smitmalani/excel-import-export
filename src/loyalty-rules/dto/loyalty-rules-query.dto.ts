import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { LoyaltyRuleType } from '../enums/loyalty-rule-type.enum';
import { Type } from 'class-transformer';

export class LoyaltyRulesQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by Service Offering ID.',
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceOfferingId?: number;

  @ApiPropertyOptional({
    enum: LoyaltyRuleType,
    description: 'Filter by rule type.',
  })
  @IsOptional()
  @IsEnum(LoyaltyRuleType)
  ruleType?: LoyaltyRuleType;
}
