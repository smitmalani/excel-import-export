import { CardTypeResponseDto } from './card-type-response.dto';
export declare class PaginatedCardTypeResponseDto {
    data: CardTypeResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
