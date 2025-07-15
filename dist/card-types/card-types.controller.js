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
exports.CardTypesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const card_types_service_1 = require("./card-types.service");
const create_card_type_dto_1 = require("./dto/create-card-type.dto");
const update_card_type_dto_1 = require("./dto/update-card-type.dto");
const find_all_card_types_query_dto_1 = require("./dto/find-all-card-types-query.dto");
const card_type_response_dto_1 = require("./dto/card-type-response.dto");
const paginated_card_type_response_dto_1 = require("./dto/paginated-card-type-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
let CardTypesController = class CardTypesController {
    cardTypesService;
    constructor(cardTypesService) {
        this.cardTypesService = cardTypesService;
    }
    async create(createCardTypeDto, req) {
        return this.cardTypesService.create(createCardTypeDto, req.user);
    }
    async findAll(queryDto, req) {
        return this.cardTypesService.findAll(queryDto, req.user);
    }
    async findOne(id, req) {
        return this.cardTypesService.findOne(id, req.user);
    }
    async update(id, updateCardTypeDto, req) {
        return this.cardTypesService.update(id, updateCardTypeDto, req.user);
    }
    async remove(id, req) {
        return this.cardTypesService.remove(id, req.user);
    }
};
exports.CardTypesController = CardTypesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new card type (SuperAdmin only).' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Card type created successfully.',
        type: card_type_response_dto_1.CardTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Card type with this name already exists for the business.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Business not found.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_card_type_dto_1.CreateCardTypeDto, Object]),
    __metadata("design:returntype", Promise)
], CardTypesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all card types (paginated). SuperAdmins can filter by businessId; BusinessAdmins see their own.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of card types retrieved.',
        type: paginated_card_type_response_dto_1.PaginatedCardTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_card_types_query_dto_1.FindAllCardTypesQueryDto, Object]),
    __metadata("design:returntype", Promise)
], CardTypesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific card type by ID. BusinessAdmins can only access their own.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Card Type ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Card type details.',
        type: card_type_response_dto_1.CardTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Card type not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: "Forbidden (if BusinessAdmin tries to access other business's card type).",
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardTypesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Update a card type (SuperAdmin only).' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Card Type ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Card type updated successfully.',
        type: card_type_response_dto_1.CardTypeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Card type not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Card type with this name already exists for the business.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_card_type_dto_1.UpdateCardTypeDto, Object]),
    __metadata("design:returntype", Promise)
], CardTypesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a card type (SuperAdmin only). Note: This is a hard delete and may cascade.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Card Type ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Card type deleted successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Card type not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Cannot delete card type due to existing references not handled by cascade rules.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardTypesController.prototype, "remove", null);
exports.CardTypesController = CardTypesController = __decorate([
    (0, swagger_1.ApiTags)('Card Types'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('card-types'),
    __metadata("design:paramtypes", [card_types_service_1.CardTypesService])
], CardTypesController);
//# sourceMappingURL=card-types.controller.js.map