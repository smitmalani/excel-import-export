import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsInt,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  ValidateIf,
} from 'class-validator';
import { MemberSystemType } from '../enums/member-system-type.enum';
import { Gender } from '../enums/gender.enum';

export class CreateMemberDto {
  @ApiProperty({
    description: 'Type of the member',
    enum: MemberSystemType,
    example: MemberSystemType.Standard,
  })
  @IsEnum(MemberSystemType)
  @IsNotEmpty()
  memberType: MemberSystemType;

  @ApiProperty({ description: "Member's first name", example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiPropertyOptional({ description: "Member's last name", example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({
    description: "Member's mobile number (must be unique within the business)",
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  mobileNumber: string;

  @ApiPropertyOptional({
    description: "Member's email address",
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    description: "Member's gender",
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: "Member's address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Member's age" })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }: { value: string | undefined }) =>
    value ? parseInt(value, 10) : undefined,
  )
  age?: number;

  @ApiPropertyOptional({
    description:
      "Member's smart card number (must be unique within the business if provided)",
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  smartCardNumber?: string;

  @ApiPropertyOptional({
    description:
      'ID of the card type held by the member. Must belong to the same business.',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: string | undefined }) =>
    value ? parseInt(value, 10) : undefined,
  )
  cardTypeId?: number;

  @ApiPropertyOptional({
    description:
      'Initial loyalty points to be awarded to the member upon creation.',
    example: 100,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }: { value: string | undefined }) =>
    value ? parseFloat(value) : undefined,
  )
  initialPoints?: number;

  @ApiPropertyOptional({
    description:
      'The ID of the business this member belongs to. Required for SuperAdmins, ignored for BusinessAdmins.',
  })
  @ValidateIf((o: CreateMemberDto) => o.businessId !== undefined) // Validate only if provided
  @IsInt()
  @Transform(({ value }: { value: string | undefined }) =>
    value ? parseInt(value, 10) : undefined,
  )
  businessId?: number;
}
