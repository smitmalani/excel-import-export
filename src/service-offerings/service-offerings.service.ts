import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceOfferingDto } from './dto/create-service-offering.dto';
import { UpdateServiceOfferingDto } from './dto/update-service-offering.dto';
import { ServiceOfferingResponseDto } from './dto/service-offering-response.dto';
import { ServiceOfferingsQueryDto } from './dto/service-offerings-query.dto';
import { Role } from '../auth/enums/role.enum';
import {
  Prisma,
  ServiceOffering,
  Business,
  CardType,
} from '../../generated/prisma';

// Define a more specific type for currentUser if available, or use a general one
// For now, assuming req.user will have at least Role and BusinessID (if applicable)
interface CurrentUserType {
  UserID: number;
  Role: Role;
  BusinessID?: number;
  Username: string;
  Email: string;
}

@Injectable()
export class ServiceOfferingsService {
  constructor(private prisma: PrismaService) {}

  private mapToResponseDto(
    serviceOffering: ServiceOffering & {
      Business?: Business | null;
      RequiredCardType?: CardType | null;
    },
    currentUserRole: Role,
  ): ServiceOfferingResponseDto {
    const response: Partial<ServiceOfferingResponseDto> = {
      serviceOfferingID: serviceOffering.ServiceOfferingID,
      serviceName: serviceOffering.ServiceName,
      cardTypeId: serviceOffering.CardTypeID,
      cardTypeName: serviceOffering.RequiredCardType?.CardName,
      description: serviceOffering.Description,
      isActive: serviceOffering.IsActive,
    };

    if (currentUserRole === Role.SuperAdmin) {
      response.businessId = serviceOffering.BusinessID;
      response.businessName = serviceOffering.Business?.BusinessName;
    }
    // For BusinessAdmin, businessId and businessName are intentionally omitted from the response object

    return response as ServiceOfferingResponseDto; // Cast to full DTO, assuming conditional logic is sound
  }

  async create(
    createDto: CreateServiceOfferingDto,
    currentUser: CurrentUserType,
  ): Promise<ServiceOfferingResponseDto> {
    let businessIdToUse: number;

    if (currentUser.Role === Role.SuperAdmin) {
      if (!createDto.businessId) {
        throw new BadRequestException(
          'businessId is required for SuperAdmins when creating a service offering.',
        );
      }
      const business = await this.prisma.business.findUnique({
        where: { BusinessID: createDto.businessId },
      });
      if (!business) {
        throw new NotFoundException(
          `Business with ID ${createDto.businessId} not found.`,
        );
      }
      businessIdToUse = createDto.businessId;
    } else if (currentUser.Role === Role.BusinessAdmin) {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException(
          'BusinessAdmin must be associated with a business.',
        );
      }
      if (
        createDto.businessId &&
        createDto.businessId !== currentUser.BusinessID
      ) {
        throw new ForbiddenException(
          'BusinessAdmins cannot specify a businessId different from their own. The businessId field should be omitted.',
        );
      }
      // BusinessAdmins should not send businessId; it's inferred.
      // @ts-ignore
      if (
        'businessId' in createDto &&
        createDto.businessId !== undefined &&
        createDto.businessId !== null
      ) {
        // If they somehow send it, and it's not their own, it's an error.
        // If it IS their own, it's redundant but acceptable by the logic below if we didn't check explicitly.
        // Best to guide them not to send it.
        // However, the DTO allows it as optional to cater to SuperAdmin. Strict check for BusinessAdmin:
        if (createDto.businessId !== currentUser.BusinessID) {
          throw new BadRequestException(
            'BusinessAdmins should not provide businessId; it is inferred. If provided, it must match your business.',
          );
        }
      }
      businessIdToUse = currentUser.BusinessID;
    } else {
      throw new ForbiddenException(
        'User role not permitted to create service offerings.',
      );
    }

    const cardType = await this.prisma.cardType.findUnique({
      where: { CardTypeID: createDto.cardTypeId },
    });
    if (!cardType || cardType.BusinessID !== businessIdToUse) {
      throw new BadRequestException(
        `CardType with ID ${createDto.cardTypeId} not found or does not belong to Business ID ${businessIdToUse}.`,
      );
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
      throw new ConflictException(
        'A service offering with this name and card type already exists for this business.',
      );
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

  async findAll(
    queryDto: ServiceOfferingsQueryDto,
    currentUser: CurrentUserType,
  ): Promise<{
    data: ServiceOfferingResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, isActive, cardTypeId } = queryDto;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ServiceOfferingWhereInput = {};

    if (currentUser.Role === Role.BusinessAdmin) {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException(
          'BusinessAdmin is not associated with any business.',
        );
      }
      whereClause.BusinessID = currentUser.BusinessID;
      // BusinessId from queryDto is ignored for BusinessAdmins as per requirement
    } else if (currentUser.Role === Role.SuperAdmin) {
      if (queryDto.businessId) {
        // Use businessId from queryDto if provided by SuperAdmin
        whereClause.BusinessID = queryDto.businessId;
      }
    } else {
      throw new ForbiddenException(
        'User role not permitted to view service offerings.',
      );
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

    const responseDtos = serviceOfferings.map((so) =>
      this.mapToResponseDto(so, currentUser.Role),
    );
    return { data: responseDtos, total, page, limit };
  }

  async findOne(
    id: number,
    currentUser: CurrentUserType,
  ): Promise<ServiceOfferingResponseDto> {
    const serviceOffering = await this.prisma.serviceOffering.findUnique({
      where: { ServiceOfferingID: id },
      include: { Business: true, RequiredCardType: true },
    });

    if (!serviceOffering) {
      throw new NotFoundException(`Service Offering with ID ${id} not found.`);
    }

    if (currentUser.Role === Role.BusinessAdmin) {
      if (
        !currentUser.BusinessID ||
        serviceOffering.BusinessID !== currentUser.BusinessID
      ) {
        throw new ForbiddenException(
          'You do not have permission to access this service offering.',
        );
      }
    } else if (currentUser.Role !== Role.SuperAdmin) {
      throw new ForbiddenException(
        'User role not permitted to view this service offering.',
      );
    }

    return this.mapToResponseDto(serviceOffering, currentUser.Role);
  }

  async update(
    id: number,
    updateDto: UpdateServiceOfferingDto,
    currentUser: CurrentUserType,
  ): Promise<ServiceOfferingResponseDto> {
    const serviceOffering = await this.prisma.serviceOffering.findUnique({
      where: { ServiceOfferingID: id },
    });

    if (!serviceOffering) {
      throw new NotFoundException(`Service Offering with ID ${id} not found.`);
    }

    let businessIdToScope: number;
    if (currentUser.Role === Role.BusinessAdmin) {
      if (
        !currentUser.BusinessID ||
        serviceOffering.BusinessID !== currentUser.BusinessID
      ) {
        throw new ForbiddenException(
          'You do not have permission to update this service offering.',
        );
      }
      businessIdToScope = currentUser.BusinessID;
    } else if (currentUser.Role === Role.SuperAdmin) {
      businessIdToScope = serviceOffering.BusinessID;
    } else {
      throw new ForbiddenException(
        'User role not permitted to update service offerings.',
      );
    }

    // BusinessAdmins cannot change the businessId implicitly. SuperAdmins operate on existing businessId.
    // No businessId field in UpdateServiceOfferingDto, so no direct change possible, which is good.

    if (
      updateDto.cardTypeId &&
      updateDto.cardTypeId !== serviceOffering.CardTypeID
    ) {
      const cardType = await this.prisma.cardType.findUnique({
        where: { CardTypeID: updateDto.cardTypeId },
      });
      if (!cardType || cardType.BusinessID !== businessIdToScope) {
        throw new BadRequestException(
          `CardType with ID ${updateDto.cardTypeId} not found or does not belong to Business ID ${businessIdToScope}.`,
        );
      }
    }

    const newServiceName = updateDto.serviceName ?? serviceOffering.ServiceName;
    const newCardTypeId = updateDto.cardTypeId ?? serviceOffering.CardTypeID;

    if (
      (updateDto.serviceName !== undefined ||
        updateDto.cardTypeId !== undefined) &&
      (newServiceName !== serviceOffering.ServiceName ||
        newCardTypeId !== serviceOffering.CardTypeID)
    ) {
      const existing = await this.prisma.serviceOffering.findFirst({
        where: {
          BusinessID: businessIdToScope,
          ServiceName: newServiceName,
          CardTypeID: newCardTypeId,
          ServiceOfferingID: { not: id },
        },
      });
      if (existing) {
        throw new ConflictException(
          'Another service offering with this name and card type already exists for this business.',
        );
      }
    }

    const dataToUpdate: Prisma.ServiceOfferingUpdateInput = {};
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
      const currentFullServiceOffering =
        await this.prisma.serviceOffering.findUnique({
          where: { ServiceOfferingID: id },
          include: { Business: true, RequiredCardType: true },
        });
      return this.mapToResponseDto(
        currentFullServiceOffering!,
        currentUser.Role,
      );
    }

    const updatedServiceOffering = await this.prisma.serviceOffering.update({
      where: { ServiceOfferingID: id },
      data: dataToUpdate,
      include: { Business: true, RequiredCardType: true },
    });

    return this.mapToResponseDto(updatedServiceOffering, currentUser.Role);
  }

  async remove(
    id: number,
    currentUser: CurrentUserType,
  ): Promise<ServiceOfferingResponseDto> {
    const serviceOffering = await this.prisma.serviceOffering.findUnique({
      where: { ServiceOfferingID: id },
      include: { Business: true, RequiredCardType: true },
    });

    if (!serviceOffering) {
      throw new NotFoundException(`Service Offering with ID ${id} not found.`);
    }

    if (currentUser.Role === Role.BusinessAdmin) {
      if (
        !currentUser.BusinessID ||
        serviceOffering.BusinessID !== currentUser.BusinessID
      ) {
        throw new ForbiddenException(
          'You do not have permission to delete this service offering.',
        );
      }
    } else if (currentUser.Role !== Role.SuperAdmin) {
      throw new ForbiddenException(
        'User role not permitted to delete this service offering.',
      );
    }

    if (
      currentUser.Role !== Role.SuperAdmin &&
      serviceOffering.BusinessID !== currentUser.BusinessID
    ) {
      throw new ForbiddenException(
        'You do not have permission to deactivate this service offering.',
      );
    }

    const deactivatedServiceOffering = await this.prisma.serviceOffering.update(
      {
        where: { ServiceOfferingID: id },
        data: { IsActive: false },
        include: { Business: true, RequiredCardType: true },
      },
    );

    return this.mapToResponseDto(deactivatedServiceOffering, currentUser.Role);
  }
}
