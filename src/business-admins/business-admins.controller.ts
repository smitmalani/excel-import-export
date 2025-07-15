import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { BusinessAdminsService } from './business-admins.service';
import { CreateBusinessAdminDto } from './dto/create-business-admin.dto';
import { UpdateBusinessAdminDto } from './dto/update-business-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BusinessAdminResponseDto } from './dto/business-admin-response.dto';
import { PaginatedBusinessAdminResponseDto } from './dto/paginated-business-admin-response.dto';

@ApiTags('Business Admins')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('business-admins')
export class BusinessAdminsController {
  constructor(private readonly businessAdminsService: BusinessAdminsService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Create a new business admin for a specific business',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiResponse({
    status: 201,
    description: 'The business admin has been successfully created.',
    type: BusinessAdminResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. User is not a SuperAdmin.',
  })
  @ApiResponse({
    status: 404,
    description: 'Business not found or not active.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict. Email or username may already exist for this business or globally.',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBusinessAdminDto: CreateBusinessAdminDto,
  ): Promise<BusinessAdminResponseDto> {
    return this.businessAdminsService.create(createBusinessAdminDto);
  }

  @Get()
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Get all business admins, optionally filtered by business ID',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination. Defaults to 1.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page. Defaults to 10.',
    example: 10,
  })
  @ApiQuery({
    name: 'businessId',
    required: false,
    type: Number,
    description: 'Filter admins by a specific Business ID.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of business admins with pagination.',
    type: PaginatedBusinessAdminResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('businessId', new ParseIntPipe({ optional: true }))
    businessId?: number,
  ): Promise<PaginatedBusinessAdminResponseDto> {
    return this.businessAdminsService.findAll(businessId, page, limit);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Get a specific business admin by User ID',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID of the business admin',
  })
  @ApiResponse({
    status: 200,
    description: 'The business admin details.',
    type: BusinessAdminResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Business admin not found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BusinessAdminResponseDto> {
    return this.businessAdminsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Update a business admin by User ID',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID of the business admin',
  })
  @ApiResponse({
    status: 200,
    description: 'The business admin has been successfully updated.',
    type: BusinessAdminResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Business admin not found.' })
  @ApiResponse({
    status: 409,
    description:
      'Conflict. Email may already be in use by another admin in this business.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessAdminDto: UpdateBusinessAdminDto,
  ): Promise<BusinessAdminResponseDto> {
    return this.businessAdminsService.update(id, updateBusinessAdminDto);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Deactivate a business admin by User ID (soft delete)',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID of the business admin',
  })
  @ApiResponse({
    status: 200,
    description: 'The business admin has been successfully deactivated.',
    type: BusinessAdminResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Business admin not found.' })
  @HttpCode(HttpStatus.OK) // Or 200 explicitly
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BusinessAdminResponseDto> {
    return this.businessAdminsService.remove(id);
  }
}
