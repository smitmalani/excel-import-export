import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../enums/gender.enum';
import { MemberSystemType } from '../enums/member-system-type.enum';

export class MemberResponseDto {
  @ApiProperty({ description: "The member's unique identifier." })
  memberID: number;

  @ApiProperty({ description: 'The ID of the business the member belongs to.' })
  businessID: number;

  @ApiPropertyOptional({
    description:
      "The name of the business (included for SuperAdmins' context).",
  })
  businessName?: string;

  @ApiProperty({
    description: 'The classification of the member.',
    enum: MemberSystemType,
  })
  memberType: MemberSystemType;

  @ApiProperty({ description: "The member's first name." })
  firstName: string;

  @ApiPropertyOptional({ description: "The member's last name." })
  lastName: string | null;

  @ApiProperty({ description: "The member's mobile number." })
  mobileNumber: string;

  @ApiPropertyOptional({ description: "The member's email address." })
  email: string | null;

  @ApiPropertyOptional({
    description: "The member's gender.",
    enum: Gender,
  })
  gender: Gender | null;

  @ApiPropertyOptional({ description: "The member's physical address." })
  address: string | null;

  @ApiPropertyOptional({ description: "The member's age." })
  age: number | null;

  @ApiPropertyOptional({
    description: "URL of the member's profile picture.",
  })
  profileImageURL: string | null;

  @ApiPropertyOptional({
    description: "The member's unique smart card number.",
  })
  smartCardNumber: string | null;

  @ApiPropertyOptional({
    description: 'The ID of the loyalty card type held by the member.',
  })
  cardTypeID: number | null;

  @ApiPropertyOptional({
    description: 'The name of the loyalty card type held by the member.',
  })
  cardTypeName?: string;

  @ApiPropertyOptional({
    description: 'URL of the generated loyalty card image.',
  })
  loyaltyCardUrl: string | null;

  @ApiProperty({
    description: "The member's current loyalty points balance.",
    type: 'number',
    format: 'double',
  })
  currentLoyaltyPoints: number;

  @ApiProperty({ description: 'Whether the member account is active.' })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'The ID of the user who registered this member.',
  })
  registeredByUserID: number | null;

  @ApiProperty({ description: 'The timestamp when the member was created.' })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the member was last updated.',
  })
  updatedAt: Date;
}
