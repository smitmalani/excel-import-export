import { PrismaService } from '../prisma/prisma.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { FindAllCardTypesQueryDto } from './dto/find-all-card-types-query.dto';
import { CardTypeResponseDto } from './dto/card-type-response.dto';
import { PaginatedCardTypeResponseDto } from './dto/paginated-card-type-response.dto';
import { Role } from '../auth/enums/role.enum';
interface AuthenticatedUser {
    UserID: number;
    Role: Role;
    BusinessID?: number | null;
    Username: string;
    Email: string;
}
export declare class CardTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToResponseDto;
    create(createDto: CreateCardTypeDto, currentUser: AuthenticatedUser): Promise<CardTypeResponseDto>;
    findAll(queryDto: FindAllCardTypesQueryDto, currentUser: AuthenticatedUser): Promise<PaginatedCardTypeResponseDto>;
    findOne(id: number, currentUser: AuthenticatedUser): Promise<CardTypeResponseDto>;
    update(id: number, updateDto: UpdateCardTypeDto, currentUser: AuthenticatedUser): Promise<CardTypeResponseDto>;
    remove(id: number, currentUser: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
export {};
