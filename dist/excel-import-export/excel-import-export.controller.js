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
exports.ExcelImportExportController = void 0;
const common_1 = require("@nestjs/common");
const excel_import_export_service_1 = require("./excel-import-export.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const platform_express_1 = require("@nestjs/platform-express");
const ExcelJS = require("exceljs");
const file_upload_utils_1 = require("../utils/file-upload.utils");
let ExcelImportExportController = class ExcelImportExportController {
    excelImportExportService;
    constructor(excelImportExportService) {
        this.excelImportExportService = excelImportExportService;
    }
    async exportExcel(req, res, body) {
        const { count } = body;
        const { BusinessID } = req.user;
        return this.excelImportExportService.exportExcel(res, count, BusinessID);
    }
    async importExcel(req, file) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path);
        const worksheet = workbook.getWorksheet(1);
        return this.excelImportExportService.inportExcel(worksheet, req.user);
    }
};
exports.ExcelImportExportController = ExcelImportExportController;
__decorate([
    (0, common_1.Get)('export'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ExcelImportExportController.prototype, "exportExcel", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.BusinessAdmin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', file_upload_utils_1.excelFileUploadOption)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExcelImportExportController.prototype, "importExcel", null);
exports.ExcelImportExportController = ExcelImportExportController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('excel'),
    __metadata("design:paramtypes", [excel_import_export_service_1.ExcelImportExportService])
], ExcelImportExportController);
//# sourceMappingURL=excel-import-export.controller.js.map