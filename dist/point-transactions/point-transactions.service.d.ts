import { PrismaService } from '@/prisma/prisma.service';
import { PointTransactionDto } from './dto/point-transaction.dto';
import { QueryPointTransactionDto } from './dto/query-point-transaction.dto';
import { Role } from '@/auth/enums/role.enum';
import { Prisma } from '@generated/prisma';
interface AuthenticatedUser {
    UserID: number;
    Role: Role;
    BusinessID?: number;
}
export declare class PointTransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPointTransaction(dto: PointTransactionDto, currentUser: AuthenticatedUser): Promise<{
        transaction: {
            BusinessID: number;
            MemberID: number;
            Points: Prisma.Decimal;
            TransactionType: import("@generated/prisma").$Enums.PointTransactionType;
            TransactionID: number;
            TransactionAmount: Prisma.Decimal | null;
            RedeemedValue: Prisma.Decimal | null;
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
            CurrentLoyaltyPoints: Prisma.Decimal;
            LoyaltyCardURL: string | null;
            RegisteredByUserID: number | null;
        };
    }>;
    findAll(query: QueryPointTransactionDto, currentUser: AuthenticatedUser): Promise<{
        data: {
            SrNo: number;
            Name: string;
            Mobile: string;
            CardNumber: string;
            Amount: Prisma.Decimal | null;
            Point: Prisma.Decimal;
            PayableAmount: number | Prisma.Decimal | null;
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
