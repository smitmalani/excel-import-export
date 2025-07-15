import { BusinessSubAdminResponseDto } from './business-sub-admin-response.dto';
export declare class PaginatedBusinessSubAdminResponseDto {
    data: BusinessSubAdminResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
