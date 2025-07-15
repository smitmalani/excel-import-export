import { LoyaltyRulesService } from './loyalty-rules.service';
import { CreateLoyaltyRuleDto } from './dto/create-loyalty-rule.dto';
import { UpdateLoyaltyRuleDto } from './dto/update-loyalty-rule.dto';
import { LoyaltyRuleResponseDto } from './dto/loyalty-rule-response.dto';
import { LoyaltyRulesQueryDto } from './dto/loyalty-rules-query.dto';
import { PaginatedLoyaltyRuleResponseDto } from './dto/paginated-loyalty-rule-response.dto';
import { Role } from '../auth/enums/role.enum';
import { Request } from 'express';
interface CurrentUserType {
    UserID: number;
    Role: Role;
    BusinessID?: number;
    Username: string;
    Email: string;
}
interface AuthenticatedRequest extends Request {
    user: CurrentUserType;
}
export declare class LoyaltyRulesController {
    private readonly loyaltyRulesService;
    constructor(loyaltyRulesService: LoyaltyRulesService);
    create(createLoyaltyRuleDto: CreateLoyaltyRuleDto, req: AuthenticatedRequest): Promise<LoyaltyRuleResponseDto>;
    findAll(queryDto: LoyaltyRulesQueryDto, req: AuthenticatedRequest): Promise<PaginatedLoyaltyRuleResponseDto>;
    findOne(id: number, req: AuthenticatedRequest): Promise<LoyaltyRuleResponseDto>;
    update(id: number, updateLoyaltyRuleDto: UpdateLoyaltyRuleDto, req: AuthenticatedRequest): Promise<LoyaltyRuleResponseDto>;
    remove(id: number, req: AuthenticatedRequest): Promise<LoyaltyRuleResponseDto>;
}
export {};
