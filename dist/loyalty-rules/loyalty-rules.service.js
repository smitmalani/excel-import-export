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
exports.LoyaltyRulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../auth/enums/role.enum");
const loyalty_rule_type_enum_1 = require("./enums/loyalty-rule-type.enum");
let LoyaltyRulesService = class LoyaltyRulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToResponseDto(rule) {
        const earnPointPercentage = rule.EarnPointPercentage
            ? parseFloat(rule.EarnPointPercentage.toString())
            : undefined;
        const pointsPerUnitCurrency = rule.PointsPerUnitCurrency
            ? parseFloat(rule.PointsPerUnitCurrency.toString())
            : undefined;
        return {
            ruleId: rule.RuleID,
            serviceOfferingId: rule.ServiceOfferingID,
            serviceOfferingName: rule.ServiceOffering.ServiceName,
            cardTypeName: rule.ServiceOffering.RequiredCardType.CardName,
            ruleType: rule.RuleType,
            earnPointPercentage: earnPointPercentage,
            pointsPerUnitCurrency: pointsPerUnitCurrency,
            description: rule.Description === null ? undefined : rule.Description,
            isActive: rule.IsActive,
            createdAt: rule.CreatedAt,
            updatedAt: rule.UpdatedAt,
        };
    }
    async create(createDto, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.BusinessAdmin || !currentUser.BusinessID) {
            throw new common_1.ForbiddenException('Only Business Admins can create loyalty rules.');
        }
        const businessId = currentUser.BusinessID;
        const serviceOffering = await this.prisma.serviceOffering.findUnique({
            where: { ServiceOfferingID: createDto.serviceOfferingId },
            include: { RequiredCardType: true },
        });
        if (!serviceOffering ||
            serviceOffering.BusinessID !== businessId ||
            !serviceOffering.IsActive) {
            throw new common_1.NotFoundException(`Active Service Offering with ID ${createDto.serviceOfferingId} not found for your business.`);
        }
        if (createDto.ruleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Earn) {
            if (createDto.pointsPerUnitCurrency !== undefined) {
                throw new common_1.BadRequestException('pointsPerUnitCurrency should not be provided for an Earn rule.');
            }
            if (createDto.earnPointPercentage === undefined) {
                throw new common_1.BadRequestException('earnPointPercentage is required for an Earn rule.');
            }
        }
        else if (createDto.ruleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Redeem) {
            if (createDto.earnPointPercentage !== undefined) {
                throw new common_1.BadRequestException('earnPointPercentage should not be provided for a Redeem rule.');
            }
            if (createDto.pointsPerUnitCurrency === undefined) {
                throw new common_1.BadRequestException('pointsPerUnitCurrency is required for a Redeem rule.');
            }
        }
        const existingRule = await this.prisma.loyaltyRule.findUnique({
            where: {
                ServiceOfferingID_RuleType: {
                    ServiceOfferingID: createDto.serviceOfferingId,
                    RuleType: createDto.ruleType,
                },
            },
        });
        if (existingRule) {
            throw new common_1.ConflictException(`A ${createDto.ruleType} rule already exists for this service offering.`);
        }
        const newLoyaltyRule = await this.prisma.loyaltyRule.create({
            data: {
                BusinessID: businessId,
                ServiceOfferingID: createDto.serviceOfferingId,
                RuleType: createDto.ruleType,
                EarnPointPercentage: createDto.earnPointPercentage,
                PointsPerUnitCurrency: createDto.pointsPerUnitCurrency,
                Description: createDto.description,
                IsActive: true,
            },
            include: {
                ServiceOffering: {
                    include: {
                        RequiredCardType: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(newLoyaltyRule);
    }
    async findAll(queryDto, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.BusinessAdmin || !currentUser.BusinessID) {
            throw new common_1.ForbiddenException('Only Business Admins can view loyalty rules.');
        }
        const businessId = currentUser.BusinessID;
        const { page = 1, limit = 10, serviceOfferingId, ruleType } = queryDto;
        const skip = (page - 1) * limit;
        const whereClause = {
            BusinessID: businessId,
        };
        if (serviceOfferingId) {
            whereClause.ServiceOfferingID = serviceOfferingId;
        }
        if (ruleType) {
            whereClause.RuleType = ruleType;
        }
        const [rules, total] = await this.prisma.$transaction([
            this.prisma.loyaltyRule.findMany({
                where: whereClause,
                include: {
                    ServiceOffering: {
                        include: {
                            RequiredCardType: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { RuleID: 'desc' },
            }),
            this.prisma.loyaltyRule.count({ where: whereClause }),
        ]);
        const responseDtos = rules.map((rule) => this.mapToResponseDto(rule));
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
    async findOne(ruleId, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.BusinessAdmin || !currentUser.BusinessID) {
            throw new common_1.ForbiddenException('Only Business Admins can view loyalty rules.');
        }
        const businessId = currentUser.BusinessID;
        const rule = await this.prisma.loyaltyRule.findUnique({
            where: { RuleID: ruleId },
            include: {
                ServiceOffering: {
                    include: {
                        RequiredCardType: true,
                    },
                },
            },
        });
        if (!rule || rule.BusinessID !== businessId) {
            throw new common_1.NotFoundException(`Loyalty Rule with ID ${ruleId} not found for your business.`);
        }
        return this.mapToResponseDto(rule);
    }
    async update(ruleId, updateDto, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.BusinessAdmin || !currentUser.BusinessID) {
            throw new common_1.ForbiddenException('Only Business Admins can update loyalty rules.');
        }
        const businessId = currentUser.BusinessID;
        const rule = await this.prisma.loyaltyRule.findUnique({
            where: { RuleID: ruleId },
        });
        if (!rule || rule.BusinessID !== businessId) {
            throw new common_1.NotFoundException(`Loyalty Rule with ID ${ruleId} not found for your business.`);
        }
        if (rule.RuleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Earn) {
            if (updateDto.pointsPerUnitCurrency !== undefined) {
                throw new common_1.BadRequestException('pointsPerUnitCurrency cannot be updated for an Earn rule.');
            }
        }
        else if (rule.RuleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Redeem) {
            if (updateDto.earnPointPercentage !== undefined) {
                throw new common_1.BadRequestException('earnPointPercentage cannot be updated for a Redeem rule.');
            }
        }
        const dataToUpdate = {};
        if (updateDto.description !== undefined)
            dataToUpdate.Description = updateDto.description;
        if (updateDto.isActive !== undefined)
            dataToUpdate.IsActive = updateDto.isActive;
        if (updateDto.earnPointPercentage !== undefined &&
            rule.RuleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Earn) {
            dataToUpdate.EarnPointPercentage = updateDto.earnPointPercentage;
        }
        if (updateDto.pointsPerUnitCurrency !== undefined &&
            rule.RuleType === loyalty_rule_type_enum_1.LoyaltyRuleType.Redeem) {
            dataToUpdate.PointsPerUnitCurrency = updateDto.pointsPerUnitCurrency;
        }
        if (Object.keys(dataToUpdate).length === 0) {
            const currentRuleWithDetails = await this.prisma.loyaltyRule.findUnique({
                where: { RuleID: ruleId },
                include: { ServiceOffering: { include: { RequiredCardType: true } } },
            });
            return this.mapToResponseDto(currentRuleWithDetails);
        }
        const updatedRule = await this.prisma.loyaltyRule.update({
            where: { RuleID: ruleId },
            data: dataToUpdate,
            include: {
                ServiceOffering: {
                    include: {
                        RequiredCardType: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(updatedRule);
    }
    async remove(ruleId, currentUser) {
        if (currentUser.Role !== role_enum_1.Role.BusinessAdmin || !currentUser.BusinessID) {
            throw new common_1.ForbiddenException('Only Business Admins can delete loyalty rules.');
        }
        const businessId = currentUser.BusinessID;
        const rule = await this.prisma.loyaltyRule.findUnique({
            where: { RuleID: ruleId },
            include: {
                ServiceOffering: {
                    include: {
                        RequiredCardType: true,
                    },
                },
            },
        });
        if (!rule || rule.BusinessID !== businessId) {
            throw new common_1.NotFoundException(`Loyalty Rule with ID ${ruleId} not found for your business.`);
        }
        if (!rule.IsActive) {
            return this.mapToResponseDto(rule);
        }
        const deactivatedRule = await this.prisma.loyaltyRule.update({
            where: { RuleID: ruleId },
            data: { IsActive: false },
            include: {
                ServiceOffering: {
                    include: {
                        RequiredCardType: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(deactivatedRule);
    }
};
exports.LoyaltyRulesService = LoyaltyRulesService;
exports.LoyaltyRulesService = LoyaltyRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoyaltyRulesService);
//# sourceMappingURL=loyalty-rules.service.js.map