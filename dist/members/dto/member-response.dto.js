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
exports.MemberResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const gender_enum_1 = require("../enums/gender.enum");
const member_system_type_enum_1 = require("../enums/member-system-type.enum");
class MemberResponseDto {
    memberID;
    businessID;
    businessName;
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
    cardTypeID;
    cardTypeName;
    loyaltyCardUrl;
    currentLoyaltyPoints;
    isActive;
    registeredByUserID;
    createdAt;
    updatedAt;
}
exports.MemberResponseDto = MemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The member's unique identifier." }),
    __metadata("design:type", Number)
], MemberResponseDto.prototype, "memberID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the business the member belongs to.' }),
    __metadata("design:type", Number)
], MemberResponseDto.prototype, "businessID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "The name of the business (included for SuperAdmins' context).",
    }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The classification of the member.',
        enum: member_system_type_enum_1.MemberSystemType,
    }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "memberType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The member's first name." }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "The member's last name." }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "The member's mobile number." }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "mobileNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "The member's email address." }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "The member's gender.",
        enum: gender_enum_1.Gender,
    }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "The member's physical address." }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: "The member's age." }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "URL of the member's profile picture.",
    }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "profileImageURL", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "The member's unique smart card number.",
    }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "smartCardNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The ID of the loyalty card type held by the member.',
    }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "cardTypeID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The name of the loyalty card type held by the member.',
    }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "cardTypeName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL of the generated loyalty card image.',
    }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "loyaltyCardUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The member's current loyalty points balance.",
        type: 'number',
        format: 'double',
    }),
    __metadata("design:type", Number)
], MemberResponseDto.prototype, "currentLoyaltyPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the member account is active.' }),
    __metadata("design:type", Boolean)
], MemberResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The ID of the user who registered this member.',
    }),
    __metadata("design:type", Object)
], MemberResponseDto.prototype, "registeredByUserID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The timestamp when the member was created.' }),
    __metadata("design:type", Date)
], MemberResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The timestamp when the member was last updated.',
    }),
    __metadata("design:type", Date)
], MemberResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=member-response.dto.js.map