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
exports.PaginatedLoyaltyRuleResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const loyalty_rule_response_dto_1 = require("./loyalty-rule-response.dto");
class PaginatedLoyaltyRuleResponseDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPrevPage;
}
exports.PaginatedLoyaltyRuleResponseDto = PaginatedLoyaltyRuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [loyalty_rule_response_dto_1.LoyaltyRuleResponseDto],
        description: 'List of loyalty rules for the current page.',
    }),
    __metadata("design:type", Array)
], PaginatedLoyaltyRuleResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of loyalty rules matching the query.',
    }),
    __metadata("design:type", Number)
], PaginatedLoyaltyRuleResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number.' }),
    __metadata("design:type", Number)
], PaginatedLoyaltyRuleResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page.' }),
    __metadata("design:type", Number)
], PaginatedLoyaltyRuleResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages.' }),
    __metadata("design:type", Number)
], PaginatedLoyaltyRuleResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates if there is a next page.' }),
    __metadata("design:type", Boolean)
], PaginatedLoyaltyRuleResponseDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates if there is a previous page.' }),
    __metadata("design:type", Boolean)
], PaginatedLoyaltyRuleResponseDto.prototype, "hasPrevPage", void 0);
//# sourceMappingURL=paginated-loyalty-rule-response.dto.js.map