import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { FindAllCardTypesQueryDto } from './dto/find-all-card-types-query.dto';
import { CardTypeResponseDto } from './dto/card-type-response.dto';
import { PaginatedCardTypeResponseDto } from './dto/paginated-card-type-response.dto';
import { Role } from '../auth/enums/role.enum';
import {
  Business as PrismaBusiness,
  CardType as PrismaCardType,
  Prisma,
} from '../../generated/prisma'; // Corrected path

// Define a more specific type for the authenticated user context if not already globally defined
// This aligns with CurrentUserType from service-offerings.service.ts in backend_src_overview.yml
interface AuthenticatedUser {
  UserID: number;
  Role: Role;
  BusinessID?: number | null; // Making it explicitly nullable based on Prisma schema
  Username: string;
  Email: string;
}

// Type for Prisma CardType with optional Business relation for including BusinessName
type PrismaCardTypeWithBusiness = PrismaCardType & {
  Business?: PrismaBusiness | null;
};

@Injectable()
export class CardTypesService {
  constructor(private prisma: PrismaService) {}

  private mapToResponseDto(
    cardType: PrismaCardTypeWithBusiness,
    currentUserRole?: Role,
  ): CardTypeResponseDto {
    const response: CardTypeResponseDto = {
      CardTypeID: cardType.CardTypeID,
      BusinessID: cardType.BusinessID,
      CardName: cardType.CardName,
      Description: cardType.Description,
    };
    // Only include BusinessName for SuperAdmins
    if (currentUserRole === Role.SuperAdmin && cardType.Business) {
      response.BusinessName = cardType.Business.BusinessName;
    }
    return response;
  }

  async create(
    createDto: CreateCardTypeDto,
    currentUser: AuthenticatedUser,
  ): Promise<CardTypeResponseDto> {
    if (currentUser.Role !== Role.SuperAdmin) {
      throw new ForbiddenException('Only SuperAdmins can create card types.');
    }

    // SuperAdmin must provide businessId
    if (!createDto.businessId) {
      throw new ForbiddenException(
        'Business ID is required for SuperAdmins to create a card type.',
      );
    }

    // Check if the business exists
    const business = await this.prisma.business.findUnique({
      where: { BusinessID: createDto.businessId },
    });
    if (!business) {
      throw new NotFoundException(
        `Business with ID ${createDto.businessId} not found.`,
      );
    }

    try {
      const newCardType = await this.prisma.cardType.create({
        data: {
          BusinessID: createDto.businessId,
          CardName: createDto.cardName,
          Description: createDto.description,
        },
        include: { Business: true }, // Include business for the response DTO mapping
      });
      return this.mapToResponseDto(newCardType, currentUser.Role);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Unique constraint violation (BusinessID, CardName)
        throw new ConflictException(
          `A card type with the name "${createDto.cardName}" already exists for this business.`,
        );
      }
      throw error;
    }
  }

  async findAll(
    queryDto: FindAllCardTypesQueryDto,
    currentUser: AuthenticatedUser,
  ): Promise<PaginatedCardTypeResponseDto> {
    const {
      page = 1,
      limit = 10,
      businessId: queryBusinessId,
      search,
    } = queryDto;
    const skip = (page - 1) * limit;

    let effectiveBusinessId: number | undefined = undefined;

    if (currentUser.Role === Role.SuperAdmin) {
      effectiveBusinessId = queryBusinessId;
    } else if (currentUser.Role === Role.BusinessAdmin) {
      if (!currentUser.BusinessID) {
        throw new ForbiddenException(
          'BusinessAdmin does not have an associated BusinessID.',
        );
      }
      // BusinessAdmin can only see their own card types, queryBusinessId is ignored.
      effectiveBusinessId = currentUser.BusinessID;
    } else {
      // Other roles (e.g., BusinessSubAdmin) cannot access this list, or define specific logic if needed.
      // For now, restricting to SuperAdmin and BusinessAdmin.
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    const whereClause: Prisma.CardTypeWhereInput = {};
    if (effectiveBusinessId !== undefined) {
      whereClause.BusinessID = effectiveBusinessId;
    }
    if (search) {
      whereClause.CardName = {
        contains: search,
        // mode: 'insensitive', // Uncomment if using PostgreSQL for case-insensitive search
      };
    }

    const [cardTypes, total] = await this.prisma.$transaction([
      this.prisma.cardType.findMany({
        where: whereClause,
        include: {
          Business: currentUser.Role === Role.SuperAdmin, // Only include Business for SuperAdmins
        },
        skip: skip,
        take: limit,
        orderBy: {
          CardName: 'asc',
        },
      }),
      this.prisma.cardType.count({ where: whereClause }),
    ]);

    const responseDtos = cardTypes.map((ct) =>
      this.mapToResponseDto(ct as PrismaCardTypeWithBusiness, currentUser.Role),
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
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<CardTypeResponseDto> {
    const cardType = await this.prisma.cardType.findUnique({
      where: { CardTypeID: id },
      include: {
        Business: currentUser.Role === Role.SuperAdmin, // Include business for SuperAdmin context
      },
    });

    if (!cardType) {
      throw new NotFoundException(`Card Type with ID ${id} not found.`);
    }

    if (currentUser.Role === Role.BusinessAdmin) {
      if (
        !currentUser.BusinessID ||
        cardType.BusinessID !== currentUser.BusinessID
      ) {
        throw new ForbiddenException(
          'You do not have permission to access this card type.',
        );
      }
    }
    // SuperAdmin can access any card type, no further check needed here for them.

    return this.mapToResponseDto(
      cardType as PrismaCardTypeWithBusiness,
      currentUser.Role,
    );
  }

  async update(
    id: number,
    updateDto: UpdateCardTypeDto,
    currentUser: AuthenticatedUser,
  ): Promise<CardTypeResponseDto> {
    if (currentUser.Role !== Role.SuperAdmin) {
      throw new ForbiddenException('Only SuperAdmins can update card types.');
    }

    const existingCardType = await this.prisma.cardType.findUnique({
      where: { CardTypeID: id },
    });

    if (!existingCardType) {
      throw new NotFoundException(`Card Type with ID ${id} not found.`);
    }

    // SuperAdmins can update any card type, no businessId check against currentUser here.

    try {
      const updatedCardType = await this.prisma.cardType.update({
        where: { CardTypeID: id },
        data: {
          CardName: updateDto.cardName,
          Description: updateDto.description,
        },
        include: { Business: true }, // For response DTO mapping for SuperAdmin
      });
      return this.mapToResponseDto(updatedCardType, currentUser.Role);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Unique constraint violation
        throw new ConflictException(
          `A card type with the name "${updateDto.cardName}" already exists for Business ID ${existingCardType.BusinessID}.`,
        );
      }
      throw error;
    }
  }

  async remove(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<{ message: string }> {
    await this.findOne(id, currentUser); // This already performs necessary checks

    try {
      await this.prisma.cardType.delete({
        where: { CardTypeID: id },
      });
      return { message: `Card Type with ID ${id} deleted successfully.` };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        // Foreign key constraint failure
        throw new ConflictException(
          'Cannot delete this card type as it is currently associated with members or service offerings.',
        );
      }
      throw error;
    }
  }
}
