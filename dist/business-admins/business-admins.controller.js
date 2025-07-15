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
exports.BusinessAdminsController = void 0;
const common_1 = require("@nestjs/common");
const business_admins_service_1 = require("./business-admins.service");
const create_business_admin_dto_1 = require("./dto/create-business-admin.dto");
const update_business_admin_dto_1 = require("./dto/update-business-admin.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
const business_admin_response_dto_1 = require("./dto/business-admin-response.dto");
const paginated_business_admin_response_dto_1 = require("./dto/paginated-business-admin-response.dto");
let BusinessAdminsController = class BusinessAdminsController {
    businessAdminsService;
    constructor(businessAdminsService) {
        this.businessAdminsService = businessAdminsService;
    }
    async create(createBusinessAdminDto) {
        return this.businessAdminsService.create(createBusinessAdminDto);
    }
    async findAll(page, limit, businessId) {
        return this.businessAdminsService.findAll(businessId, page, limit);
    }
    async findOne(id) {
        return this.businessAdminsService.findOne(id);
    }
    async update(id, updateBusinessAdminDto) {
        return this.businessAdminsService.update(id, updateBusinessAdminDto);
    }
    async remove(id) {
        return this.businessAdminsService.remove(id);
    }
};
exports.BusinessAdminsController = BusinessAdminsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new business admin for a specific business',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The business admin has been successfully created.',
        type: business_admin_response_dto_1.BusinessAdminResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden resource. User is not a SuperAdmin.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Business not found or not active.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict. Email or username may already exist for this business or globally.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_business_admin_dto_1.CreateBusinessAdminDto]),
    __metadata("design:returntype", Promise)
], BusinessAdminsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all business admins, optionally filtered by business ID',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination. Defaults to 1.',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page. Defaults to 10.',
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'businessId',
        required: false,
        type: Number,
        description: 'Filter admins by a specific Business ID.',
        example: 1,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of business admins with pagination.',
        type: paginated_business_admin_response_dto_1.PaginatedBusinessAdminResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('businessId', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], BusinessAdminsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific business admin by User ID',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'number',
        description: 'User ID of the business admin',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The business admin details.',
        type: business_admin_response_dto_1.BusinessAdminResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business admin not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusinessAdminsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a business admin by User ID',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'number',
        description: 'User ID of the business admin',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The business admin has been successfully updated.',
        type: business_admin_response_dto_1.BusinessAdminResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business admin not found.' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict. Email may already be in use by another admin in this business.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_business_admin_dto_1.UpdateBusinessAdminDto]),
    __metadata("design:returntype", Promise)
], BusinessAdminsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate a business admin by User ID (soft delete)',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        type: 'number',
        description: 'User ID of the business admin',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The business admin has been successfully deactivated.',
        type: business_admin_response_dto_1.BusinessAdminResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business admin not found.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusinessAdminsController.prototype, "remove", null);
exports.BusinessAdminsController = BusinessAdminsController = __decorate([
    (0, swagger_1.ApiTags)('Business Admins'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('business-admins'),
    __metadata("design:paramtypes", [business_admins_service_1.BusinessAdminsService])
], BusinessAdminsController);
//# sourceMappingURL=business-admins.controller.js.map