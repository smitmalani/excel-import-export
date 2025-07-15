"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelFileUploadOption = exports.businessLogoUploadOptions = exports.memberImageUploadOptions = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs = require("fs");
const destinationPath = './public/uploads/members';
exports.memberImageUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            fs.mkdirSync(destinationPath, { recursive: true });
            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = (0, uuid_1.v4)();
            const extension = (0, path_1.extname)(file.originalname);
            cb(null, `${uniqueSuffix}${extension}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        }
        else {
            cb(new common_1.HttpException(`Unsupported file type ${(0, path_1.extname)(file.originalname)}`, common_1.HttpStatus.BAD_REQUEST), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
};
const businessLogoDestinationPath = './public/uploads/businesses';
const excelFileDestinationPath = './public/uploads/excel';
exports.businessLogoUploadOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            fs.mkdirSync(businessLogoDestinationPath, { recursive: true });
            cb(null, businessLogoDestinationPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = (0, uuid_1.v4)();
            const extension = (0, path_1.extname)(file.originalname);
            cb(null, `${uniqueSuffix}${extension}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
            cb(null, true);
        }
        else {
            cb(new common_1.HttpException(`Unsupported file type ${(0, path_1.extname)(file.originalname)}`, common_1.HttpStatus.BAD_REQUEST), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
};
exports.excelFileUploadOption = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            fs.mkdirSync(excelFileDestinationPath, { recursive: true });
            cb(null, excelFileDestinationPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = (0, uuid_1.v4)();
            const extension = (0, path_1.extname)(file.originalname);
            cb(null, `${uniqueSuffix}${extension}`);
        }
    })
};
//# sourceMappingURL=file-upload.utils.js.map