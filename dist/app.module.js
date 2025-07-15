"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const businesses_module_1 = require("./businesses/businesses.module");
const business_admins_module_1 = require("./business-admins/business-admins.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const service_offerings_module_1 = require("./service-offerings/service-offerings.module");
const card_types_module_1 = require("./card-types/card-types.module");
const loyalty_rules_module_1 = require("./loyalty-rules/loyalty-rules.module");
const members_module_1 = require("./members/members.module");
const business_sub_admins_module_1 = require("./business-sub-admins/business-sub-admins.module");
const point_transactions_module_1 = require("./point-transactions/point-transactions.module");
const excel_import_export_module_1 = require("./excel-import-export/excel-import-export.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            businesses_module_1.BusinessesModule,
            business_admins_module_1.BusinessAdminsModule,
            dashboard_module_1.DashboardModule,
            service_offerings_module_1.ServiceOfferingsModule,
            card_types_module_1.CardTypesModule,
            loyalty_rules_module_1.LoyaltyRulesModule,
            members_module_1.MembersModule,
            business_sub_admins_module_1.BusinessSubAdminsModule,
            point_transactions_module_1.PointTransactionsModule,
            excel_import_export_module_1.ExcelImportExportModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map