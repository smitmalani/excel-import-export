import { BusinessAdminsService } from './business-admins.service';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdateBusinessAdminDto } from './dto/update-business-admin.dto';
import { BusinessAdminResponseDto } from './dto/business-admin-response.dto';
import { PaginatedBusinessAdminResponseDto } from './dto/paginated-business-admin-response.dto';
export declare class BusinessAdminsController {
    private readonly businessAdminsService;
    constructor(businessAdminsService: BusinessAdminsService);
    create(createBusinessAdminDto: CreateBusinessAdminDto): Promise<BusinessAdminResponseDto>;
    findAll(page: number, limit: number, businessId?: number): Promise<PaginatedBusinessAdminResponseDto>;
    findOne(id: number): Promise<BusinessAdminResponseDto>;
    update(id: number, updateBusinessAdminDto: UpdateBusinessAdminDto): Promise<BusinessAdminResponseDto>;
    remove(id: number): Promise<BusinessAdminResponseDto>;
}
