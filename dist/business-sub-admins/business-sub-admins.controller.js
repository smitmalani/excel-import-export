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
exports.BusinessSubAdminsController = void 0;
const common_1 = require("@nestjs/common");
const business_sub_admins_service_1 = require("./business-sub-admins.service");
const create_business_sub_admin_dto_1 = require("./dto/create-business-sub-admin.dto");
const update_business_sub_admin_dto_1 = require("./dto/update-business-sub-admin.dto");
const business_sub_admins_query_dto_1 = require("./dto/business-sub-admins-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let BusinessSubAdminsController = class BusinessSubAdminsController {
    businessSubAdminsService;
    constructor(businessSubAdminsService) {
        this.businessSubAdminsService = businessSubAdminsService;
    }
    create(createBusinessSubAdminDto, req) {
        return this.businessSubAdminsService.create(createBusinessSubAdminDto, req.user);
    }
    findAll(queryDto, req) {
        return this.businessSubAdminsService.findAll(queryDto, req.user);
    }
    findOne(id, req) {
        return this.businessSubAdminsService.findOne(id, req.user);
    }
    update(id, updateBusinessSubAdminDto, req) {
        return this.businessSubAdminsService.update(id, updateBusinessSubAdminDto, req.user);
    }
    remove(id, req) {
        return this.businessSubAdminsService.remove(id, req.user);
    }
};
exports.BusinessSubAdminsController = BusinessSubAdminsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new business sub-admin' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The sub-admin has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_business_sub_admin_dto_1.CreateBusinessSubAdminDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessSubAdminsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sub-admins for the current business' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_sub_admins_query_dto_1.BusinessSubAdminsQueryDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessSubAdminsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific sub-admin by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the sub-admin to retrieve' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BusinessSubAdminsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Update a sub-admin' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The ID of the sub-admin to update' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_business_sub_admin_dto_1.UpdateBusinessSubAdminDto, Object]),
    __metadata("design:returntype", void 0)
], BusinessSubAdminsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a sub-admin' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'The ID of the sub-admin to deactivate',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BusinessSubAdminsController.prototype, "remove", null);
exports.BusinessSubAdminsController = BusinessSubAdminsController = __decorate([
    (0, swagger_1.ApiTags)('Business Sub-Admins'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('business-sub-admins'),
    __metadata("design:paramtypes", [business_sub_admins_service_1.BusinessSubAdminsService])
], BusinessSubAdminsController);
//# sourceMappingURL=business-sub-admins.controller.js.map