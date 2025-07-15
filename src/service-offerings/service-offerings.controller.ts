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
import { ServiceOfferingsService } from './service-offerings.service';
import { CreateServiceOfferingDto } from './dto/create-service-offering.dto';
import { UpdateServiceOfferingDto } from './dto/update-service-offering.dto';
import { ServiceOfferingsQueryDto } from './dto/service-offerings-query.dto';
import { ServiceOfferingResponseDto } from './dto/service-offering-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

// Define a more specific type for req.user if available from your auth setup
interface AuthenticatedRequest extends Request {
  user: {
    UserID: number;
    Role: Role;
    BusinessID?: number;
    Username: string;
    Email: string;
  };
}

@ApiTags('Service Offerings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('service-offerings')
export class ServiceOfferingsController {
  constructor(
    private readonly serviceOfferingsService: ServiceOfferingsService,
  ) {}

  @Post()
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Create a new service offering',
    description:
      'SuperAdmins must provide `businessId`. BusinessAdmins should omit `businessId` (it will be inferred from their token); if provided, it must match their own business.',
  })
  @ApiBody({ type: CreateServiceOfferingDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Service offering created successfully. `businessId` and `businessName` are only included in the response for SuperAdmins.',
    type: ServiceOfferingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input data (e.g., missing businessId for SuperAdmin, or mismatched businessId for BusinessAdmin).',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not permitted to perform this action.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Service offering with this name and card type already exists for the business.',
  })
  async create(
    @Body() createServiceOfferingDto: CreateServiceOfferingDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ServiceOfferingResponseDto> {
    return this.serviceOfferingsService.create(
      createServiceOfferingDto,
      req.user,
    );
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'List all service offerings with pagination and filters',
    description:
      'BusinessAdmins will only see offerings for their own business. `businessId` and `businessName` are only included in the response items for SuperAdmins.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page.',
  })
  @ApiQuery({
    name: 'businessId',
    required: false,
    type: Number,
    description:
      'Filter by Business ID (Only applicable for SuperAdmins). Ignored for BusinessAdmins.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for service name.',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status (true or false).',
  })
  @ApiQuery({
    name: 'cardTypeId',
    required: false,
    type: Number,
    description: 'Filter by CardType ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of service offerings retrieved.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ServiceOfferingResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not permitted to perform this action.',
  })
  async findAll(
    @Query() queryDto: ServiceOfferingsQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{
    data: ServiceOfferingResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    // If isActive is not explicitly provided in the query, default to true (only active services)
    if (queryDto.isActive === undefined) {
      queryDto.isActive = true;
    }
    return this.serviceOfferingsService.findAll(queryDto, req.user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Get a specific service offering by ID',
    description:
      'BusinessAdmins can only retrieve offerings for their own business. `businessId` and `businessName` are only included in the response for SuperAdmins.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Service Offering ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service offering details retrieved.',
    type: ServiceOfferingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service offering not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      "User not permitted to perform this action (e.g., BusinessAdmin trying to access another business's offering).",
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<ServiceOfferingResponseDto> {
    return this.serviceOfferingsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Update a service offering',
    description:
      'BusinessAdmins can only update offerings for their own business. `businessId` and `businessName` are only included in the response for SuperAdmins.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Service Offering ID' })
  @ApiBody({ type: UpdateServiceOfferingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service offering updated successfully.',
    type: ServiceOfferingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service offering not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not permitted to perform this action.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Another service offering with this name and card type already exists.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceOfferingDto: UpdateServiceOfferingDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ServiceOfferingResponseDto> {
    return this.serviceOfferingsService.update(
      id,
      updateServiceOfferingDto,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Deactivate (soft delete) a service offering',
    description:
      'BusinessAdmins can only deactivate offerings for their own business. `businessId` and `businessName` are only included in the response for SuperAdmins.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Service Offering ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service offering deactivated successfully.',
    type: ServiceOfferingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service offering not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not permitted to perform this action.',
  })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<ServiceOfferingResponseDto> {
    return this.serviceOfferingsService.remove(id, req.user);
  }
}
