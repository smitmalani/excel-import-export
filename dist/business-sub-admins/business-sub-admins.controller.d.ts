import { BusinessSubAdminsService } from './business-sub-admins.service';
import { CreateBusinessSubAdminDto } from './dto/create-business-sub-admin.dto';
import { UpdateBusinessSubAdminDto } from './dto/update-business-sub-admin.dto';
import { BusinessSubAdminsQueryDto } from './dto/business-sub-admins-query.dto';
import { Role } from '../auth/enums/role.enum';
interface AuthenticatedRequest extends Request {
    user: {
        UserID: number;
        Role: Role;
        BusinessID?: number;
    };
}
export declare class BusinessSubAdminsController {
    private readonly businessSubAdminsService;
    constructor(businessSubAdminsService: BusinessSubAdminsService);
    create(createBusinessSubAdminDto: CreateBusinessSubAdminDto, req: AuthenticatedRequest): Promise<import("./dto/business-sub-admin-response.dto").BusinessSubAdminResponseDto>;
    findAll(queryDto: BusinessSubAdminsQueryDto, req: AuthenticatedRequest): Promise<import("./dto/paginated-business-sub-admin-response.dto").PaginatedBusinessSubAdminResponseDto>;
    findOne(id: number, req: AuthenticatedRequest): Promise<import("./dto/business-sub-admin-response.dto").BusinessSubAdminResponseDto>;
    update(id: number, updateBusinessSubAdminDto: UpdateBusinessSubAdminDto, req: AuthenticatedRequest): Promise<import("./dto/business-sub-admin-response.dto").BusinessSubAdminResponseDto>;
    remove(id: number, req: AuthenticatedRequest): Promise<import("./dto/business-sub-admin-response.dto").BusinessSubAdminResponseDto>;
}
export {};
