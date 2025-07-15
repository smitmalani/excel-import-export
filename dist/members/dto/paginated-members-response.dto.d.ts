import { MemberResponseDto } from './member-response.dto';
export declare class PaginatedMembersResponseDto {
    data: MemberResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
