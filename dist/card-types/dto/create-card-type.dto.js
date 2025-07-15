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
exports.CreateCardTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCardTypeDto {
    businessId;
    cardName;
    description;
}
exports.CreateCardTypeDto = CreateCardTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the business this card type belongs to. Required for SuperAdmins.',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCardTypeDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the card type.',
        example: 'Gold Tier',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCardTypeDto.prototype, "cardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description for the card type.',
        example: 'Grants access to exclusive lounge and discounts.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCardTypeDto.prototype, "description", void 0);
//# sourceMappingURL=create-card-type.dto.js.map