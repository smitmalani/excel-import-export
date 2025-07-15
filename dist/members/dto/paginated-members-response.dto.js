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
exports.PaginatedMembersResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const member_response_dto_1 = require("./member-response.dto");
class PaginatedMembersResponseDto {
    data;
    total;
    page;
    limit;
    totalPages;
    hasNextPage;
    hasPrevPage;
}
exports.PaginatedMembersResponseDto = PaginatedMembersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of member records for the current page.',
        type: [member_response_dto_1.MemberResponseDto],
    }),
    __metadata("design:type", Array)
], PaginatedMembersResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of member records found.' }),
    __metadata("design:type", Number)
], PaginatedMembersResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The current page number.' }),
    __metadata("design:type", Number)
], PaginatedMembersResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The number of items per page.' }),
    __metadata("design:type", Number)
], PaginatedMembersResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The total number of pages.' }),
    __metadata("design:type", Number)
], PaginatedMembersResponseDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates if there is a next page.' }),
    __metadata("design:type", Boolean)
], PaginatedMembersResponseDto.prototype, "hasNextPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates if there is a previous page.' }),
    __metadata("design:type", Boolean)
], PaginatedMembersResponseDto.prototype, "hasPrevPage", void 0);
//# sourceMappingURL=paginated-members-response.dto.js.map