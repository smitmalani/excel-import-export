import { LoyaltyRuleType } from '../enums/loyalty-rule-type.enum';
export declare class LoyaltyRuleResponseDto {
    ruleId: number;
    serviceOfferingId: number;
    serviceOfferingName: string;
    cardTypeName: string;
    ruleType: LoyaltyRuleType;
    earnPointPercentage?: number;
    pointsPerUnitCurrency?: number;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
