import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SuperAdminDashboardDataDto } from './dto/super-admin-dashboard-data.dto';
import { BusinessAdminDashboardDataDto } from './dto/business-admin-dashboard-data.dto';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('super-admin-stats')
  @Roles(Role.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get dashboard statistics for SuperAdmin',
    description:
      'Provides counts of total businesses and total business admins. Accessible only by SuperAdmins.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved SuperAdmin dashboard data.',
    type: SuperAdminDashboardDataDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. User is not a SuperAdmin.',
  })
  async getSuperAdminStats(): Promise<SuperAdminDashboardDataDto> {
    return this.dashboardService.getSuperAdminDashboardData();
  }

  @Get('business-admin-stats')
  @Roles(Role.BusinessAdmin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get dashboard statistics for BusinessAdmin',
    description:
      "Provides counts of total patients, total employees (sub-admins), today's added points, and today's redeemed points for the admin's business. Accessible only by BusinessAdmins.",
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved BusinessAdmin dashboard data.',
    type: BusinessAdminDashboardDataDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. User is not a BusinessAdmin.',
  })
  async getBusinessAdminStats(
    @Req() req,
  ): Promise<BusinessAdminDashboardDataDto> {
    const businessId = req.user.businessId;
    return this.dashboardService.getBusinessAdminDashboardData(businessId);
  }
}
