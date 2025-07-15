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
exports.CreateBusinessDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBusinessDto {
    businessName;
    address;
    phoneNumber;
    adminFullName;
    adminEmail;
    adminPassword;
}
exports.CreateBusinessDto = CreateBusinessDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the business',
        example: 'Health Plus Clinic',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Address of the business',
        example: '123 Wellness Ave, City, State',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number of the business',
        example: '+14155552671',
    }),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of the initial admin user for this business',
        example: 'Jane Doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "adminFullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email of the initial admin user for this business (will be their username)',
        example: 'jane.doe@healthplus.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "adminEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password for the initial admin user',
        example: 'SecurePassword123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8, {
        message: 'Admin password must be at least 8 characters long',
    }),
    __metadata("design:type", String)
], CreateBusinessDto.prototype, "adminPassword", void 0);
//# sourceMappingURL=create-business.dto.js.map