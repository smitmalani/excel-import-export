import { LoyaltyRuleResponseDto } from './loyalty-rule-response.dto';
export declare class PaginatedLoyaltyRuleResponseDto {
    data: LoyaltyRuleResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
