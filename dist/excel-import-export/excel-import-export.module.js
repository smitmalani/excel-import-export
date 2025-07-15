"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelImportExportModule = void 0;
const common_1 = require("@nestjs/common");
const excel_import_export_controller_1 = require("./excel-import-export.controller");
const excel_import_export_service_1 = require("./excel-import-export.service");
let ExcelImportExportModule = class ExcelImportExportModule {
};
exports.ExcelImportExportModule = ExcelImportExportModule;
exports.ExcelImportExportModule = ExcelImportExportModule = __decorate([
    (0, common_1.Module)({
        controllers: [excel_import_export_controller_1.ExcelImportExportController],
        providers: [excel_import_export_service_1.ExcelImportExportService]
    })
], ExcelImportExportModule);
//# sourceMappingURL=excel-import-export.module.js.map