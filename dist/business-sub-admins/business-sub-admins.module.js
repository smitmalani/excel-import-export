"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessSubAdminsModule = void 0;
const common_1 = require("@nestjs/common");
const business_sub_admins_service_1 = require("./business-sub-admins.service");
const business_sub_admins_controller_1 = require("./business-sub-admins.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const mail_module_1 = require("../mail/mail.module");
let BusinessSubAdminsModule = class BusinessSubAdminsModule {
};
exports.BusinessSubAdminsModule = BusinessSubAdminsModule;
exports.BusinessSubAdminsModule = BusinessSubAdminsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, users_module_1.UsersModule, auth_module_1.AuthModule, mail_module_1.MailModule],
        controllers: [business_sub_admins_controller_1.BusinessSubAdminsController],
        providers: [business_sub_admins_service_1.BusinessSubAdminsService],
    })
], BusinessSubAdminsModule);
//# sourceMappingURL=business-sub-admins.module.js.map