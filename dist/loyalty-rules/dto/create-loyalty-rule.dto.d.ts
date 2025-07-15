import { LoyaltyRuleType } from '../enums/loyalty-rule-type.enum';
export declare class CreateLoyaltyRuleDto {
    serviceOfferingId: number;
    ruleType: LoyaltyRuleType;
    earnPointPercentage?: number;
    pointsPerUnitCurrency?: number;
    description?: string;
}
