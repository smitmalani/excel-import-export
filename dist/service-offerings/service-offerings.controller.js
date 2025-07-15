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
exports.ServiceOfferingsController = void 0;
const common_1 = require("@nestjs/common");
const service_offerings_service_1 = require("./service-offerings.service");
const create_service_offering_dto_1 = require("./dto/create-service-offering.dto");
const update_service_offering_dto_1 = require("./dto/update-service-offering.dto");
const service_offerings_query_dto_1 = require("./dto/service-offerings-query.dto");
const service_offering_response_dto_1 = require("./dto/service-offering-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let ServiceOfferingsController = class ServiceOfferingsController {
    serviceOfferingsService;
    constructor(serviceOfferingsService) {
        this.serviceOfferingsService = serviceOfferingsService;
    }
    async create(createServiceOfferingDto, req) {
        return this.serviceOfferingsService.create(createServiceOfferingDto, req.user);
    }
    async findAll(queryDto, req) {
        if (queryDto.isActive === undefined) {
            queryDto.isActive = true;
        }
        return this.serviceOfferingsService.findAll(queryDto, req.user);
    }
    async findOne(id, req) {
        return this.serviceOfferingsService.findOne(id, req.user);
    }
    async update(id, updateServiceOfferingDto, req) {
        return this.serviceOfferingsService.update(id, updateServiceOfferingDto, req.user);
    }
    async remove(id, req) {
        return this.serviceOfferingsService.remove(id, req.user);
    }
};
exports.ServiceOfferingsController = ServiceOfferingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new service offering',
        description: 'SuperAdmins must provide `businessId`. BusinessAdmins should omit `businessId` (it will be inferred from their token); if provided, it must match their own business.',
    }),
    (0, swagger_1.ApiBody)({ type: create_service_offering_dto_1.CreateServiceOfferingDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Service offering created successfully. `businessId` and `businessName` are only included in the response for SuperAdmins.',
        type: service_offering_response_dto_1.ServiceOfferingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data (e.g., missing businessId for SuperAdmin, or mismatched businessId for BusinessAdmin).',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not permitted to perform this action.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Service offering with this name and card type already exists for the business.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_offering_dto_1.CreateServiceOfferingDto, Object]),
    __metadata("design:returntype", Promise)
], ServiceOfferingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'List all service offerings with pagination and filters',
        description: 'BusinessAdmins will only see offerings for their own business. `businessId` and `businessName` are only included in the response items for SuperAdmins.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'businessId',
        required: false,
        type: Number,
        description: 'Filter by Business ID (Only applicable for SuperAdmins). Ignored for BusinessAdmins.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        description: 'Search term for service name.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filter by active status (true or false).',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cardTypeId',
        required: false,
        type: Number,
        description: 'Filter by CardType ID.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of service offerings retrieved.',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ServiceOfferingResponseDto' },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not permitted to perform this action.',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [service_offerings_query_dto_1.ServiceOfferingsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ServiceOfferingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific service offering by ID',
        description: 'BusinessAdmins can only retrieve offerings for their own business. `businessId` and `businessName` are only included in the response for SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Service Offering ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Service offering details retrieved.',
        type: service_offering_response_dto_1.ServiceOfferingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Service offering not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: "User not permitted to perform this action (e.g., BusinessAdmin trying to access another business's offering).",
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ServiceOfferingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a service offering',
        description: 'BusinessAdmins can only update offerings for their own business. `businessId` and `businessName` are only included in the response for SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Service Offering ID' }),
    (0, swagger_1.ApiBody)({ type: update_service_offering_dto_1.UpdateServiceOfferingDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Service offering updated successfully.',
        type: service_offering_response_dto_1.ServiceOfferingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Service offering not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not permitted to perform this action.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Another service offering with this name and card type already exists.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_service_offering_dto_1.UpdateServiceOfferingDto, Object]),
    __metadata("design:returntype", Promise)
], ServiceOfferingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate (soft delete) a service offering',
        description: 'BusinessAdmins can only deactivate offerings for their own business. `businessId` and `businessName` are only included in the response for SuperAdmins.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Service Offering ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Service offering deactivated successfully.',
        type: service_offering_response_dto_1.ServiceOfferingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Service offering not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not permitted to perform this action.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ServiceOfferingsController.prototype, "remove", null);
exports.ServiceOfferingsController = ServiceOfferingsController = __decorate([
    (0, swagger_1.ApiTags)('Service Offerings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('service-offerings'),
    __metadata("design:paramtypes", [service_offerings_service_1.ServiceOfferingsService])
], ServiceOfferingsController);
//# sourceMappingURL=service-offerings.controller.js.map