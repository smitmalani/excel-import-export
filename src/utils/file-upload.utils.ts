import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Request } from 'express';

// Define the destination path
const destinationPath = './public/uploads/members';

type Cb = (error: Error | null, acceptFile: boolean) => void;
type DestinationCb = (error: Error | null, destination: string) => void;
type FileNameCb = (error: Error | null, filename: string) => void;

export const memberImageUploadOptions = {
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCb,
    ) => {
      // Ensure the directory exists
      fs.mkdirSync(destinationPath, { recursive: true });
      cb(null, destinationPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCb) => {
      const uniqueSuffix = uuidv4();
      const extension = extname(file.originalname);
      cb(null, `${uniqueSuffix}${extension}`);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: Cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
};

const businessLogoDestinationPath = './public/uploads/businesses';
const excelFileDestinationPath = './public/uploads/excel'

export const businessLogoUploadOptions = {
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCb,
    ) => {
      fs.mkdirSync(businessLogoDestinationPath, { recursive: true });
      cb(null, businessLogoDestinationPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCb) => {
      const uniqueSuffix = uuidv4();
      const extension = extname(file.originalname);
      cb(null, `${uniqueSuffix}${extension}`);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: Cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
};

export const excelFileUploadOption = {
  storage: diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCb
    )=>{
      fs.mkdirSync(excelFileDestinationPath, {recursive: true})
      cb(null, excelFileDestinationPath)
    },
    filename:(req:Request, file: Express.Multer.File, cb:FileNameCb)=>{
      const uniqueSuffix = uuidv4();
      const extension = extname(file.originalname)
      cb(null, `${uniqueSuffix}${extension}`)
    }
  })
}
