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
exports.BusinessesController = void 0;
const common_1 = require("@nestjs/common");
const businesses_service_1 = require("./businesses.service");
const create_business_dto_1 = require("./dto/create-business.dto");
const update_business_dto_1 = require("./dto/update-business.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_utils_1 = require("../utils/file-upload.utils");
let BusinessesController = class BusinessesController {
    businessesService;
    constructor(businessesService) {
        this.businessesService = businessesService;
    }
    async create(createBusinessDto, logo) {
        return this.businessesService.create(createBusinessDto, logo?.path);
    }
    async findAll() {
        return this.businessesService.findAll();
    }
    async findAllWithInactive() {
        return this.businessesService.findAllWithInactive();
    }
    async findOne(id) {
        return this.businessesService.findOne(id);
    }
    async update(id, updateBusinessDto, logo) {
        return this.businessesService.update(id, updateBusinessDto, logo?.path);
    }
    async remove(id) {
        return this.businessesService.remove(id);
    }
};
exports.BusinessesController = BusinessesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', file_upload_utils_1.businessLogoUploadOptions)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Data for creating a new business, including an optional logo.',
        schema: {
            type: 'object',
            required: [
                'businessName',
                'adminFullName',
                'adminEmail',
                'adminPassword',
            ],
            properties: {
                logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional logo file for the business.',
                    nullable: true,
                },
                businessName: { type: 'string', example: 'Health Plus Clinic' },
                address: {
                    type: 'string',
                    example: '123 Wellness Ave, City, State',
                    nullable: true,
                },
                phoneNumber: {
                    type: 'string',
                    example: '+14155552671',
                    nullable: true,
                },
                adminFullName: { type: 'string', example: 'Jane Doe' },
                adminEmail: {
                    type: 'string',
                    format: 'email',
                    example: 'jane.doe@healthplus.com',
                },
                adminPassword: {
                    type: 'string',
                    format: 'password',
                    example: 'SecurePassword123',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new business and its initial admin user',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The business has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden resource. User is not a SuperAdmin.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict. Business or admin email may already exist.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_business_dto_1.CreateBusinessDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all active businesses',
        description: 'Accessible only by SuperAdmins. Returns only active businesses.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active businesses.',
        type: [create_business_dto_1.CreateBusinessDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all businesses including inactive ones',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all businesses (active and inactive).',
        type: [create_business_dto_1.CreateBusinessDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "findAllWithInactive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific business by ID',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Business ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The business details.',
        type: create_business_dto_1.CreateBusinessDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', file_upload_utils_1.businessLogoUploadOptions)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Data for updating a business, including an optional new logo.',
        schema: {
            type: 'object',
            properties: {
                logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional new logo file for the business.',
                    nullable: true,
                },
                businessName: {
                    type: 'string',
                    example: 'Health Plus Clinic Updated',
                    nullable: true,
                },
                address: {
                    type: 'string',
                    example: '456 Wellness Rd, City, State',
                    nullable: true,
                },
                phoneNumber: {
                    type: 'string',
                    example: '+14155552672',
                    nullable: true,
                },
                isActive: { type: 'boolean', example: true, nullable: true },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a business by ID',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Business ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The business has been successfully updated.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_business_dto_1.UpdateBusinessDto, Object]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate a business by ID (soft delete)',
        description: 'Accessible only by SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Business ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The business has been successfully deactivated.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden resource.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Business is already inactive.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusinessesController.prototype, "remove", null);
exports.BusinessesController = BusinessesController = __decorate([
    (0, swagger_1.ApiTags)('Businesses'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('businesses'),
    __metadata("design:paramtypes", [businesses_service_1.BusinessesService])
], BusinessesController);
//# sourceMappingURL=businesses.controller.js.map