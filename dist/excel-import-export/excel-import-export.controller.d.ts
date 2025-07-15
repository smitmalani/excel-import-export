import { ExcelImportExportService } from './excel-import-export.service';
import { Response } from 'express';
import { Role } from '@/auth/enums/role.enum';
interface AuthenticatedRequest extends Request {
    user: {
        UserID: number;
        Role: Role;
        BusinessID?: number | null;
        Username: string;
        Email: string;
    };
}
export declare class ExcelImportExportController {
    private excelImportExportService;
    constructor(excelImportExportService: ExcelImportExportService);
    exportExcel(req: AuthenticatedRequest, res: Response, body: {
        count: number;
    }): Promise<void>;
    importExcel(req: AuthenticatedRequest, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
    }>;
}
export {};
