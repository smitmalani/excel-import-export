import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PointTransactionDto } from './dto/point-transaction.dto';
import { QueryPointTransactionDto } from './dto/query-point-transaction.dto';
import { Role } from '@/auth/enums/role.enum';
import { Prisma, PointTransactionType } from '@generated/prisma';
import { Decimal } from '@prisma/client/runtime/library';

// Define a type for the authenticated user payload
interface AuthenticatedUser {
  UserID: number;
  Role: Role;
  BusinessID?: number;
}

@Injectable()
export class PointTransactionsService {
  constructor(private prisma: PrismaService) {}

  async createPointTransaction(
    dto: PointTransactionDto,
    currentUser: AuthenticatedUser,
  ) {
    const businessId = currentUser.BusinessID;
    if (!businessId) {
      throw new ForbiddenException('User is not associated with a business.');
    }

    // All operations are wrapped in a transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch the member and lock the row for update
      const member = await tx.member.findFirst({
        where: {
          MemberID: dto.memberId,
          BusinessID: businessId,
        },
      });

      if (!member) {
        throw new NotFoundException(
          `Member with ID ${dto.memberId} not found in this business.`,
        );
      }
      if (!member.IsActive) {
        throw new BadRequestException('Member account is not active.');
      }

      // 2. Fetch the service offering and its loyalty rules
      const serviceOffering = await tx.serviceOffering.findUnique({
        where: {
          ServiceOfferingID: dto.serviceOfferingId,
          BusinessID: businessId,
        },
        include: {
          LoyaltyRules: true,
        },
      });

      if (!serviceOffering) {
        throw new NotFoundException(
          `Service Offering with ID ${dto.serviceOfferingId} not found.`,
        );
      }

      let pointsToApply = new Decimal(0);
      let redeemedValue = new Decimal(0);
      let loyaltyRuleId: number | undefined = undefined;

      // 3. Handle transaction logic based on type
      if (dto.transactionType === PointTransactionType.Earn) {
        const earnRule = serviceOffering.LoyaltyRules.find(
          (r) => r.RuleType === 'Earn' && r.IsActive,
        );
        if (!earnRule || !earnRule.EarnPointPercentage) {
          throw new BadRequestException(
            'No active earn rule found for this service.',
          );
        }
        loyaltyRuleId = earnRule.RuleID;
        // Calculate points earned: amount * (percentage / 100)
        pointsToApply = new Decimal(dto.amount).mul(
          earnRule.EarnPointPercentage.div(100),
        );
      } else if (dto.transactionType === PointTransactionType.Redeem) {
        const redeemRule = serviceOffering.LoyaltyRules.find(
          (r) => r.RuleType === 'Redeem' && r.IsActive,
        );
        if (!redeemRule || !redeemRule.PointsPerUnitCurrency) {
          throw new BadRequestException(
            'No active redeem rule found for this service.',
          );
        }
        loyaltyRuleId = redeemRule.RuleID;
        const pointsToRedeem = new Decimal(dto.pointsToRedeem ?? 0);
        if (pointsToRedeem.isZero() || pointsToRedeem.isNegative()) {
          throw new BadRequestException(
            'Points to redeem must be a positive number.',
          );
        }
        if (member.CurrentLoyaltyPoints.lessThan(pointsToRedeem)) {
          throw new BadRequestException('Insufficient loyalty points.');
        }

        // Calculate the value redeemed: points / points_per_unit
        redeemedValue = pointsToRedeem.div(redeemRule.PointsPerUnitCurrency);
        if (redeemedValue.greaterThan(dto.amount)) {
          throw new BadRequestException(
            'Redeemed value cannot exceed transaction amount.',
          );
        }
        pointsToApply = pointsToRedeem.negated(); // Points are negative for redemption
      }

      // 4. Update member's loyalty points
      const updatedMember = await tx.member.update({
        where: { MemberID: member.MemberID },
        data: {
          CurrentLoyaltyPoints: {
            increment: pointsToApply,
          },
        },
      });

      // 5. Create the point transaction record
      const transaction = await tx.pointTransaction.create({
        data: {
          BusinessID: businessId,
          MemberID: dto.memberId,
          TransactionType: dto.transactionType,
          Points: pointsToApply,
          TransactionAmount: dto.amount,
          RedeemedValue: redeemedValue,
          ServiceOfferingID: dto.serviceOfferingId,
          RuleID: loyaltyRuleId,
          BillNumber: dto.billNumber,
          Title: dto.title,
          Description: dto.description,
          ProcessedByUserID: currentUser.UserID,
        },
      });

      return { transaction, member: updatedMember };
    });
  }

  async findAll(
    query: QueryPointTransactionDto,
    currentUser: AuthenticatedUser,
  ) {
    const {
      page = 1,
      limit = 10,
      userId,
      memberId,
      fromDate,
      toDate,
      transactionType,
      cardTypeId,
      serviceOfferingId,
      search,
    } = query;

    const businessId = currentUser.BusinessID;
    if (!businessId) {
      throw new ForbiddenException('User is not associated with a business.');
    }

    const where: Prisma.PointTransactionWhereInput = {
      BusinessID: businessId,
    };

    if (userId) {
      where.ProcessedByUserID = userId;
    }
    if (memberId) {
      where.MemberID = memberId;
    }
    if (fromDate || toDate) {
      where.TransactionDate = {};
      if (fromDate) {
        where.TransactionDate.gte = new Date(fromDate);
      }
      if (toDate) {
        where.TransactionDate.lte = new Date(
          new Date(toDate).setHours(23, 59, 59, 999),
        );
      }
    }
    if (transactionType) {
      where.TransactionType = transactionType;
    }
    if (serviceOfferingId) {
      where.ServiceOfferingID = serviceOfferingId;
    }
    if (cardTypeId) {
      where.ServiceOffering = {
        CardTypeID: cardTypeId,
      };
    }

    if (search) {
      where.OR = [
        { Member: { FirstName: { contains: search } } },
        { Member: { LastName: { contains: search } } },
        { Member: { MobileNumber: { contains: search } } },
        { Member: { SmartCardNumber: { contains: search } } },
        { BillNumber: { contains: search } },
      ];
    }

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.pointTransaction.findMany({
        where,
        include: {
          Member: {
            select: {
              FirstName: true,
              LastName: true,
              MobileNumber: true,
              SmartCardNumber: true,
            },
          },
          ServiceOffering: {
            select: {
              ServiceName: true,
            },
          },
          ProcessedByUser: {
            select: {
              FullName: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          TransactionDate: 'desc',
        },
      }),
      this.prisma.pointTransaction.count({ where }),
    ]);

    // Format the response to match the UI
    const formattedData = transactions.map((t) => ({
      SrNo: t.TransactionID,
      Name: `${t.Member.FirstName} ${t.Member.LastName || ''}`.trim(),
      Mobile: t.Member.MobileNumber,
      CardNumber: t.Member.SmartCardNumber || 'N/A',
      Amount: t.TransactionAmount,
      Point: t.Points,
      PayableAmount:
        t.TransactionAmount && t.RedeemedValue
          ? new Decimal(t.TransactionAmount).sub(t.RedeemedValue).toNumber()
          : t.TransactionAmount,
      AddRedeem: t.TransactionType,
      Title: t.Title,
      Service: t.ServiceOffering?.ServiceName || 'N/A',
      BillNo: t.BillNumber,
      CreateDate: t.TransactionDate,
      ProcessedBy: t.ProcessedByUser?.FullName || 'N/A',
    }));

    return {
      data: formattedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
