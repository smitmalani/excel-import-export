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
exports.CardTypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../auth/enums/role.enum");
const prisma_1 = require("../../generated/prisma");
let CardTypesService = class CardTypesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToResponseDto(cardType, currentUserRole) {
        const response = {
            CardTypeID: cardType.CardTypeID,
            BusinessID: cardType.BusinessID,
            CardName: cardType.CardName,
            Description: cardType.Description,
        };
        if (currentUserRole === role_enum_1.Role.SuperAdmin && cardType.Business) {
            response.BusinessName = cardType.Business.BusinessName;
        }
        return response;
    }
    async create(createDto, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.SuperAdmin) {
            throw new common_1.ForbiddenException('Only SuperAdmins can create card types.');
        }
        if (!createDto.businessId) {
            throw new common_1.ForbiddenException('Business ID is required for SuperAdmins to create a card type.');
        }
        const business = await this.prisma.business.findUnique({
            where: { BusinessID: createDto.businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${createDto.businessId} not found.`);
        }
        try {
            const newCardType = await this.prisma.cardType.create({
                data: {
                    BusinessID: createDto.businessId,
                    CardName: createDto.cardName,
                    Description: createDto.description,
                },
                include: { Business: true },
            });
            return this.mapToResponseDto(newCardType, currentUser.Role);
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException(`A card type with the name "${createDto.cardName}" already exists for this business.`);
            }
            throw error;
        }
    }
    async findAll(queryDto, currentUser) {
        const { page = 1, limit = 10, businessId: queryBusinessId, search, } = queryDto;
        const skip = (page - 1) * limit;
        let effectiveBusinessId = undefined;
        if (currentUser.Role === role_enum_1.Role.SuperAdmin) {
            effectiveBusinessId = queryBusinessId;
        }
        else if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID) {
                throw new common_1.ForbiddenException('BusinessAdmin does not have an associated BusinessID.');
            }
            effectiveBusinessId = currentUser.BusinessID;
        }
        else {
            throw new common_1.ForbiddenException('You do not have permission to access this resource.');
        }
        const whereClause = {};
        if (effectiveBusinessId !== undefined) {
            whereClause.BusinessID = effectiveBusinessId;
        }
        if (search) {
            whereClause.CardName = {
                contains: search,
            };
        }
        const [cardTypes, total] = await this.prisma.$transaction([
            this.prisma.cardType.findMany({
                where: whereClause,
                include: {
                    Business: currentUser.Role === role_enum_1.Role.SuperAdmin,
                },
                skip: skip,
                take: limit,
                orderBy: {
                    CardName: 'asc',
                },
            }),
            this.prisma.cardType.count({ where: whereClause }),
        ]);
        const responseDtos = cardTypes.map((ct) => this.mapToResponseDto(ct, currentUser.Role));
        const totalPages = Math.ceil(total / limit);
        return {
            data: responseDtos,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
    async findOne(id, currentUser) {
        const cardType = await this.prisma.cardType.findUnique({
            where: { CardTypeID: id },
            include: {
                Business: currentUser.Role === role_enum_1.Role.SuperAdmin,
            },
        });
        if (!cardType) {
            throw new common_1.NotFoundException(`Card Type with ID ${id} not found.`);
        }
        if (currentUser.Role === role_enum_1.Role.BusinessAdmin) {
            if (!currentUser.BusinessID ||
                cardType.BusinessID !== currentUser.BusinessID) {
                throw new common_1.ForbiddenException('You do not have permission to access this card type.');
            }
        }
        return this.mapToResponseDto(cardType, currentUser.Role);
    }
    async update(id, updateDto, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.SuperAdmin) {
            throw new common_1.ForbiddenException('Only SuperAdmins can update card types.');
        }
        const existingCardType = await this.prisma.cardType.findUnique({
            where: { CardTypeID: id },
        });
        if (!existingCardType) {
            throw new common_1.NotFoundException(`Card Type with ID ${id} not found.`);
        }
        try {
            const updatedCardType = await this.prisma.cardType.update({
                where: { CardTypeID: id },
                data: {
                    CardName: updateDto.cardName,
                    Description: updateDto.description,
                },
                include: { Business: true },
            });
            return this.mapToResponseDto(updatedCardType, currentUser.Role);
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException(`A card type with the name "${updateDto.cardName}" already exists for Business ID ${existingCardType.BusinessID}.`);
            }
            throw error;
        }
    }
    async remove(id, currentUser) {
        await this.findOne(id, currentUser);
        try {
            await this.prisma.cardType.delete({
                where: { CardTypeID: id },
            });
            return { message: `Card Type with ID ${id} deleted successfully.` };
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2003') {
                throw new common_1.ConflictException('Cannot delete this card type as it is currently associated with members or service offerings.');
            }
            throw error;
        }
    }
};
exports.CardTypesService = CardTypesService;
exports.CardTypesService = CardTypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CardTypesService);
//# sourceMappingURL=card-types.service.js.map