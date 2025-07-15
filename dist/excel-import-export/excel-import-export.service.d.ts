import { PrismaService } from '@/prisma/prisma.service';
import { Response } from 'express';
export declare class ExcelImportExportService {
    private prisma;
    constructor(prisma: PrismaService);
    exportExcel(res: Response, count: number, businessId: any): Promise<void>;
    inportExcel(worksheet: any, currentUser: any): Promise<{
        statusCode: number;
        message: string;
    }>;
}
