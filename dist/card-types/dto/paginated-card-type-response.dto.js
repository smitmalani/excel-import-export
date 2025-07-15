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
exports.PaginatedCardTypeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const card_type_response_dto_1 = require("./card-type-response.dto");
class PaginatedCardTypeResponseDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPrevPage;
}
exports.PaginatedCardTypeResponseDto = PaginatedCardTypeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of card type records for the current page.',
        type: [card_type_response_dto_1.CardTypeResponseDto],
    }),
    __metadata("design:type", Array)
], PaginatedCardTypeResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of card types available.',
        example: 100,
    }),
    __metadata("design:type", Number)
], PaginatedCardTypeResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number.', example: 1 }),
    __metadata("design:type", Number)
], PaginatedCardTypeResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of items per page.', example: 10 }),
    __metadata("design:type", Number)
], PaginatedCardTypeResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages.', example: 10 }),
    __metadata("design:type", Number)
], PaginatedCardTypeResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if there is a next page.',
        example: true,
    }),
    __metadata("design:type", Boolean)
], PaginatedCardTypeResponseDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if there is a previous page.',
        example: false,
    }),
    __metadata("design:type", Boolean)
], PaginatedCardTypeResponseDto.prototype, "hasPrevPage", void 0);
//# sourceMappingURL=paginated-card-type-response.dto.js.map