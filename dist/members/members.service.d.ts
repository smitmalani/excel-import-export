import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersQueryDto } from './dto/members-query.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { PaginatedMembersResponseDto } from './dto/paginated-members-response.dto';
import { Role } from '../auth/enums/role.enum';
import { MailService } from '../mail/mail.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';
type CurrentUserType = {
    UserID: number;
    Role: Role;
    BusinessID?: number;
};
export declare class MembersService {
    private prisma;
    private readonly mailService;
    private readonly whatsappService;
    private readonly configService;
    constructor(prisma: PrismaService, mailService: MailService, whatsappService: WhatsappService, configService: ConfigService);
    private mapToResponseDto;
    create(createMemberDto: CreateMemberDto, currentUser: CurrentUserType, appUrl: string, profileImagePath?: string): Promise<MemberResponseDto>;
    findAll(queryDto: MembersQueryDto, currentUser: CurrentUserType): Promise<PaginatedMembersResponseDto>;
    findOne(id: number, currentUser: CurrentUserType): Promise<MemberResponseDto>;
    findOneBySmartCardNumber(smartCardNumber: string, currentUser: CurrentUserType): Promise<MemberResponseDto>;
    update(id: number, updateMemberDto: UpdateMemberDto, currentUser: CurrentUserType, profileImagePath?: string): Promise<MemberResponseDto>;
    remove(id: number, currentUser: CurrentUserType): Promise<MemberResponseDto>;
}
export {};
