import { ServiceOfferingsService } from './service-offerings.service';
import { CreateServiceOfferingDto } from './dto/create-service-offering.dto';
import { UpdateServiceOfferingDto } from './dto/update-service-offering.dto';
import { ServiceOfferingsQueryDto } from './dto/service-offerings-query.dto';
import { ServiceOfferingResponseDto } from './dto/service-offering-response.dto';
import { Role } from '../auth/enums/role.enum';
interface AuthenticatedRequest extends Request {
    user: {
        UserID: number;
        Role: Role;
        BusinessID?: number;
        Username: string;
        Email: string;
    };
}
export declare class ServiceOfferingsController {
    private readonly serviceOfferingsService;
    constructor(serviceOfferingsService: ServiceOfferingsService);
    create(createServiceOfferingDto: CreateServiceOfferingDto, req: AuthenticatedRequest): Promise<ServiceOfferingResponseDto>;
    findAll(queryDto: ServiceOfferingsQueryDto, req: AuthenticatedRequest): Promise<{
        data: ServiceOfferingResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number, req: AuthenticatedRequest): Promise<ServiceOfferingResponseDto>;
    update(id: number, updateServiceOfferingDto: UpdateServiceOfferingDto, req: AuthenticatedRequest): Promise<ServiceOfferingResponseDto>;
    remove(id: number, req: AuthenticatedRequest): Promise<ServiceOfferingResponseDto>;
}
export {};
