import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessSubAdminsService } from './business-sub-admins.service';
import { CreateBusinessSubAdminDto } from './dto/create-business-sub-admin.dto';
import { UpdateBusinessSubAdminDto } from './dto/update-business-sub-admin.dto';
import { BusinessSubAdminsQueryDto } from './dto/business-sub-admins-query.dto';
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
} from '@nestjs/swagger';

// Define a type for the authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    UserID: number;
    Role: Role;
    BusinessID?: number;
  };
}

@ApiTags('Business Sub-Admins')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('business-sub-admins')
export class BusinessSubAdminsController {
  constructor(
    private readonly businessSubAdminsService: BusinessSubAdminsService,
  ) {}

  @Post()
  @Roles(Role.BusinessAdmin)
  @ApiOperation({ summary: 'Create a new business sub-admin' })
  @ApiResponse({
    status: 201,
    description: 'The sub-admin has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBusinessSubAdminDto: CreateBusinessSubAdminDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.businessSubAdminsService.create(
      createBusinessSubAdminDto,
      req.user,
    );
  }

  @Get()
  @Roles(Role.BusinessAdmin)
  @ApiOperation({ summary: 'Get all sub-admins for the current business' })
  findAll(
    @Query() queryDto: BusinessSubAdminsQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.businessSubAdminsService.findAll(queryDto, req.user);
  }

  @Get(':id')
  @Roles(Role.BusinessAdmin)
  @ApiOperation({ summary: 'Get a specific sub-admin by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the sub-admin to retrieve' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.businessSubAdminsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.BusinessAdmin)
  @ApiOperation({ summary: 'Update a sub-admin' })
  @ApiParam({ name: 'id', description: 'The ID of the sub-admin to update' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessSubAdminDto: UpdateBusinessSubAdminDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.businessSubAdminsService.update(
      id,
      updateBusinessSubAdminDto,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(Role.BusinessAdmin)
  @ApiOperation({ summary: 'Deactivate a sub-admin' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the sub-admin to deactivate',
  })
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.businessSubAdminsService.remove(id, req.user);
  }
}
