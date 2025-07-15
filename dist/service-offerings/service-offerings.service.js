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
exports.ServiceOfferingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../auth/enums/role.enum");
let ServiceOfferingsService = class ServiceOfferingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToResponseDto(serviceOffering, currentUserRole) {
        const response = {
            serviceOfferingID: serviceOffering.ServiceOfferingID,
            serviceName: serviceOffering.ServiceName,
            cardTypeId: serviceOffering.CardTypeID,
            cardTypeName: serviceOffering.RequiredCardType?.CardName,
            description: serviceOffering.Description,
            isActive: serviceOffering.IsActive,
        };
        if (currentUserRole === role_enum_1.Role.SuperAdmin) {
            response.businessId = serviceOffering.BusinessID;
            response.businessName = serviceOffering.Business?.BusinessName;
        }
        return response;
    }
    async create(createDto, currentUser) {
        let businessIdToUse;
        if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            if (!createDto.businessId) {
                throw new common_1.BadRequestException('businessId is required for SuperAdmins when creating a service offering.');
            }
            const business = await this.prisma.business.findUnique({
                where: { BusinessID: createDto.businessId },
            });
            if (!business) {
                throw new common_1.NotFoundException(`Business with ID ${createDto.businessId} not found.`);
            }
            businessIdToUse = createDto.businessId;
        }
        else if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('BusinessAdmin must be associated with a business.');
            }
            if (createDto.businessId &&
                createDto.businessId !== currentUser.BusinessID) {
                throw new common_1.ForbiddenException('BusinessAdmins cannot specify a businessId different from their own. The businessId field should be omitted.');
            }
            if ('businessId' in createDto &&
                createDto.businessId !== undefined &&
                createDto.businessId !== null) {
                if (createDto.businessId !== currentUser.BusinessID) {
                    throw new common_1.BadRequestException('BusinessAdmins should not provide businessId; it is inferred. If provided, it must match your business.');
                }
            }
            businessIdToUse = currentUser.BusinessID;
        }
        else {
            throw new common_1.ForbiddenException('User role not permitted to create service offerings.');
        }
        const cardType = await this.prisma.cardType.findUnique({
            where: { CardTypeID: createDto.cardTypeId },
        });
        if (!cardType || cardType.BusinessID !== businessIdToUse) {
            throw new common_1.BadRequestException(`CardType with ID ${createDto.cardTypeId} not found or does not belong to Business ID ${businessIdToUse}.`);
        }
        const existing = await this.prisma.serviceOffering.findUnique({
            where: {
                BusinessID_ServiceName_CardTypeID: {
                    BusinessID: businessIdToUse,
                    ServiceName: createDto.serviceName,
                    CardTypeID: createDto.cardTypeId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('A service offering with this name and card type already exists for this business.');
        }
        const newServiceOffering = await this.prisma.serviceOffering.create({
            data: {
                BusinessID: businessIdToUse,
                ServiceName: createDto.serviceName,
                CardTypeID: createDto.cardTypeId,
                Description: createDto.description,
                IsActive: true,
            },
            include: { Business: true, RequiredCardType: true },
        });
        return this.mapToResponseDto(newServiceOffering, currentUser.Role);
    }
    async findAll(queryDto, currentUser) {
        const { page = 1, limit = 10, search, isActive, cardTypeId } = queryDto;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('BusinessAdmin is not associated with any business.');
            }
            whereClause.BusinessID = currentUser.BusinessID;
        }
        else if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            if (queryDto.businessId) {
                whereClause.BusinessID = queryDto.businessId;
            }
        }
        else {
            throw new common_1.ForbiddenException('User role not permitted to view service offerings.');
        }
        if (search) {
            whereClause.ServiceName = { contains: search };
        }
        if (isActive !== undefined) {
            whereClause.IsActive =
                typeof isActive === 'string' ? isActive === 'true' : isActive;
        }
        if (cardTypeId) {
            whereClause.CardTypeID = cardTypeId;
        }
        const [serviceOfferings, total] = await this.prisma.$transaction([
            this.prisma.serviceOffering.findMany({
                where: whereClause,
                include: { Business: true, RequiredCardType: true },
                skip,
                take: limit,
                orderBy: { ServiceOfferingID: 'desc' },
            }),
            this.prisma.serviceOffering.count({ where: whereClause }),
        ]);
        const responseDtos = serviceOfferings.map((so) => this.mapToResponseDto(so, currentUser.Role));
        return { data: responseDtos, total, page, limit };
    }
    async findOne(id, currentUser) {
        const serviceOffering = await this.prisma.serviceOffering.findUnique({
            where: { ServiceOfferingID: id },
            include: { Business: true, RequiredCardType: true },
        });
        if (!serviceOffering) {
            throw new common_1.NotFoundException(`Service Offering with ID ${id} not found.`);
        }
        if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID ||
                serviceOffering.BusinessID !== currentUser.BusinessID) {
                throw new common_1.ForbiddenException('You do not have permission to access this service offering.');
            }
        }
        else if (currentUser.Role !== role_enum_1.Role.SuperAdmin) {
            throw new common_1.ForbiddenException('User role not permitted to view this service offering.');
        }
        return this.mapToResponseDto(serviceOffering, currentUser.Role);
    }
    async update(id, updateDto, currentUser) {
        const serviceOffering = await this.prisma.serviceOffering.findUnique({
            where: { ServiceOfferingID: id },
        });
        if (!serviceOffering) {
            throw new common_1.NotFoundException(`Service Offering with ID ${id} not found.`);
        }
        let businessIdToScope;
        if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID ||
                serviceOffering.BusinessID !== currentUser.BusinessID) {
                throw new common_1.ForbiddenException('You do not have permission to update this service offering.');
            }
            businessIdToScope = currentUser.BusinessID;
        }
        else if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            businessIdToScope = serviceOffering.BusinessID;
        }
        else {
            throw new common_1.ForbiddenException('User role not permitted to update service offerings.');
        }
        if (updateDto.cardTypeId &&
            updateDto.cardTypeId !== serviceOffering.CardTypeID) {
            const cardType = await this.prisma.cardType.findUnique({
                where: { CardTypeID: updateDto.cardTypeId },
            });
            if (!cardType || cardType.BusinessID !== businessIdToScope) {
                throw new common_1.BadRequestException(`CardType with ID ${updateDto.cardTypeId} not found or does not belong to Business ID ${businessIdToScope}.`);
            }
        }
        const newServiceName = updateDto.serviceName ?? serviceOffering.ServiceName;
        const newCardTypeId = updateDto.cardTypeId ?? serviceOffering.CardTypeID;
        if ((updateDto.serviceName !== undefined ||
            updateDto.cardTypeId !== undefined) &&
            (newServiceName !== serviceOffering.ServiceName ||
                newCardTypeId !== serviceOffering.CardTypeID)) {
            const existing = await this.prisma.serviceOffering.findFirst({
                where: {
                    BusinessID: businessIdToScope,
                    ServiceName: newServiceName,
                    CardTypeID: newCardTypeId,
                    ServiceOfferingID: { not: id },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Another service offering with this name and card type already exists for this business.');
            }
        }
        const dataToUpdate = {};
        if (updateDto.serviceName) {
            dataToUpdate.ServiceName = updateDto.serviceName;
        }
        if (updateDto.description) {
            dataToUpdate.Description = updateDto.description;
        }
        if (updateDto.isActive !== undefined) {
            dataToUpdate.IsActive = updateDto.isActive;
        }
        if (Object.keys(dataToUpdate).length === 0) {
            const currentFullServiceOffering = await this.prisma.serviceOffering.findUnique({
                where: { ServiceOfferingID: id },
                include: { Business: true, RequiredCardType: true },
            });
            return this.mapToResponseDto(currentFullServiceOffering, currentUser.Role);
        }
        const updatedServiceOffering = await this.prisma.serviceOffering.update({
            where: { ServiceOfferingID: id },
            data: dataToUpdate,
            include: { Business: true, RequiredCardType: true },
        });
        return this.mapToResponseDto(updatedServiceOffering, currentUser.Role);
    }
    async remove(id, currentUser) {
        const serviceOffering = await this.prisma.serviceOffering.findUnique({
            where: { ServiceOfferingID: id },
            include: { Business: true, RequiredCardType: true },
        });
        if (!serviceOffering) {
            throw new common_1.NotFoundException(`Service Offering with ID ${id} not found.`);
        }
        if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID ||
                serviceOffering.BusinessID !== currentUser.BusinessID) {
                throw new common_1.ForbiddenException('You do not have permission to delete this service offering.');
            }
        }
        else if (currentUser.Role !== role_enum_1.Role.SuperAdmin) {
            throw new common_1.ForbiddenException('User role not permitted to delete this service offering.');
        }
        if (currentUser.Role !== role_enum_1.Role.SuperAdmin &&
            serviceOffering.BusinessID !== currentUser.BusinessID) {
            throw new common_1.ForbiddenException('You do not have permission to deactivate this service offering.');
        }
        const deactivatedServiceOffering = await this.prisma.serviceOffering.update({
            where: { ServiceOfferingID: id },
            data: { IsActive: false },
            include: { Business: true, RequiredCardType: true },
        });
        return this.mapToResponseDto(deactivatedServiceOffering, currentUser.Role);
    }
};
exports.ServiceOfferingsService = ServiceOfferingsService;
exports.ServiceOfferingsService = ServiceOfferingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceOfferingsService);
//# sourceMappingURL=service-offerings.service.js.map