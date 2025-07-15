import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CardTypesService } from './card-types.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { FindAllCardTypesQueryDto } from './dto/find-all-card-types-query.dto';
import { CardTypeResponseDto } from './dto/card-type-response.dto';
import { PaginatedCardTypeResponseDto } from './dto/paginated-card-type-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

// Define a minimal structure for the authenticated user object available on the request
interface AuthenticatedRequest extends Request {
  user: {
    UserID: number;
    Role: Role;
    BusinessID?: number | null;
    Username: string;
    Email: string;
  };
}

@ApiTags('Card Types')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('card-types')
export class CardTypesController {
  constructor(private readonly cardTypesService: CardTypesService) {}

  @Post()
  @Roles(Role.SuperAdmin) // Only SuperAdmins can create
  @ApiOperation({ summary: 'Create a new card type (SuperAdmin only).' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Card type created successfully.',
    type: CardTypeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Card type with this name already exists for the business.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Business not found.',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCardTypeDto: CreateCardTypeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CardTypeResponseDto> {
    return this.cardTypesService.create(createCardTypeDto, req.user);
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.BusinessAdmin) // Both can fetch, but service handles filtering
  @ApiOperation({
    summary:
      'Get all card types (paginated). SuperAdmins can filter by businessId; BusinessAdmins see their own.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of card types retrieved.',
    type: PaginatedCardTypeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async findAll(
    @Query() queryDto: FindAllCardTypesQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedCardTypeResponseDto> {
    return this.cardTypesService.findAll(queryDto, req.user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin) // Both can attempt to fetch, service verifies ownership for BusinessAdmin
  @ApiOperation({
    summary:
      'Get a specific card type by ID. BusinessAdmins can only access their own.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Card Type ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card type details.',
    type: CardTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card type not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      "Forbidden (if BusinessAdmin tries to access other business's card type).",
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<CardTypeResponseDto> {
    return this.cardTypesService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin) // Only SuperAdmins can update
  @ApiOperation({ summary: 'Update a card type (SuperAdmin only).' })
  @ApiParam({ name: 'id', type: 'number', description: 'Card Type ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card type updated successfully.',
    type: CardTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card type not found.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Card type with this name already exists for the business.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardTypeDto: UpdateCardTypeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CardTypeResponseDto> {
    return this.cardTypesService.update(id, updateCardTypeDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin) // Only SuperAdmins can delete
  @ApiOperation({
    summary:
      'Delete a card type (SuperAdmin only). Note: This is a hard delete and may cascade.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Card Type ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card type deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card type not found.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Cannot delete card type due to existing references not handled by cascade rules.',
  })
  @HttpCode(HttpStatus.OK) // Or 204 No Content, but returning a message is also common
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    return this.cardTypesService.remove(id, req.user);
  }
}
