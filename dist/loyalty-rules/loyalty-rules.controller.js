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
exports.LoyaltyRulesController = void 0;
const common_1 = require("@nestjs/common");
const loyalty_rules_service_1 = require("./loyalty-rules.service");
const create_loyalty_rule_dto_1 = require("./dto/create-loyalty-rule.dto");
const update_loyalty_rule_dto_1 = require("./dto/update-loyalty-rule.dto");
const loyalty_rule_response_dto_1 = require("./dto/loyalty-rule-response.dto");
const loyalty_rules_query_dto_1 = require("./dto/loyalty-rules-query.dto");
const paginated_loyalty_rule_response_dto_1 = require("./dto/paginated-loyalty-rule-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let LoyaltyRulesController = class LoyaltyRulesController {
    loyaltyRulesService;
    constructor(loyaltyRulesService) {
        this.loyaltyRulesService = loyaltyRulesService;
    }
    async create(createLoyaltyRuleDto, req) {
        return this.loyaltyRulesService.create(createLoyaltyRuleDto, req.user);
    }
    async findAll(queryDto, req) {
        return this.loyaltyRulesService.findAll(queryDto, req.user);
    }
    async findOne(id, req) {
        return this.loyaltyRulesService.findOne(id, req.user);
    }
    async update(id, updateLoyaltyRuleDto, req) {
        return this.loyaltyRulesService.update(id, updateLoyaltyRuleDto, req.user);
    }
    async remove(id, req) {
        return this.loyaltyRulesService.remove(id, req.user);
    }
};
exports.LoyaltyRulesController = LoyaltyRulesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new loyalty rule for the business.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Loyalty rule created successfully.',
        type: loyalty_rule_response_dto_1.LoyaltyRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Rule already exists for this service offering and type.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_loyalty_rule_dto_1.CreateLoyaltyRuleDto, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyRulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all loyalty rules for the business (paginated).',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of loyalty rules retrieved.',
        type: paginated_loyalty_rule_response_dto_1.PaginatedLoyaltyRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized.',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loyalty_rules_query_dto_1.LoyaltyRulesQueryDto, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyRulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific loyalty rule by ID for the business.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Loyalty Rule ID', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Loyalty rule details retrieved.',
        type: loyalty_rule_response_dto_1.LoyaltyRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Loyalty rule not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyRulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Update a loyalty rule by ID for the business.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Loyalty Rule ID', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Loyalty rule updated successfully.',
        type: loyalty_rule_response_dto_1.LoyaltyRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Loyalty rule not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_loyalty_rule_dto_1.UpdateLoyaltyRuleDto, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyRulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate (soft delete) a loyalty rule by ID for the business.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Loyalty Rule ID', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Loyalty rule deactivated successfully.',
        type: loyalty_rule_response_dto_1.LoyaltyRuleResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Loyalty rule not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyRulesController.prototype, "remove", null);
exports.LoyaltyRulesController = LoyaltyRulesController = __decorate([
    (0, swagger_1.ApiTags)('Loyalty Rules'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('loyalty-rules'),
    __metadata("design:paramtypes", [loyalty_rules_service_1.LoyaltyRulesService])
], LoyaltyRulesController);
//# sourceMappingURL=loyalty-rules.controller.js.map