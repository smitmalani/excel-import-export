import { ApiProperty } from '@nestjs/swagger';

export class CardTypeResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the card type.',
    example: 1,
  })
  CardTypeID: number;

  @ApiProperty({
    description: 'The ID of the business this card type belongs to.',
    example: 1,
  })
  BusinessID: number;

  @ApiProperty({
    description:
      'The name of the business this card type belongs to (populated for SuperAdmins).',
    example: 'Global Corp Inc.',
    required: false,
  })
  BusinessName?: string; // Populated for SuperAdmin context

  @ApiProperty({
    description: 'The name of the card type.',
    example: 'Gold Tier',
  })
  CardName: string;

  @ApiProperty({
    description: 'Optional description for the card type.',
    example: 'Grants access to exclusive lounge and discounts.',
    required: false,
  })
  Description?: string | null; // Prisma can return null for optional Text fields
}
