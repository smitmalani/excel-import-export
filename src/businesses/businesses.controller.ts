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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Business } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { businessLogoUploadOptions } from '../utils/file-upload.utils';

@ApiTags('Businesses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Roles(Role.SuperAdmin)
  @UseInterceptors(FileInterceptor('logo', businessLogoUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Data for creating a new business, including an optional logo.',
    schema: {
      type: 'object',
      required: [
        'businessName',
        'adminFullName',
        'adminEmail',
        'adminPassword',
      ],
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Optional logo file for the business.',
          nullable: true,
        },
        businessName: { type: 'string', example: 'Health Plus Clinic' },
        address: {
          type: 'string',
          example: '123 Wellness Ave, City, State',
          nullable: true,
        },
        phoneNumber: {
          type: 'string',
          example: '+14155552671',
          nullable: true,
        },
        adminFullName: { type: 'string', example: 'Jane Doe' },
        adminEmail: {
          type: 'string',
          format: 'email',
          example: 'jane.doe@healthplus.com',
        },
        adminPassword: {
          type: 'string',
          format: 'password',
          example: 'SecurePassword123',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Create a new business and its initial admin user',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiResponse({
    status: 201,
    description: 'The business has been successfully created.',
    // type: CreateBusinessDto, // This should be a response DTO, not the create DTO
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. User is not a SuperAdmin.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Business or admin email may already exist.',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() logo?: Express.Multer.File,
  ): Promise<Business> {
    return this.businessesService.create(createBusinessDto, logo?.path);
  }

  @Get()
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Get all active businesses',
    description:
      'Accessible only by SuperAdmins. Returns only active businesses.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active businesses.',
    type: [CreateBusinessDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async findAll(): Promise<Business[]> {
    return this.businessesService.findAll();
  }

  @Get('all')
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Get all businesses including inactive ones',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all businesses (active and inactive).',
    type: [CreateBusinessDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async findAllWithInactive(): Promise<Business[]> {
    return this.businessesService.findAllWithInactive();
  }

  @Get(':id')
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Get a specific business by ID',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Business ID' })
  @ApiResponse({
    status: 200,
    description: 'The business details.',
    type: CreateBusinessDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    return this.businessesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin)
  @UseInterceptors(FileInterceptor('logo', businessLogoUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Data for updating a business, including an optional new logo.',
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Optional new logo file for the business.',
          nullable: true,
        },
        businessName: {
          type: 'string',
          example: 'Health Plus Clinic Updated',
          nullable: true,
        },
        address: {
          type: 'string',
          example: '456 Wellness Rd, City, State',
          nullable: true,
        },
        phoneNumber: {
          type: 'string',
          example: '+14155552672',
          nullable: true,
        },
        isActive: { type: 'boolean', example: true, nullable: true },
      },
    },
  })
  @ApiOperation({
    summary: 'Update a business by ID',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Business ID' })
  @ApiResponse({
    status: 200,
    description: 'The business has been successfully updated.',
    // type: UpdateBusinessDto, // This should be a response DTO
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @UploadedFile() logo?: Express.Multer.File,
  ): Promise<Business> {
    return this.businessesService.update(id, updateBusinessDto, logo?.path);
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin)
  @ApiOperation({
    summary: 'Deactivate a business by ID (soft delete)',
    description: 'Accessible only by SuperAdmins.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Business ID' })
  @ApiResponse({
    status: 200,
    description: 'The business has been successfully deactivated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Business not found.' })
  @ApiResponse({ status: 409, description: 'Business is already inactive.' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Business> {
    return this.businessesService.remove(id);
  }
}
