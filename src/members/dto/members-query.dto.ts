import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { MemberSystemType } from '../enums/member-system-type.enum';

export class MembersQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Filter by Business ID (Only applicable for SuperAdmins). Ignored for BusinessAdmins.',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  businessId?: number;

  @ApiPropertyOptional({
    description: 'Search term for member name, email, or mobile number.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status (true or false). Defaults to true.',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: string | boolean }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by CardType ID.',
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  cardTypeId?: number;

  @ApiPropertyOptional({
    description: 'Filter by Member Type.',
    enum: MemberSystemType,
  })
  @IsOptional()
  @IsEnum(MemberSystemType)
  memberType?: MemberSystemType;
}
