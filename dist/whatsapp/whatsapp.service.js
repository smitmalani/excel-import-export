"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let WhatsappService = class WhatsappService {
    configService;
    apiVersion;
    phoneNumberId;
    accessToken;
    apiUrl;
    constructor(configService) {
        this.configService = configService;
        const phoneNumberId = configService.get('WHATSAPP_BUSINESS_PHONE_NUMBER_ID');
        if (!phoneNumberId) {
            throw new common_1.InternalServerErrorException('WHATSAPP_BUSINESS_PHONE_NUMBER_ID is not configured.');
        }
        const accessToken = configService.get('WHATSAPP_ACCESS_TOKEN');
        if (!accessToken) {
            throw new common_1.InternalServerErrorException('WHATSAPP_ACCESS_TOKEN is not configured.');
        }
        this.apiVersion = this.configService.get('FACEBOOK_API_VERSION', 'v20.0');
        this.phoneNumberId = phoneNumberId;
        this.accessToken = accessToken;
        this.apiUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
    }
    async sendWelcomeMessage(to, memberName, smartCardImageUrl) {
        const payload = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: 'welcome_card_loyalty',
                language: {
                    code: 'en',
                },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'image',
                                image: {
                                    link: smartCardImageUrl,
                                },
                            },
                        ],
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                parameter_name: 'name',
                                text: memberName,
                            },
                        ],
                    },
                ],
            },
        };
        console.log('payload', JSON.stringify(payload), this.accessToken, this.apiUrl);
        try {
            const response = await axios_1.default.post(this.apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`WhatsApp welcome message sent to ${to}`, JSON.stringify(response.data));
        }
        catch (error) {
            console.error('Failed to send WhatsApp message via Facebook Graph API:', error.response?.data || error.message);
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map