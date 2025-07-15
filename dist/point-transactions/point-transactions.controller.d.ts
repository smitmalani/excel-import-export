import { PointTransactionsService } from "./point-transactions.service";
import { PointTransactionDto } from "./dto/point-transaction.dto";
import { QueryPointTransactionDto } from "./dto/query-point-transaction.dto";
import { Role } from "@/auth/enums/role.enum";
interface AuthenticatedRequest extends Request {
    user: {
        UserID: number;
        Role: Role;
        BusinessID?: number;
    };
}
export declare class PointTransactionsController {
    private readonly pointTransactionsService;
    constructor(pointTransactionsService: PointTransactionsService);
    create(pointTransactionDto: PointTransactionDto, req: AuthenticatedRequest): Promise<{
        transaction: {
            BusinessID: number;
            MemberID: number;
            Points: import("generated/prisma/runtime/library").Decimal;
            TransactionType: import("@generated/prisma").$Enums.PointTransactionType;
            TransactionID: number;
            TransactionAmount: import("generated/prisma/runtime/library").Decimal | null;
            RedeemedValue: import("generated/prisma/runtime/library").Decimal | null;
            ServiceOfferingID: number | null;
            RuleID: number | null;
            ProcessedByUserID: number | null;
            Description: string | null;
            BillNumber: string | null;
            Title: string | null;
            TransactionDate: Date;
        };
        member: {
            BusinessID: number;
            Email: string | null;
            IsActive: boolean;
            CreatedAt: Date;
            UpdatedAt: Date;
            MemberID: number;
            MemberType: import("@generated/prisma").$Enums.MemberSystemType;
            FirstName: string;
            LastName: string | null;
            MobileNumber: string;
            Gender: import("@generated/prisma").$Enums.Gender | null;
            Address: string | null;
            Age: number | null;
            ProfileImageURL: string | null;
            SmartCardNumber: string | null;
            CardTypeID: number | null;
            CurrentLoyaltyPoints: import("generated/prisma/runtime/library").Decimal;
            LoyaltyCardURL: string | null;
            RegisteredByUserID: number | null;
        };
    }>;
    findAll(query: QueryPointTransactionDto, req: AuthenticatedRequest): Promise<{
        data: {
            SrNo: number;
            Name: string;
            Mobile: string;
            CardNumber: string;
            Amount: import("generated/prisma/runtime/library").Decimal | null;
            Point: import("generated/prisma/runtime/library").Decimal;
            PayableAmount: number | import("generated/prisma/runtime/library").Decimal | null;
            AddRedeem: import("@generated/prisma").$Enums.PointTransactionType;
            Title: string | null;
            Service: string;
            BillNo: string | null;
            CreateDate: Date;
            ProcessedBy: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
export {};
