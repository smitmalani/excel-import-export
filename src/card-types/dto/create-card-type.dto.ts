import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCardTypeDto {
  @ApiProperty({
    description:
      'The ID of the business this card type belongs to. Required for SuperAdmins.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  businessId: number;

  @ApiProperty({
    description: 'The name of the card type.',
    example: 'Gold Tier',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cardName: string;

  @ApiProperty({
    description: 'Optional description for the card type.',
    example: 'Grants access to exclusive lounge and discounts.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
