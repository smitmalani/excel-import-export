import { ConfigService } from '@nestjs/config';
export declare class WhatsappService {
    private configService;
    private readonly apiVersion;
    private readonly phoneNumberId;
    private readonly accessToken;
    private readonly apiUrl;
    constructor(configService: ConfigService);
    sendWelcomeMessage(to: string, memberName: string, smartCardImageUrl: string): Promise<void>;
}
