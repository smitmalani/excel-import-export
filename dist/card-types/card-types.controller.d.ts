import { CardTypesService } from './card-types.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { FindAllCardTypesQueryDto } from './dto/find-all-card-types-query.dto';
import { CardTypeResponseDto } from './dto/card-type-response.dto';
import { PaginatedCardTypeResponseDto } from './dto/paginated-card-type-response.dto';
import { Role } from '../auth/enums/role.enum';
interface AuthenticatedRequest extends Request {
    user: {
        UserID: number;
        Role: Role;
        BusinessID?: number | null;
        Username: string;
        Email: string;
    };
}
export declare class CardTypesController {
    private readonly cardTypesService;
    constructor(cardTypesService: CardTypesService);
    create(createCardTypeDto: CreateCardTypeDto, req: AuthenticatedRequest): Promise<CardTypeResponseDto>;
    findAll(queryDto: FindAllCardTypesQueryDto, req: AuthenticatedRequest): Promise<PaginatedCardTypeResponseDto>;
    findOne(id: number, req: AuthenticatedRequest): Promise<CardTypeResponseDto>;
    update(id: number, updateCardTypeDto: UpdateCardTypeDto, req: AuthenticatedRequest): Promise<CardTypeResponseDto>;
    remove(id: number, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
export {};
