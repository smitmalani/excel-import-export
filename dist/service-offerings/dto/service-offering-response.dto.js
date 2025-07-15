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
exports.ServiceOfferingResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ServiceOfferingResponseDto {
    serviceOfferingID;
    businessId;
    businessName;
    serviceName;
    cardTypeId;
    cardTypeName;
    description;
    isActive;
    createdAt;
    updatedAt;
}
exports.ServiceOfferingResponseDto = ServiceOfferingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the service offering.',
        example: 1,
    }),
    __metadata("design:type", Number)
], ServiceOfferingResponseDto.prototype, "serviceOfferingID", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of the business this service offering belongs to (only present for SuperAdmins).',
        example: 10,
    }),
    __metadata("design:type", Number)
], ServiceOfferingResponseDto.prototype, "businessId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the business (only present for SuperAdmins).',
        example: 'MediCare Clinic',
    }),
    __metadata("design:type", String)
], ServiceOfferingResponseDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the service offering.',
        example: 'Standard Consultation',
    }),
    __metadata("design:type", String)
], ServiceOfferingResponseDto.prototype, "serviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the card type associated with this service.',
        example: 1,
    }),
    __metadata("design:type", Number)
], ServiceOfferingResponseDto.prototype, "cardTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the associated card type.',
        example: 'Gold Member',
    }),
    __metadata("design:type", String)
], ServiceOfferingResponseDto.prototype, "cardTypeName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the service offering.',
        example: 'A standard 30-minute consultation.',
    }),
    __metadata("design:type", Object)
], ServiceOfferingResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active status of the service offering.',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ServiceOfferingResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time of creation.',
        example: '2024-01-01T10:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ServiceOfferingResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date and time of last update.',
        example: '2024-01-02T12:00:00.000Z',
    }),
    __metadata("design:type", Date)
], ServiceOfferingResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=service-offering-response.dto.js.map