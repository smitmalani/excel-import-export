import { LoyaltyRuleType } from '../enums/loyalty-rule-type.enum';
export declare class LoyaltyRulesQueryDto {
    page?: number;
    limit?: number;
    serviceOfferingId?: number;
    ruleType?: LoyaltyRuleType;
}
