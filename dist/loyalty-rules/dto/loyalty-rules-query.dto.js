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
exports.LoyaltyRulesQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const loyalty_rule_type_enum_1 = require("../enums/loyalty-rule-type.enum");
const class_transformer_1 = require("class-transformer");
class LoyaltyRulesQueryDto {
    page = 1;
    limit = 10;
    serviceOfferingId;
    ruleType;
}
exports.LoyaltyRulesQueryDto = LoyaltyRulesQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination.',
        default: 1,
        type: Number,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LoyaltyRulesQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page.',
        default: 10,
        type: Number,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LoyaltyRulesQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by Service Offering ID.',
        type: Number,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LoyaltyRulesQueryDto.prototype, "serviceOfferingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: loyalty_rule_type_enum_1.LoyaltyRuleType,
        description: 'Filter by rule type.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(loyalty_rule_type_enum_1.LoyaltyRuleType),
    __metadata("design:type", String)
], LoyaltyRulesQueryDto.prototype, "ruleType", void 0);
//# sourceMappingURL=loyalty-rules-query.dto.js.map