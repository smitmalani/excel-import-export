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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersQueryDto } from './dto/members-query.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { PaginatedMembersResponseDto } from './dto/paginated-members-response.dto';
import { memberImageUploadOptions } from '../utils/file-upload.utils';
import { Gender } from './enums/gender.enum';
import { MemberSystemType } from './enums/member-system-type.enum';

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

@ApiTags('Members')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @UseInterceptors(FileInterceptor('profileImage', memberImageUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Data for creating a new member, including an optional profile image.',
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
          description: 'Optional profile image file for the member.',
          nullable: true,
        },
        memberType: { type: 'string', enum: Object.values(MemberSystemType) },
        firstName: { type: 'string' },
        lastName: { type: 'string', nullable: true },
        mobileNumber: { type: 'string' },
        email: { type: 'string', format: 'email', nullable: true },
        gender: { type: 'string', enum: Object.values(Gender), nullable: true },
        address: { type: 'string', nullable: true },
        age: { type: 'integer', nullable: true },
        smartCardNumber: { type: 'string', nullable: true },
        cardTypeId: { type: 'integer', nullable: true },
        initialPoints: { type: 'number', nullable: true },
        businessId: { type: 'integer', nullable: true },
      },
      required: ['memberType', 'firstName', 'mobileNumber'],
    },
  })
  @ApiOperation({
    summary: 'Create a new member with an optional profile image',
    description:
      'SuperAdmins must provide `businessId`. For BusinessAdmins, `businessId` is inferred from their token.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Member created successfully.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Member with this mobile number or smart card already exists.',
  })
  create(
    @Body() createMemberDto: CreateMemberDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() profileImage?: Express.Multer.File,
  ): Promise<MemberResponseDto> {
    const appUrl = `${(req as any).protocol}://${(req as any).get('host')}`;
    return this.membersService.create(
      createMemberDto,
      req.user,
      appUrl,
      profileImage?.path,
    );
  }

  @Get()
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'List all members with pagination and filters',
    description:
      'BusinessAdmins will only see members for their own business. `businessName` is included in the response for SuperAdmins.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of members retrieved.',
    type: PaginatedMembersResponseDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findAll(
    @Query() queryDto: MembersQueryDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaginatedMembersResponseDto> {
    return this.membersService.findAll(queryDto, req.user);
  }

  @Get(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({
    summary: 'Get a specific member by ID',
    description:
      'BusinessAdmins can only retrieve members from their own business.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Member ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member details retrieved.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<MemberResponseDto> {
    return this.membersService.findOne(id, req.user);
  }

  @Get('card/:smartCardNumber')
  @Roles(Role.BusinessAdmin, Role.BusinessSubAdmin)
  @ApiOperation({
    summary: 'Get a specific member by Smart Card Number',
    description:
      'Retrieves member details using their smart card number. BusinessAdmins and BusinessSubAdmins can only retrieve members from their own business.',
  })
  @ApiParam({
    name: 'smartCardNumber',
    type: String,
    description: 'Member Smart Card Number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member details retrieved.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member with this smart card number not found.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  findOneBySmartCardNumber(
    @Param('smartCardNumber') smartCardNumber: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<MemberResponseDto> {
    return this.membersService.findOneBySmartCardNumber(
      smartCardNumber,
      req.user,
    );
  }

  @Patch(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @UseInterceptors(FileInterceptor('profileImage', memberImageUploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Data for updating a member, including an optional new profile image.',
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
          description: 'Optional new profile image file for the member.',
          nullable: true,
        },
        memberType: {
          type: 'string',
          enum: Object.values(MemberSystemType),
          nullable: true,
        },
        firstName: { type: 'string', nullable: true },
        lastName: { type: 'string', nullable: true },
        mobileNumber: { type: 'string', nullable: true },
        email: { type: 'string', format: 'email', nullable: true },
        gender: { type: 'string', enum: Object.values(Gender), nullable: true },
        address: { type: 'string', nullable: true },
        age: { type: 'integer', nullable: true },
        smartCardNumber: { type: 'string', nullable: true },
        cardTypeId: { type: 'integer', nullable: true },
        isActive: { type: 'boolean', nullable: true },
      },
    },
  })
  @ApiOperation({ summary: 'Update a member with an optional profile image' })
  @ApiParam({ name: 'id', type: Number, description: 'Member ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member updated successfully.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Another member with the new mobile or smart card number already exists.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: UpdateMemberDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFile() profileImage?: Express.Multer.File,
  ): Promise<MemberResponseDto> {
    return this.membersService.update(
      id,
      updateMemberDto,
      req.user,
      profileImage?.path,
    );
  }

  @Delete(':id')
  @Roles(Role.SuperAdmin, Role.BusinessAdmin)
  @ApiOperation({ summary: 'Deactivate (soft delete) a member' })
  @ApiParam({ name: 'id', type: Number, description: 'Member ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member deactivated successfully.',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member not found.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<MemberResponseDto> {
    return this.membersService.remove(id, req.user);
  }
}
