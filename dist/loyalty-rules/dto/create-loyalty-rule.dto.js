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
exports.CreateLoyaltyRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const loyalty_rule_type_enum_1 = require("../enums/loyalty-rule-type.enum");
class CreateLoyaltyRuleDto {
    serviceOfferingId;
    ruleType;
    earnPointPercentage;
    pointsPerUnitCurrency;
    description;
}
exports.CreateLoyaltyRuleDto = CreateLoyaltyRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the service offering this rule applies to.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateLoyaltyRuleDto.prototype, "serviceOfferingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: loyalty_rule_type_enum_1.LoyaltyRuleType,
        description: 'Type of the loyalty rule.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(loyalty_rule_type_enum_1.LoyaltyRuleType),
    __metadata("design:type", String)
], CreateLoyaltyRuleDto.prototype, "ruleType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Percentage of transaction amount to earn as points. Required if ruleType is "Earn". Max 999.99.',
        type: Number,
        format: 'decimal',
        example: 10.5,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.ruleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Earn),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Earn point percentage is required for Earn type rules.',
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, {
        message: 'Earn point percentage must be a number with up to 2 decimal places.',
    }),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.Max)(999.99),
    __metadata("design:type", Number)
], CreateLoyaltyRuleDto.prototype, "earnPointPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Points equivalent to one unit of currency for redemption. Required if ruleType is "Redeem".',
        type: Number,
        format: 'decimal',
        example: 100.0,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.ruleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Redeem),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Points per unit currency is required for Redeem type rules.',
    }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, {
        message: 'Points per unit currency must be a number with up to 2 decimal places.',
    }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateLoyaltyRuleDto.prototype, "pointsPerUnitCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional description for the rule.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLoyaltyRuleDto.prototype, "description", void 0);
//# sourceMappingURL=create-loyalty-rule.dto.js.map