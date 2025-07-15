"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const members_service_1 = require("./members.service");
const create_member_dto_1 = require("./dto/create-member.dto");
const update_member_dto_1 = require("./dto/update-member.dto");
const members_query_dto_1 = require("./dto/members-query.dto");
const member_response_dto_1 = require("./dto/member-response.dto");
const paginated_members_response_dto_1 = require("./dto/paginated-members-response.dto");
const file_upload_utils_1 = require("../utils/file-upload.utils");
const gender_enum_1 = require("./enums/gender.enum");
const member_system_type_enum_1 = require("./enums/member-system-type.enum");
let MembersController = class MembersController {
    membersService;
    constructor(membersService) {
        this.membersService = membersService;
    }
    create(createMemberDto, req, profileImage) {
        const appUrl = `${req.protocol}://${req.get('host')}`;
        return this.membersService.create(createMemberDto, req.user, appUrl, profileImage?.path);
    }
    findAll(queryDto, req) {
        return this.membersService.findAll(queryDto, req.user);
    }
    findOne(id, req) {
        return this.membersService.findOne(id, req.user);
    }
    findOneBySmartCardNumber(smartCardNumber, req) {
        return this.membersService.findOneBySmartCardNumber(smartCardNumber, req.user);
    }
    update(id, updateMemberDto, req, profileImage) {
        return this.membersService.update(id, updateMemberDto, req.user, profileImage?.path);
    }
    remove(id, req) {
        return this.membersService.remove(id, req.user);
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', file_upload_utils_1.memberImageUploadOptions)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Data for creating a new member, including an optional profile image.',
        schema: {
            type: 'object',
            properties: {
                profileImage: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional profile image file for the member.',
                    nullable: true,
                },
                memberType: { type: 'string', enum: Object.values(member_system_type_enum_1.MemberSystemType) },
                firstName: { type: 'string' },
                lastName: { type: 'string', nullable: true },
                mobileNumber: { type: 'string' },
                email: { type: 'string', format: 'email', nullable: true },
                gender: { type: 'string', enum: Object.values(gender_enum_1.Gender), nullable: true },
                address: { type: 'string', nullable: true },
                age: { type: 'integer', nullable: true },
                smartCardNumber: { type: 'string', nullable: true },
                cardTypeId: { type: 'integer', nullable: true },
                initialPoints: { type: 'number', nullable: true },
                businessId: { type: 'integer', nullable: true },
            },
            required: ['memberType', 'firstName', 'mobileNumber'],
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new member with an optional profile image',
        description: 'SuperAdmins must provide `businessId`. For BusinessAdmins, `businessId` is inferred from their token.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Member created successfully.',
        type: member_response_dto_1.MemberResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Member with this mobile number or smart card already exists.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_member_dto_1.CreateMemberDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'List all members with pagination and filters',
        description: 'BusinessAdmins will only see members for their own business. `businessName` is included in the response for SuperAdmins.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of members retrieved.',
        type: paginated_members_response_dto_1.PaginatedMembersResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [members_query_dto_1.MembersQueryDto, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific member by ID',
        description: 'BusinessAdmins can only retrieve members from their own business.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Member ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Member details retrieved.',
        type: member_response_dto_1.MemberResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Member not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('card/:smartCardNumber'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin, role_enum_1.Role.BusinessSubAdmin),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a specific member by Smart Card Number',
        description: 'Retrieves member details using their smart card number. BusinessAdmins and BusinessSubAdmins can only retrieve members from their own business.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'smartCardNumber',
        type: String,
        description: 'Member Smart Card Number',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Member details retrieved.',
        type: member_response_dto_1.MemberResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Member with this smart card number not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    __param(0, (0, common_1.Param)('smartCardNumber')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findOneBySmartCardNumber", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', file_upload_utils_1.memberImageUploadOptions)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Data for updating a member, including an optional new profile image.',
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
                    enum: Object.values(member_system_type_enum_1.MemberSystemType),
                    nullable: true,
                },
                firstName: { type: 'string', nullable: true },
                lastName: { type: 'string', nullable: true },
                mobileNumber: { type: 'string', nullable: true },
                email: { type: 'string', format: 'email', nullable: true },
                gender: { type: 'string', enum: Object.values(gender_enum_1.Gender), nullable: true },
                address: { type: 'string', nullable: true },
                age: { type: 'integer', nullable: true },
                smartCardNumber: { type: 'string', nullable: true },
                cardTypeId: { type: 'integer', nullable: true },
                isActive: { type: 'boolean', nullable: true },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a member with an optional profile image' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Member ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Member updated successfully.',
        type: member_response_dto_1.MemberResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Member not found.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Another member with the new mobile or smart card number already exists.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_member_dto_1.UpdateMemberDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin, role_enum_1.Role.BusinessAdmin),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate (soft delete) a member' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Member ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Member deactivated successfully.',
        type: member_response_dto_1.MemberResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Member not found.',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: 'Forbidden.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "remove", null);
exports.MembersController = MembersController = __decorate([
    (0, swagger_1.ApiTags)('Members'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('members'),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map