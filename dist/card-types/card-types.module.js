"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardTypesModule = void 0;
const common_1 = require("@nestjs/common");
const card_types_service_1 = require("./card-types.service");
const card_types_controller_1 = require("./card-types.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
let CardTypesModule = class CardTypesModule {
};
exports.CardTypesModule = CardTypesModule;
exports.CardTypesModule = CardTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
        ],
        controllers: [card_types_controller_1.CardTypesController],
        providers: [card_types_service_1.CardTypesService],
        exports: [card_types_service_1.CardTypesService],
    })
], CardTypesModule);
//# sourceMappingURL=card-types.module.js.map