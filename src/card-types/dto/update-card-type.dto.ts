import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

// We don't include businessId here as card types cannot be moved between businesses.
// CreateCardTypeDto had businessId as required for SuperAdmins to initially assign it.
export class UpdateCardTypeDto {
  @ApiProperty({
    description: 'The new name of the card type.',
    example: 'Platinum Tier',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cardName?: string;

  @ApiProperty({
    description: 'Optional new description for the card type.',
    example: 'Includes all Gold Tier benefits plus personal concierge.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
