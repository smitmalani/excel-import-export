import { Role } from '../auth/enums/role.enum';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersQueryDto } from './dto/members-query.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { PaginatedMembersResponseDto } from './dto/paginated-members-response.dto';
interface AuthenticatedRequest extends Request {
    user: {
        UserID: number;
        Role: Role;
        BusinessID?: number;
        Username: string;
        Email: string;
    };
}
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: CreateMemberDto, req: AuthenticatedRequest, profileImage?: Express.Multer.File): Promise<MemberResponseDto>;
    findAll(queryDto: MembersQueryDto, req: AuthenticatedRequest): Promise<PaginatedMembersResponseDto>;
    findOne(id: number, req: AuthenticatedRequest): Promise<MemberResponseDto>;
    findOneBySmartCardNumber(smartCardNumber: string, req: AuthenticatedRequest): Promise<MemberResponseDto>;
    update(id: number, updateMemberDto: UpdateMemberDto, req: AuthenticatedRequest, profileImage?: Express.Multer.File): Promise<MemberResponseDto>;
    remove(id: number, req: AuthenticatedRequest): Promise<MemberResponseDto>;
}
export {};
