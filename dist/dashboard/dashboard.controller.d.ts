import { DashboardService } from './dashboard.service';
import { SuperAdminDashboardDataDto } from './dto/super-admin-dashboard-data.dto';
import { BusinessAdminDashboardDataDto } from './dto/business-admin-dashboard-data.dto';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSuperAdminStats(): Promise<SuperAdminDashboardDataDto>;
    getBusinessAdminStats(req: any): Promise<BusinessAdminDashboardDataDto>;
}
