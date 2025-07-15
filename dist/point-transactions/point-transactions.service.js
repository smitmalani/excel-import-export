"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointTransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_1 = require("../../generated/prisma/index.js");
const library_1 = require("@prisma/client/runtime/library");
let PointTransactionsService = class PointTransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPointTransaction(dto, currentUser) {
        const businessId = currentUser.BusinessID;
        if (!businessId) {
            throw new common_1.ForbiddenException('User is not associated with a business.');
        }
        return this.prisma.$transaction(async (tx) => {
            const member = await tx.member.findFirst({
                where: {
                    MemberID: dto.memberId,
                    BusinessID: businessId,
                },
            });
            if (!member) {
                throw new common_1.NotFoundException(`Member with ID ${dto.memberId} not found in this business.`);
            }
            if (!member.IsActive) {
                throw new common_1.BadRequestException('Member account is not active.');
            }
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
                throw new common_1.NotFoundException(`Service Offering with ID ${dto.serviceOfferingId} not found.`);
            }
            let pointsToApply = new library_1.Decimal(0);
            let redeemedValue = new library_1.Decimal(0);
            let loyaltyRuleId = undefined;
            if (dto.transactionType === prisma_1.PointTransactionType.Earn) {
                const earnRule = serviceOffering.LoyaltyRules.find((r) => r.RuleType === 'Earn' && r.IsActive);
                if (!earnRule || !earnRule.EarnPointPercentage) {
                    throw new common_1.BadRequestException('No active earn rule found for this service.');
                }
                loyaltyRuleId = earnRule.RuleID;
                pointsToApply = new library_1.Decimal(dto.amount).mul(earnRule.EarnPointPercentage.div(100));
            }
            else if (dto.transactionType === prisma_1.PointTransactionType.Redeem) {
                const redeemRule = serviceOffering.LoyaltyRules.find((r) => r.RuleType === 'Redeem' && r.IsActive);
                if (!redeemRule || !redeemRule.PointsPerUnitCurrency) {
                    throw new common_1.BadRequestException('No active redeem rule found for this service.');
                }
                loyaltyRuleId = redeemRule.RuleID;
                const pointsToRedeem = new library_1.Decimal(dto.pointsToRedeem ?? 0);
                if (pointsToRedeem.isZero() || pointsToRedeem.isNegative()) {
                    throw new common_1.BadRequestException('Points to redeem must be a positive number.');
                }
                if (member.CurrentLoyaltyPoints.lessThan(pointsToRedeem)) {
                    throw new common_1.BadRequestException('Insufficient loyalty points.');
                }
                redeemedValue = pointsToRedeem.div(redeemRule.PointsPerUnitCurrency);
                if (redeemedValue.greaterThan(dto.amount)) {
                    throw new common_1.BadRequestException('Redeemed value cannot exceed transaction amount.');
                }
                pointsToApply = pointsToRedeem.negated();
            }
            const updatedMember = await tx.member.update({
                where: { MemberID: member.MemberID },
                data: {
                    CurrentLoyaltyPoints: {
                        increment: pointsToApply,
                    },
                },
            });
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
    async findAll(query, currentUser) {
        const { page = 1, limit = 10, userId, memberId, fromDate, toDate, transactionType, cardTypeId, serviceOfferingId, search, } = query;
        const businessId = currentUser.BusinessID;
        if (!businessId) {
            throw new common_1.ForbiddenException('User is not associated with a business.');
        }
        const where = {
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
                where.TransactionDate.lte = new Date(new Date(toDate).setHours(23, 59, 59, 999));
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
        const formattedData = transactions.map((t) => ({
            SrNo: t.TransactionID,
            Name: `${t.Member.FirstName} ${t.Member.LastName || ''}`.trim(),
            Mobile: t.Member.MobileNumber,
            CardNumber: t.Member.SmartCardNumber || 'N/A',
            Amount: t.TransactionAmount,
            Point: t.Points,
            PayableAmount: t.TransactionAmount && t.RedeemedValue
                ? new library_1.Decimal(t.TransactionAmount).sub(t.RedeemedValue).toNumber()
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
};
exports.PointTransactionsService = PointTransactionsService;
exports.PointTransactionsService = PointTransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PointTransactionsService);
//# sourceMappingURL=point-transactions.service.js.map