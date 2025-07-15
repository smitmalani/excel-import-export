import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoyaltyRuleDto } from './dto/create-loyalty-rule.dto';
import { UpdateLoyaltyRuleDto } from './dto/update-loyalty-rule.dto';
import { LoyaltyRuleResponseDto } from './dto/loyalty-rule-response.dto';
import { LoyaltyRulesQueryDto } from './dto/loyalty-rules-query.dto';
import { PaginatedLoyaltyRuleResponseDto } from './dto/paginated-loyalty-rule-response.dto';
import { Role } from '../auth/enums/role.enum'; // Assuming Role enum is here
import { LoyaltyRuleType } from './enums/loyalty-rule-type.enum';
import { Prisma } from '../../generated/prisma'; // For Prisma types if needed directly

// Re-define or import CurrentUserType. For now, defining it here for clarity.
interface CurrentUserType {
  UserID: number;
  Role: Role;
  BusinessID?: number; // BusinessAdmins will have this
  Username: string;
  Email: string;
}

type PrismaLoyaltyRuleWithDetails = Prisma.LoyaltyRuleGetPayload<{
  include: {
    ServiceOffering: {
      include: {
        RequiredCardType: true;
      };
    };
  };
}>;

@Injectable()
export class LoyaltyRulesService {
  constructor(private prisma: PrismaService) {}

  private mapToResponseDto(
    rule: PrismaLoyaltyRuleWithDetails,
  ): LoyaltyRuleResponseDto {
    // Convert Decimal fields to numbers for the DTO
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
      ruleType: rule.RuleType as LoyaltyRuleType,
      earnPointPercentage: earnPointPercentage,
      pointsPerUnitCurrency: pointsPerUnitCurrency,
      description: rule.Description === null ? undefined : rule.Description,
      isActive: rule.IsActive,
      createdAt: rule.CreatedAt,
      updatedAt: rule.UpdatedAt,
    };
  }

  async create(
    createDto: CreateLoyaltyRuleDto,
    currentUser: CurrentUserType,
  ): Promise<LoyaltyRuleResponseDto> {
    if (currentUser.Role !== Role.BusinessAdmin || !currentUser.BusinessID) {
      throw new ForbiddenException(
        'Only Business Admins can create loyalty rules.',
      );
    }
    const businessId = currentUser.BusinessID;

    // Validate Service Offering
    const serviceOffering = await this.prisma.serviceOffering.findUnique({
      where: { ServiceOfferingID: createDto.serviceOfferingId },
      include: { RequiredCardType: true }, // For mapToResponseDto
    });

    if (
      !serviceOffering ||
      serviceOffering.BusinessID !== businessId ||
      !serviceOffering.IsActive
    ) {
      throw new NotFoundException(
        `Active Service Offering with ID ${createDto.serviceOfferingId} not found for your business.`,
      );
    }

    // Validate rule-type specific fields
    if (createDto.ruleType === LoyaltyRuleType.Earn) {
      if (createDto.pointsPerUnitCurrency !== undefined) {
        throw new BadRequestException(
          'pointsPerUnitCurrency should not be provided for an Earn rule.',
        );
      }
      if (createDto.earnPointPercentage === undefined) {
        throw new BadRequestException(
          'earnPointPercentage is required for an Earn rule.',
        );
      }
    } else if (createDto.ruleType === LoyaltyRuleType.Redeem) {
      if (createDto.earnPointPercentage !== undefined) {
        throw new BadRequestException(
          'earnPointPercentage should not be provided for a Redeem rule.',
        );
      }
      if (createDto.pointsPerUnitCurrency === undefined) {
        throw new BadRequestException(
          'pointsPerUnitCurrency is required for a Redeem rule.',
        );
      }
    }

    // Check for existing rule with the same ServiceOfferingID and RuleType
    const existingRule = await this.prisma.loyaltyRule.findUnique({
      where: {
        ServiceOfferingID_RuleType: {
          ServiceOfferingID: createDto.serviceOfferingId,
          RuleType: createDto.ruleType,
        },
      },
    });

    if (existingRule) {
      throw new ConflictException(
        `A ${createDto.ruleType} rule already exists for this service offering.`,
      );
    }

    const newLoyaltyRule = await this.prisma.loyaltyRule.create({
      data: {
        BusinessID: businessId,
        ServiceOfferingID: createDto.serviceOfferingId,
        RuleType: createDto.ruleType,
        EarnPointPercentage: createDto.earnPointPercentage, // Prisma handles Decimal conversion
        PointsPerUnitCurrency: createDto.pointsPerUnitCurrency, // Prisma handles Decimal conversion
        Description: createDto.description,
        IsActive: true, // Default to active
      },
      // Need to include relations for mapToResponseDto
      include: {
        ServiceOffering: {
          include: {
            RequiredCardType: true,
          },
        },
      },
    });

    // The created entity does not have ServiceOffering populated yet if we don't include it.
    // Let's re-fetch or ensure the include works as expected for mapToResponseDto.
    // The include in create should populate it.

    return this.mapToResponseDto(
      newLoyaltyRule as PrismaLoyaltyRuleWithDetails,
    );
  }

  async findAll(
    queryDto: LoyaltyRulesQueryDto,
    currentUser: CurrentUserType,
  ): Promise<PaginatedLoyaltyRuleResponseDto> {
    if (currentUser.Role !== Role.BusinessAdmin || !currentUser.BusinessID) {
      throw new ForbiddenException(
        'Only Business Admins can view loyalty rules.',
      );
    }
    const businessId = currentUser.BusinessID;

    const { page = 1, limit = 10, serviceOfferingId, ruleType } = queryDto;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.LoyaltyRuleWhereInput = {
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

    const responseDtos = rules.map((rule) =>
      this.mapToResponseDto(rule as PrismaLoyaltyRuleWithDetails),
    );

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

  async findOne(
    ruleId: number,
    currentUser: CurrentUserType,
  ): Promise<LoyaltyRuleResponseDto> {
    if (currentUser.Role !== Role.BusinessAdmin || !currentUser.BusinessID) {
      throw new ForbiddenException(
        'Only Business Admins can view loyalty rules.',
      );
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
      throw new NotFoundException(
        `Loyalty Rule with ID ${ruleId} not found for your business.`,
      );
    }

    return this.mapToResponseDto(rule as PrismaLoyaltyRuleWithDetails);
  }

  async update(
    ruleId: number,
    updateDto: UpdateLoyaltyRuleDto,
    currentUser: CurrentUserType,
  ): Promise<LoyaltyRuleResponseDto> {
    if (currentUser.Role !== Role.BusinessAdmin || !currentUser.BusinessID) {
      throw new ForbiddenException(
        'Only Business Admins can update loyalty rules.',
      );
    }
    const businessId = currentUser.BusinessID;

    const rule = await this.prisma.loyaltyRule.findUnique({
      where: { RuleID: ruleId },
    });

    if (!rule || rule.BusinessID !== businessId) {
      throw new NotFoundException(
        `Loyalty Rule with ID ${ruleId} not found for your business.`,
      );
    }

    // Validate rule-type specific field updates
    if (rule.RuleType === (LoyaltyRuleType.Earn as any)) {
      if (updateDto.pointsPerUnitCurrency !== undefined) {
        throw new BadRequestException(
          'pointsPerUnitCurrency cannot be updated for an Earn rule.',
        );
      }
    } else if (rule.RuleType === (LoyaltyRuleType.Redeem as any)) {
      if (updateDto.earnPointPercentage !== undefined) {
        throw new BadRequestException(
          'earnPointPercentage cannot be updated for a Redeem rule.',
        );
      }
    }

    // Prepare data for update
    const dataToUpdate: Prisma.LoyaltyRuleUpdateInput = {};
    if (updateDto.description !== undefined)
      dataToUpdate.Description = updateDto.description;
    if (updateDto.isActive !== undefined)
      dataToUpdate.IsActive = updateDto.isActive;
    if (
      updateDto.earnPointPercentage !== undefined &&
      rule.RuleType === LoyaltyRuleType.Earn
    ) {
      dataToUpdate.EarnPointPercentage = updateDto.earnPointPercentage;
    }
    if (
      updateDto.pointsPerUnitCurrency !== undefined &&
      rule.RuleType === LoyaltyRuleType.Redeem
    ) {
      dataToUpdate.PointsPerUnitCurrency = updateDto.pointsPerUnitCurrency;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      // If nothing to update, just return current state
      const currentRuleWithDetails = await this.prisma.loyaltyRule.findUnique({
        where: { RuleID: ruleId },
        include: { ServiceOffering: { include: { RequiredCardType: true } } },
      });
      return this.mapToResponseDto(
        currentRuleWithDetails as PrismaLoyaltyRuleWithDetails,
      );
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

    return this.mapToResponseDto(updatedRule as PrismaLoyaltyRuleWithDetails);
  }

  async remove(
    ruleId: number,
    currentUser: CurrentUserType,
  ): Promise<LoyaltyRuleResponseDto> {
    if (currentUser.Role !== Role.BusinessAdmin || !currentUser.BusinessID) {
      throw new ForbiddenException(
        'Only Business Admins can delete loyalty rules.',
      );
    }
    const businessId = currentUser.BusinessID;

    const rule = await this.prisma.loyaltyRule.findUnique({
      where: { RuleID: ruleId },
      include: {
        // Include for response mapping even if just deactivating
        ServiceOffering: {
          include: {
            RequiredCardType: true,
          },
        },
      },
    });

    if (!rule || rule.BusinessID !== businessId) {
      throw new NotFoundException(
        `Loyalty Rule with ID ${ruleId} not found for your business.`,
      );
    }

    if (!rule.IsActive) {
      // Already inactive
      return this.mapToResponseDto(rule as PrismaLoyaltyRuleWithDetails);
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

    return this.mapToResponseDto(
      deactivatedRule as PrismaLoyaltyRuleWithDetails,
    );
  }
}
