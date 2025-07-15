import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsEnum,
  MinLength,
  MaxLength,
  IsBoolean,
  Min,
} from 'class-validator';
import { MemberSystemType } from '../enums/member-system-type.enum';
import { Gender } from '../enums/gender.enum';

export class UpdateMemberDto {
  @ApiPropertyOptional({
    description: 'Type of the member',
    enum: MemberSystemType,
  })
  @IsOptional()
  @IsEnum(MemberSystemType)
  memberType?: MemberSystemType;

  @ApiPropertyOptional({ description: "Member's first name", example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ description: "Member's last name", example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    description: "Member's mobile number",
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobileNumber?: string;

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

  @ApiPropertyOptional({ description: 'URL to profile image' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  profileImageURL?: string;

  @ApiPropertyOptional({ description: "Member's smart card number" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  smartCardNumber?: string;

  @ApiPropertyOptional({
    description: 'Set member as active or inactive.',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: string | undefined | boolean }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  isActive?: boolean;
}
