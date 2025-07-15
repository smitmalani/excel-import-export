import { Module } from "@nestjs/common";
import { ExcelImportExportController } from "./excel-import-export.controller";
import { ExcelImportExportService } from "./excel-import-export.service";

@Module({
    controllers: [ExcelImportExportController],
    providers: [ExcelImportExportService]
})

export class ExcelImportExportModule{}