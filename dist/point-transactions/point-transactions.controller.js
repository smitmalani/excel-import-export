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
exports.PointTransactionsController = void 0;
const common_1 = require("@nestjs/common");
const point_transactions_service_1 = require("./point-transactions.service");
const point_transaction_dto_1 = require("./dto/point-transaction.dto");
const query_point_transaction_dto_1 = require("./dto/query-point-transaction.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const swagger_1 = require("@nestjs/swagger");
let PointTransactionsController = class PointTransactionsController {
    pointTransactionsService;
    constructor(pointTransactionsService) {
        this.pointTransactionsService = pointTransactionsService;
    }
    create(pointTransactionDto, req) {
        return this.pointTransactionsService.createPointTransaction(pointTransactionDto, req.user);
    }
    findAll(query, req) {
        return this.pointTransactionsService.findAll(query, req.user);
    }
};
exports.PointTransactionsController = PointTransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin, role_enum_1.Role.BusinessSubAdmin),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: "Create a point transaction (Earn/Redeem)",
        description: "Allows a Business Admin or Sub-Admin to record a point transaction for a member. The logic for calculating points earned or value redeemed is handled by the service based on active loyalty rules.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "The transaction has been successfully created.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request (e.g., insufficient points, invalid data).",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Not Found (e.g., member or service not found).",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [point_transaction_dto_1.PointTransactionDto, Object]),
    __metadata("design:returntype", void 0)
], PointTransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: "Get point transaction history for the business",
        description: "Retrieves a paginated and filterable list of all point transactions for the business admin's business.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "A paginated list of point transactions.",
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden." }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_point_transaction_dto_1.QueryPointTransactionDto, Object]),
    __metadata("design:returntype", void 0)
], PointTransactionsController.prototype, "findAll", null);
exports.PointTransactionsController = PointTransactionsController = __decorate([
    (0, swagger_1.ApiTags)("Point Transactions"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("point-transactions"),
    __metadata("design:paramtypes", [point_transactions_service_1.PointTransactionsService])
], PointTransactionsController);
//# sourceMappingURL=point-transactions.controller.js.map