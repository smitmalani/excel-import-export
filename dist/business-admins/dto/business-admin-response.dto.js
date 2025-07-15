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
exports.BusinessAdminResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const role_enum_1 = require("../../auth/enums/role.enum");
class BusinessAdminResponseDto {
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
exports.BusinessAdminResponseDto = BusinessAdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'User ID of the business admin' }),
    __metadata("design:type", Number)
], BusinessAdminResponseDto.prototype, "UserID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Business ID this admin belongs to' }),
    __metadata("design:type", Number)
], BusinessAdminResponseDto.prototype, "BusinessID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Global Corp',
        description: 'Name of the business this admin belongs to',
    }),
    __metadata("design:type", String)
], BusinessAdminResponseDto.prototype, "BusinessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: role_enum_1.Role,
        example: role_enum_1.Role.BusinessAdmin,
        description: 'Role of the user',
    }),
    __metadata("design:type", String)
], BusinessAdminResponseDto.prototype, "Role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'johndoe',
        description: 'Username of the business admin',
    }),
    __metadata("design:type", String)
], BusinessAdminResponseDto.prototype, "Username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Full name of the business admin',
        nullable: true,
    }),
    __metadata("design:type", Object)
], BusinessAdminResponseDto.prototype, "FullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@business.com',
        description: 'Email of the business admin',
    }),
    __metadata("design:type", String)
], BusinessAdminResponseDto.prototype, "Email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Active status of the admin' }),
    __metadata("design:type", Boolean)
], BusinessAdminResponseDto.prototype, "IsActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-01T12:00:00.000Z',
        description: 'Last login timestamp',
        nullable: true,
    }),
    __metadata("design:type", Object)
], BusinessAdminResponseDto.prototype, "LastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Creation timestamp',
    }),
    __metadata("design:type", Date)
], BusinessAdminResponseDto.prototype, "CreatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Last update timestamp',
    }),
    __metadata("design:type", Date)
], BusinessAdminResponseDto.prototype, "UpdatedAt", void 0);
//# sourceMappingURL=business-admin-response.dto.js.map