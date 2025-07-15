import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExcelImportExportService } from './excel-import-export.service';
import { Response } from 'express';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as ExcelJS from 'exceljs';
import { excelFileUploadOption } from '@/utils/file-upload.utils';

interface AuthenticatedRequest extends Request {
  user: {
    UserID: number;
    Role: Role;
    BusinessID?: number | null;
    Username: string;
    Email: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('excel')
export class ExcelImportExportController {
  constructor(private excelImportExportService: ExcelImportExportService) {}

  @Get('export')
  @Roles(Role.BusinessAdmin)
  async exportExcel(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: { count: number },
  ) {
    const { count } = body;
    const { BusinessID } = req.user;
    return this.excelImportExportService.exportExcel(res, count, BusinessID);
  }

  @Post('import')
  @Roles(Role.BusinessAdmin)
  @UseInterceptors(FileInterceptor('file', excelFileUploadOption))
  async importExcel(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file.path);
    const worksheet = workbook.getWorksheet(1);

    return this.excelImportExportService.inportExcel(worksheet, req.user);
  }
}
