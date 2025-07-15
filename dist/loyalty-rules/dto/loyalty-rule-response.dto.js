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
exports.LoyaltyRuleResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const loyalty_rule_type_enum_1 = require("../enums/loyalty-rule-type.enum");
class LoyaltyRuleResponseDto {
    ruleId;
    serviceOfferingId;
    serviceOfferingName;
    cardTypeName;
    ruleType;
    earnPointPercentage;
    pointsPerUnitCurrency;
    description;
    isActive;
    createdAt;
    updatedAt;
}
exports.LoyaltyRuleResponseDto = LoyaltyRuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LoyaltyRuleResponseDto.prototype, "ruleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LoyaltyRuleResponseDto.prototype, "serviceOfferingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the service offering.' }),
    __metadata("design:type", String)
], LoyaltyRuleResponseDto.prototype, "serviceOfferingName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the card type associated with the service offering.',
    }),
    __metadata("design:type", String)
], LoyaltyRuleResponseDto.prototype, "cardTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: loyalty_rule_type_enum_1.LoyaltyRuleType,
        description: 'Type of the loyalty rule.',
    }),
    __metadata("design:type", String)
], LoyaltyRuleResponseDto.prototype, "ruleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Percentage of transaction amount to earn as points. Applicable if ruleType is "Earn".',
        type: Number,
        format: 'decimal',
    }),
    __metadata("design:type", Number)
], LoyaltyRuleResponseDto.prototype, "earnPointPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Points equivalent to one unit of currency for redemption. Applicable if ruleType is "Redeem".',
        type: Number,
        format: 'decimal',
    }),
    __metadata("design:type", Number)
], LoyaltyRuleResponseDto.prototype, "pointsPerUnitCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Description of the rule.' }),
    __metadata("design:type", String)
], LoyaltyRuleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates if the rule is currently active.' }),
    __metadata("design:type", Boolean)
], LoyaltyRuleResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the rule was created.' }),
    __metadata("design:type", Date)
], LoyaltyRuleResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date and time when the rule was last updated.' }),
    __metadata("design:type", Date)
], LoyaltyRuleResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=loyalty-rule-response.dto.js.map