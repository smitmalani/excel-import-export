import { Request } from 'express';
type Cb = (error: Error | null, acceptFile: boolean) => void;
export declare const memberImageUploadOptions: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, cb: Cb) => void;
    limits: {
        fileSize: number;
    };
};
export declare const businessLogoUploadOptions: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, cb: Cb) => void;
    limits: {
        fileSize: number;
    };
};
export declare const excelFileUploadOption: {
    storage: import("multer").StorageEngine;
};
export {};
