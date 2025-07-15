import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoyaltyRuleType } from '../enums/loyalty-rule-type.enum';

export class LoyaltyRuleResponseDto {
  @ApiProperty()
  ruleId: number;

  @ApiProperty()
  serviceOfferingId: number;

  @ApiProperty({ description: 'Name of the service offering.' })
  serviceOfferingName: string;

  @ApiProperty({
    description: 'Name of the card type associated with the service offering.',
  })
  cardTypeName: string;

  @ApiProperty({
    enum: LoyaltyRuleType,
    description: 'Type of the loyalty rule.',
  })
  ruleType: LoyaltyRuleType;

  @ApiPropertyOptional({
    description:
      'Percentage of transaction amount to earn as points. Applicable if ruleType is "Earn".',
    type: Number,
    format: 'decimal',
  })
  earnPointPercentage?: number;

  @ApiPropertyOptional({
    description:
      'Points equivalent to one unit of currency for redemption. Applicable if ruleType is "Redeem".',
    type: Number,
    format: 'decimal',
  })
  pointsPerUnitCurrency?: number;

  @ApiPropertyOptional({ description: 'Description of the rule.' })
  description?: string;

  @ApiProperty({ description: 'Indicates if the rule is currently active.' })
  isActive: boolean;

  @ApiProperty({ description: 'Date and time when the rule was created.' })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the rule was last updated.' })
  updatedAt: Date;
}
