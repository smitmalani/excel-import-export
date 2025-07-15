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
exports.QueryPointTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const prisma_1 = require("../../../generated/prisma/index.js");
class QueryPointTransactionDto {
    page = 1;
    limit = 10;
    userId;
    memberId;
    fromDate;
    toDate;
    transactionType;
    cardTypeId;
    serviceOfferingId;
    search;
}
exports.QueryPointTransactionDto = QueryPointTransactionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Page number for pagination.",
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryPointTransactionDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Number of items per page.",
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryPointTransactionDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Filter by the user (Sub-Admin/Admin) who processed the transaction.",
        example: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryPointTransactionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Filter by member ID.",
        example: 12,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryPointTransactionDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "The start date for the filter range (YYYY-MM-DD).",
        example: "2024-05-01",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryPointTransactionDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "The end date for the filter range (YYYY-MM-DD).",
        example: "2024-05-31",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryPointTransactionDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Filter by transaction type: 'Earn' or 'Redeem'.",
        enum: [prisma_1.PointTransactionType.Earn, prisma_1.PointTransactionType.Redeem],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([prisma_1.PointTransactionType.Earn, prisma_1.PointTransactionType.Redeem]),
    __metadata("design:type", String)
], QueryPointTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Filter by Card Type ID.",
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryPointTransactionDto.prototype, "cardTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Filter by Service Offering ID.",
        example: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryPointTransactionDto.prototype, "serviceOfferingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Search by member name, mobile, or bill number.",
        example: "Ajay",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryPointTransactionDto.prototype, "search", void 0);
//# sourceMappingURL=query-point-transaction.dto.js.map