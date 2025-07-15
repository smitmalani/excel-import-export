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
exports.BusinessSubAdminResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const role_enum_1 = require("../../auth/enums/role.enum");
class BusinessSubAdminResponseDto {
    UserID;
    BusinessID;
    BusinessName;
    Role;
    Username;
    FullName;
    Email;
    IsActive;
    LastLogin;
    CreatedAt;
    UpdatedAt;
}
exports.BusinessSubAdminResponseDto = BusinessSubAdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 101 }),
    __metadata("design:type", Number)
], BusinessSubAdminResponseDto.prototype, "UserID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], BusinessSubAdminResponseDto.prototype, "BusinessID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Awesome Business' }),
    __metadata("design:type", String)
], BusinessSubAdminResponseDto.prototype, "BusinessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: role_enum_1.Role.BusinessSubAdmin }),
    __metadata("design:type", String)
], BusinessSubAdminResponseDto.prototype, "Role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe_sub' }),
    __metadata("design:type", String)
], BusinessSubAdminResponseDto.prototype, "Username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], BusinessSubAdminResponseDto.prototype, "FullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'john.doe@example.com' }),
    __metadata("design:type", String)
], BusinessSubAdminResponseDto.prototype, "Email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], BusinessSubAdminResponseDto.prototype, "IsActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-10-27T10:00:00.000Z', nullable: true }),
    __metadata("design:type", Object)
], BusinessSubAdminResponseDto.prototype, "LastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], BusinessSubAdminResponseDto.prototype, "CreatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], BusinessSubAdminResponseDto.prototype, "UpdatedAt", void 0);
//# sourceMappingURL=business-sub-admin-response.dto.js.map