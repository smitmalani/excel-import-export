import { PointTransactionType } from "@generated/prisma";
export declare class QueryPointTransactionDto {
    page?: number;
    limit?: number;
    userId?: number;
    memberId?: number;
    fromDate?: string;
    toDate?: string;
    transactionType?: PointTransactionType;
    cardTypeId?: number;
    serviceOfferingId?: number;
    search?: string;
}
