import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly apiVersion: string;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    const phoneNumberId = configService.get<string>(
      'WHATSAPP_BUSINESS_PHONE_NUMBER_ID',
    );
    if (!phoneNumberId) {
      throw new InternalServerErrorException(
        'WHATSAPP_BUSINESS_PHONE_NUMBER_ID is not configured.',
      );
    }

    const accessToken = configService.get<string>('WHATSAPP_ACCESS_TOKEN');
    if (!accessToken) {
      throw new InternalServerErrorException(
        'WHATSAPP_ACCESS_TOKEN is not configured.',
      );
    }

    this.apiVersion = this.configService.get<string>(
      'FACEBOOK_API_VERSION',
      'v20.0',
    );
    this.phoneNumberId = phoneNumberId;
    this.accessToken = accessToken;
    this.apiUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  async sendWelcomeMessage(
    to: string,
    memberName: string,
    smartCardImageUrl: string,
  ): Promise<void> {
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
    console.log(
      'payload',
      JSON.stringify(payload),
      this.accessToken,
      this.apiUrl,
    );
    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(
        `WhatsApp welcome message sent to ${to}`,
        JSON.stringify(response.data),
      );
    } catch (error) {
      console.error(
        'Failed to send WhatsApp message via Facebook Graph API:',
        error.response?.data || error.message,
      );
      // Depending on requirements, you might want to throw an exception
      // or handle this failure more gracefully.
    }
  }
}
