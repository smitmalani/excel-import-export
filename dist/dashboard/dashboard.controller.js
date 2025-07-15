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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
const super_admin_dashboard_data_dto_1 = require("./dto/super-admin-dashboard-data.dto");
const business_admin_dashboard_data_dto_1 = require("./dto/business-admin-dashboard-data.dto");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getSuperAdminStats() {
        return this.dashboardService.getSuperAdminDashboardData();
    }
    async getBusinessAdminStats(req) {
        const businessId = req.user.businessId;
        return this.dashboardService.getBusinessAdminDashboardData(businessId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('super-admin-stats'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dashboard statistics for SuperAdmin',
        description: 'Provides counts of total businesses and total business admins. Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved SuperAdmin dashboard data.',
        type: super_admin_dashboard_data_dto_1.SuperAdminDashboardDataDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden resource. User is not a SuperAdmin.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSuperAdminStats", null);
__decorate([
    (0, common_1.Get)('business-admin-stats'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dashboard statistics for BusinessAdmin',
        description: "Provides counts of total patients, total employees (sub-admins), today's added points, and today's redeemed points for the admin's business. Accessible only by BusinessAdmins.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved BusinessAdmin dashboard data.',
        type: business_admin_dashboard_data_dto_1.BusinessAdminDashboardDataDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden resource. User is not a BusinessAdmin.',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getBusinessAdminStats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map