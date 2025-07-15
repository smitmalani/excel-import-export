import { BusinessAdminResponseDto } from './business-admin-response.dto';
export declare class PaginatedBusinessAdminResponseDto {
    data: BusinessAdminResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
