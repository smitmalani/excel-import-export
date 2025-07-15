import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { CreateBusinessSubAdminDto } from './dto/create-business-sub-admin.dto';
import { UpdateBusinessSubAdminDto } from './dto/update-business-sub-admin.dto';
import { BusinessSubAdminsQueryDto } from './dto/business-sub-admins-query.dto';
import { BusinessSubAdminResponseDto } from './dto/business-sub-admin-response.dto';
import { PaginatedBusinessSubAdminResponseDto } from './dto/paginated-business-sub-admin-response.dto';
import { Role } from '../auth/enums/role.enum';
type CurrentUserType = {
    UserID: number;
    Role: Role;
    BusinessID?: number;
};
export declare class BusinessSubAdminsService {
    private prisma;
    private usersService;
    private mailService;
    constructor(prisma: PrismaService, usersService: UsersService, mailService: MailService);
    private mapToResponseDto;
    create(createDto: CreateBusinessSubAdminDto, currentUser: CurrentUserType): Promise<BusinessSubAdminResponseDto>;
    findAll(queryDto: BusinessSubAdminsQueryDto, currentUser: CurrentUserType): Promise<PaginatedBusinessSubAdminResponseDto>;
    findOne(id: number, currentUser: CurrentUserType): Promise<BusinessSubAdminResponseDto>;
    update(id: number, updateDto: UpdateBusinessSubAdminDto, currentUser: CurrentUserType): Promise<BusinessSubAdminResponseDto>;
    remove(id: number, currentUser: CurrentUserType): Promise<BusinessSubAdminResponseDto>;
}
export {};
