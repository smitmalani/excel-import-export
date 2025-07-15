import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdateBusinessAdminDto } from './dto/update-business-admin.dto';
import { BusinessAdminResponseDto } from './dto/business-admin-response.dto';
import { PaginatedBusinessAdminResponseDto } from './dto/paginated-business-admin-response.dto';
export declare class BusinessAdminsService {
    private prisma;
    private usersService;
    private mailService;
    constructor(prisma: PrismaService, usersService: UsersService, mailService: MailService);
    private mapToResponseDto;
    create(createBusinessAdminDto: CreateBusinessAdminDto): Promise<BusinessAdminResponseDto>;
    findAll(businessId?: number, page?: number, limit?: number): Promise<PaginatedBusinessAdminResponseDto>;
    findOne(userId: number): Promise<BusinessAdminResponseDto>;
    update(userId: number, updateDto: UpdateBusinessAdminDto): Promise<BusinessAdminResponseDto>;
    remove(userId: number): Promise<BusinessAdminResponseDto>;
}
