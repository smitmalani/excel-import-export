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
exports.UpdateLoyaltyRuleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateLoyaltyRuleDto {
    earnPointPercentage;
    pointsPerUnitCurrency;
    description;
    isActive;
}
exports.UpdateLoyaltyRuleDto = UpdateLoyaltyRuleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Percentage of transaction amount to earn as points. Applicable only if rule type is "Earn". Max 999.99.',
        type: Number,
        format: 'decimal',
        example: 10.5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, {
        message: 'Earn point percentage must be a number with up to 2 decimal places.',
    }),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.Max)(999.99),
    __metadata("design:type", Number)
], UpdateLoyaltyRuleDto.prototype, "earnPointPercentage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Points equivalent to one unit of currency for redemption. Applicable only if rule type is "Redeem".',
        type: Number,
        format: 'decimal',
        example: 100.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, {
        message: 'Points per unit currency must be a number with up to 2 decimal places.',
    }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], UpdateLoyaltyRuleDto.prototype, "pointsPerUnitCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional description for the rule.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLoyaltyRuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Set rule as active or inactive.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLoyaltyRuleDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-loyalty-rule.dto.js.map