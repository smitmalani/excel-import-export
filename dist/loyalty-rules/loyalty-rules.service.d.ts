import { PrismaService } from '../prisma/prisma.service';
import { CreateLoyaltyRuleDto } from './dto/create-loyalty-rule.dto';
import { UpdateLoyaltyRuleDto } from './dto/update-loyalty-rule.dto';
import { LoyaltyRuleResponseDto } from './dto/loyalty-rule-response.dto';
import { LoyaltyRulesQueryDto } from './dto/loyalty-rules-query.dto';
import { PaginatedLoyaltyRuleResponseDto } from './dto/paginated-loyalty-rule-response.dto';
import { Role } from '../auth/enums/role.enum';
interface CurrentUserType {
    UserID: number;
    Role: Role;
    BusinessID?: number;
    Username: string;
    Email: string;
}
export declare class LoyaltyRulesService {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToResponseDto;
    create(createDto: CreateLoyaltyRuleDto, currentUser: CurrentUserType): Promise<LoyaltyRuleResponseDto>;
    findAll(queryDto: LoyaltyRulesQueryDto, currentUser: CurrentUserType): Promise<PaginatedLoyaltyRuleResponseDto>;
    findOne(ruleId: number, currentUser: CurrentUserType): Promise<LoyaltyRuleResponseDto>;
    update(ruleId: number, updateDto: UpdateLoyaltyRuleDto, currentUser: CurrentUserType): Promise<LoyaltyRuleResponseDto>;
    remove(ruleId: number, currentUser: CurrentUserType): Promise<LoyaltyRuleResponseDto>;
}
export {};
