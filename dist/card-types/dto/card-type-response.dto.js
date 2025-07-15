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
exports.CardTypeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CardTypeResponseDto {
    CardTypeID;
    BusinessID;
    BusinessName;
    CardName;
    Description;
}
exports.CardTypeResponseDto = CardTypeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The unique identifier of the card type.',
        example: 1,
    }),
    __metadata("design:type", Number)
], CardTypeResponseDto.prototype, "CardTypeID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the business this card type belongs to.',
        example: 1,
    }),
    __metadata("design:type", Number)
], CardTypeResponseDto.prototype, "BusinessID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the business this card type belongs to (populated for SuperAdmins).',
        example: 'Global Corp Inc.',
        required: false,
    }),
    __metadata("design:type", String)
], CardTypeResponseDto.prototype, "BusinessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the card type.',
        example: 'Gold Tier',
    }),
    __metadata("design:type", String)
], CardTypeResponseDto.prototype, "CardName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description for the card type.',
        example: 'Grants access to exclusive lounge and discounts.',
        required: false,
    }),
    __metadata("design:type", Object)
], CardTypeResponseDto.prototype, "Description", void 0);
//# sourceMappingURL=card-type-response.dto.js.map