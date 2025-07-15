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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../auth/enums/role.enum");
const prisma_1 = require("../../generated/prisma/index.js");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSuperAdminDashboardData() {
        const totalBusinesses = await this.prisma.business.count();
        const totalBusinessAdmins = await this.prisma.user.count({
            where: {
                Role: role_enum_1.Role.BusinessAdmin,
            },
        });
        return {
            totalBusinesses,
            totalBusinessAdmins,
        };
    }
    async getBusinessAdminDashboardData(businessId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const totalPatients = await this.prisma.member.count({
            where: {
                BusinessID: businessId,
                IsActive: true,
            },
        });
        const totalEmployees = await this.prisma.user.count({
            where: {
                BusinessID: businessId,
                Role: role_enum_1.Role.BusinessSubAdmin,
                IsActive: true,
            },
        });
        const todaysAddPointTransactions = await this.prisma.pointTransaction.aggregate({
            _sum: {
                Points: true,
            },
            where: {
                BusinessID: businessId,
                TransactionType: prisma_1.PointTransactionType.Earn,
                TransactionDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        const todaysRedeemPointTransactions = await this.prisma.pointTransaction.aggregate({
            _sum: {
                Points: true,
            },
            where: {
                BusinessID: businessId,
                TransactionType: prisma_1.PointTransactionType.Redeem,
                TransactionDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        return {
            totalPatients,
            totalEmployees,
            todaysAddPoint: todaysAddPointTransactions._sum.Points?.toNumber() || 0,
            todaysRedeemPoint: Math.abs(todaysRedeemPointTransactions._sum.Points?.toNumber() || 0),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map