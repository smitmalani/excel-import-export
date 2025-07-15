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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_auth_dto_1 = require("./dto/login-auth.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
class UserResponse {
    id;
    username;
    email;
    role;
    fullName;
    businessId;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], UserResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'superadmin' }),
    __metadata("design:type", String)
], UserResponse.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'superadmin@example.com' }),
    __metadata("design:type", String)
], UserResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SuperAdmin' }),
    __metadata("design:type", String)
], UserResponse.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Super Admin User', nullable: true }),
    __metadata("design:type", String)
], UserResponse.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: null, nullable: true }),
    __metadata("design:type", Number)
], UserResponse.prototype, "businessId", void 0);
class LoginSuccessResponse {
    access_token;
    user;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    __metadata("design:type", String)
], LoginSuccessResponse.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserResponse }),
    __metadata("design:type", UserResponse)
], LoginSuccessResponse.prototype, "user", void 0);
class MessageResponse {
    message;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Operation successful' }),
    __metadata("design:type", String)
], MessageResponse.prototype, "message", void 0);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    getProfile(req) {
        const userFromJwt = req.user;
        return {
            id: userFromJwt.UserID,
            username: userFromJwt.Username,
            email: userFromJwt.Email,
            role: userFromJwt.Role,
            fullName: userFromJwt.FullName,
            businessId: userFromJwt.BusinessID,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Log in a user',
        description: 'Authenticates a user and returns a JWT access token along with user details.',
    }),
    (0, swagger_1.ApiBody)({ type: login_auth_dto_1.LoginAuthDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully logged in.',
        type: LoginSuccessResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Invalid credentials or user inactive.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request. Input validation failed.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_auth_dto_1.LoginAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Initiate password reset',
        description: "Sends a password reset link to the user's email address if the account exists and is active.",
    }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'If an account with this email exists and is active, a password reset link has been sent.',
        type: MessageResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request. Input validation failed.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset user password',
        description: "Resets the user's password using a valid token received via email.",
    }),
    (0, swagger_1.ApiBody)({ type: reset_password_dto_1.ResetPasswordDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password has been successfully reset.',
        type: MessageResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request. Invalid or expired token, or input validation failed.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user profile (Protected)',
        description: 'Returns the profile of the currently authenticated user. Requires JWT token.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully.',
        type: UserResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token missing or invalid.',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map