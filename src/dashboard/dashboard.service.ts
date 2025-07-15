import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../auth/enums/role.enum';
import { SuperAdminDashboardDataDto } from './dto/super-admin-dashboard-data.dto';
import { BusinessAdminDashboardDataDto } from './dto/business-admin-dashboard-data.dto';
import { PointTransactionType } from '@generated/prisma';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSuperAdminDashboardData(): Promise<SuperAdminDashboardDataDto> {
    const totalBusinesses = await this.prisma.business.count();
    const totalBusinessAdmins = await this.prisma.user.count({
      where: {
        Role: Role.BusinessAdmin,
      },
    });

    return {
      totalBusinesses,
      totalBusinessAdmins,
    };
  }

  async getBusinessAdminDashboardData(
    businessId: number,
  ): Promise<BusinessAdminDashboardDataDto> {
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
        Role: Role.BusinessSubAdmin,
        IsActive: true,
      },
    });

    const todaysAddPointTransactions =
      await this.prisma.pointTransaction.aggregate({
        _sum: {
          Points: true,
        },
        where: {
          BusinessID: businessId,
          TransactionType: PointTransactionType.Earn,
          TransactionDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

    const todaysRedeemPointTransactions =
      await this.prisma.pointTransaction.aggregate({
        _sum: {
          Points: true,
        },
        where: {
          BusinessID: businessId,
          TransactionType: PointTransactionType.Redeem,
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
      todaysRedeemPoint: Math.abs(
        todaysRedeemPointTransactions._sum.Points?.toNumber() || 0,
      ),
    };
  }
}
