import { PrismaService } from '../prisma/prisma.service';
import { SuperAdminDashboardDataDto } from './dto/super-admin-dashboard-data.dto';
import { BusinessAdminDashboardDataDto } from './dto/business-admin-dashboard-data.dto';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSuperAdminDashboardData(): Promise<SuperAdminDashboardDataDto>;
    getBusinessAdminDashboardData(businessId: number): Promise<BusinessAdminDashboardDataDto>;
}
