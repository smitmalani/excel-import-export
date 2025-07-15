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
exports.BusinessAdminDashboardDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class BusinessAdminDashboardDataDto {
    totalPatients;
    totalEmployees;
    todaysAddPoint;
    todaysRedeemPoint;
}
exports.BusinessAdminDashboardDataDto = BusinessAdminDashboardDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Total number of active patients' }),
    __metadata("design:type", Number)
], BusinessAdminDashboardDataDto.prototype, "totalPatients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Total number of active employees (sub-admins)',
    }),
    __metadata("design:type", Number)
], BusinessAdminDashboardDataDto.prototype, "totalEmployees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.5, description: 'Total points added today' }),
    __metadata("design:type", Number)
], BusinessAdminDashboardDataDto.prototype, "todaysAddPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.0, description: 'Total points redeemed today' }),
    __metadata("design:type", Number)
], BusinessAdminDashboardDataDto.prototype, "todaysRedeemPoint", void 0);
//# sourceMappingURL=business-admin-dashboard-data.dto.js.map