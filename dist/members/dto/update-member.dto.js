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
exports.UpdateMemberDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const member_system_type_enum_1 = require("../enums/member-system-type.enum");
const gender_enum_1 = require("../enums/gender.enum");
class UpdateMemberDto {
    memberType;
    firstName;
    lastName;
    mobileNumber;
    email;
    gender;
    address;
    age;
    profileImageURL;
    smartCardNumber;
    isActive;
}
exports.UpdateMemberDto = UpdateMemberDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of the member',
        enum: member_system_type_enum_1.MemberSystemType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(member_system_type_enum_1.MemberSystemType),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "memberType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Member's first name", example: 'John' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Member's last name", example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Member's mobile number",
        example: '1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Member's email address",
        example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Member's gender",
        enum: gender_enum_1.Gender,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(gender_enum_1.Gender),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Member's address" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Member's age" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseInt(value, 10) : undefined),
    __metadata("design:type", Number)
], UpdateMemberDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL to profile image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "profileImageURL", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "Member's smart card number" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateMemberDto.prototype, "smartCardNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Set member as active or inactive.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return undefined;
    }),
    __metadata("design:type", Boolean)
], UpdateMemberDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-member.dto.js.map