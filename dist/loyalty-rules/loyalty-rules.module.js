"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyRulesModule = void 0;
const common_1 = require("@nestjs/common");
const loyalty_rules_service_1 = require("./loyalty-rules.service");
const loyalty_rules_controller_1 = require("./loyalty-rules.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
let LoyaltyRulesModule = class LoyaltyRulesModule {
};
exports.LoyaltyRulesModule = LoyaltyRulesModule;
exports.LoyaltyRulesModule = LoyaltyRulesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        controllers: [loyalty_rules_controller_1.LoyaltyRulesController],
        providers: [loyalty_rules_service_1.LoyaltyRulesService],
    })
], LoyaltyRulesModule);
//# sourceMappingURL=loyalty-rules.module.js.map