import { PointTransactionType } from "@generated/prisma";
export declare class PointTransactionDto {
    memberId: number;
    transactionType: PointTransactionType;
    amount: number;
    serviceOfferingId: number;
    title?: string;
    description?: string;
    billNumber?: string;
    pointsToRedeem?: number;
}
