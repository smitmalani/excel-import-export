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
exports.PaginatedBusinessAdminResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const business_admin_response_dto_1 = require("./business-admin-response.dto");
class PaginatedBusinessAdminResponseDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPrevPage;
}
exports.PaginatedBusinessAdminResponseDto = PaginatedBusinessAdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [business_admin_response_dto_1.BusinessAdminResponseDto],
        description: 'List of business admin records for the current page.',
    }),
    __metadata("design:type", Array)
], PaginatedBusinessAdminResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Total number of items matching the query.',
    }),
    __metadata("design:type", Number)
], PaginatedBusinessAdminResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Current page number.' }),
    __metadata("design:type", Number)
], PaginatedBusinessAdminResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Number of items per page.' }),
    __metadata("design:type", Number)
], PaginatedBusinessAdminResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Total number of pages.' }),
    __metadata("design:type", Number)
], PaginatedBusinessAdminResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indicates if there is a next page.',
    }),
    __metadata("design:type", Boolean)
], PaginatedBusinessAdminResponseDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates if there is a previous page.',
    }),
    __metadata("design:type", Boolean)
], PaginatedBusinessAdminResponseDto.prototype, "hasPrevPage", void 0);
//# sourceMappingURL=paginated-business-admin-response.dto.js.map