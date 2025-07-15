import { MemberSystemType } from '../enums/member-system-type.enum';
export declare class MembersQueryDto {
    page?: number;
    limit?: number;
    businessId?: number;
    search?: string;
    isActive?: boolean;
    cardTypeId?: number;
    memberType?: MemberSystemType;
}
