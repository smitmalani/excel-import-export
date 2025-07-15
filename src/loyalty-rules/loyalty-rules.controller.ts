import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LoyaltyRulesService } from './loyalty-rules.service';
import { CreateLoyaltyRuleDto } from './dto/create-loyalty-rule.dto';
import { UpdateLoyaltyRuleDto } from './dto/update-loyalty-rule.dto';
import { LoyaltyRuleResponseDto } from './dto/loyalty-rule-response.dto';
import { LoyaltyRulesQueryDto } from './dto/loyalty-rules-query.dto';
import { PaginatedLoyaltyRuleResponseDto } from './dto/paginated-loyalty-rule-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';

// Define AuthenticatedRequest interface for type safety on req.user
interface CurrentUserType {
  UserID: number;
  Role: Role;
  BusinessID?: number;
  Username: string;
  Email: string;
}

interface AuthenticatedRequest extends Request {
  user: CurrentUserType;
}

@ApiTags('Loyalty Rules')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loyalty-rules')
export class LoyaltyRulesController {
  constructor(private readonly loyaltyRulesService: LoyaltyRulesService) {}

  @Post()
  @Roles(Role.BusinessAdmin)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new loyalty rule for the business.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Loyalty rule created successfully.',
    type: LoyaltyRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Rule already exists for this service offering and type.',
  })
  async create(
    @Body() createLoyaltyRuleDto: CreateLoyaltyRuleDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LoyaltyRuleResponseDto> {
    return this.loyaltyRulesService.create(createLoyaltyRuleDto, req.user);
  }

  @Get()
  @Roles(Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Get all loyalty rules for the business (paginated).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of loyalty rules retrieved.',
    type: PaginatedLoyaltyRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized.',
  })
  async findAll(
    @Query() queryDto: LoyaltyRulesQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedLoyaltyRuleResponseDto> {
    return this.loyaltyRulesService.findAll(queryDto, req.user);
  }

  @Get(':id')
  @Roles(Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Get a specific loyalty rule by ID for the business.',
  })
  @ApiParam({ name: 'id', description: 'Loyalty Rule ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Loyalty rule details retrieved.',
    type: LoyaltyRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loyalty rule not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<LoyaltyRuleResponseDto> {
    return this.loyaltyRulesService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.BusinessAdmin)
  @ApiOperation({ summary: 'Update a loyalty rule by ID for the business.' })
  @ApiParam({ name: 'id', description: 'Loyalty Rule ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Loyalty rule updated successfully.',
    type: LoyaltyRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loyalty rule not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoyaltyRuleDto: UpdateLoyaltyRuleDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LoyaltyRuleResponseDto> {
    return this.loyaltyRulesService.update(id, updateLoyaltyRuleDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.BusinessAdmin)
  @HttpCode(HttpStatus.OK) // Or HttpStatus.NO_CONTENT if not returning body
  @ApiOperation({
    summary: 'Deactivate (soft delete) a loyalty rule by ID for the business.',
  })
  @ApiParam({ name: 'id', description: 'Loyalty Rule ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Loyalty rule deactivated successfully.',
    type: LoyaltyRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Loyalty rule not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<LoyaltyRuleResponseDto> {
    return this.loyaltyRulesService.remove(id, req.user);
  }
}
