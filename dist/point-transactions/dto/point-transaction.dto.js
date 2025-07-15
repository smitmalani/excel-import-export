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
exports.PointTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_1 = require("../../../generated/prisma/index.js");
class PointTransactionDto {
    memberId;
    transactionType;
    amount;
    serviceOfferingId;
    title;
    description;
    billNumber;
    pointsToRedeem;
}
exports.PointTransactionDto = PointTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The ID of the member for this transaction.",
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], PointTransactionDto.prototype, "memberId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The type of transaction: 'Earn' for adding points, 'Redeem' for spending them.",
        enum: [prisma_1.PointTransactionType.Earn, prisma_1.PointTransactionType.Redeem],
        example: prisma_1.PointTransactionType.Earn,
    }),
    (0, class_validator_1.IsEnum)([prisma_1.PointTransactionType.Earn, prisma_1.PointTransactionType.Redeem]),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PointTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The total amount of the bill or transaction.",
        example: 1500.5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PointTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The ID of the service offering being availed.",
        example: 4,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], PointTransactionDto.prototype, "serviceOfferingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "An optional title for the transaction.",
        example: "Annual Checkup",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], PointTransactionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "An optional description for the transaction.",
        example: "Regular annual health checkup.",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PointTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "The bill or invoice number associated with the transaction.",
        example: "INV-2024-9876",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], PointTransactionDto.prototype, "billNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "For Redeem transactions only. The number of points the member wishes to redeem.",
        example: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], PointTransactionDto.prototype, "pointsToRedeem", void 0);
//# sourceMappingURL=point-transaction.dto.js.map