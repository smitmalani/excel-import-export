import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceOfferingDto } from './dto/create-service-offering.dto';
import { UpdateServiceOfferingDto } from './dto/update-service-offering.dto';
import { ServiceOfferingResponseDto } from './dto/service-offering-response.dto';
import { ServiceOfferingsQueryDto } from './dto/service-offerings-query.dto';
import { Role } from '../auth/enums/role.enum';
interface CurrentUserType {
    UserID: number;
    Role: Role;
    BusinessID?: number;
    Username: string;
    Email: string;
}
export declare class ServiceOfferingsService {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToResponseDto;
    create(createDto: CreateServiceOfferingDto, currentUser: CurrentUserType): Promise<ServiceOfferingResponseDto>;
    findAll(queryDto: ServiceOfferingsQueryDto, currentUser: CurrentUserType): Promise<{
        data: ServiceOfferingResponseDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number, currentUser: CurrentUserType): Promise<ServiceOfferingResponseDto>;
    update(id: number, updateDto: UpdateServiceOfferingDto, currentUser: CurrentUserType): Promise<ServiceOfferingResponseDto>;
    remove(id: number, currentUser: CurrentUserType): Promise<ServiceOfferingResponseDto>;
}
export {};
