import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { PointTransactionType } from "@generated/prisma";

export class QueryPointTransactionDto {
  @ApiPropertyOptional({
    description: "Page number for pagination.",
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of items per page.",
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      "Filter by the user (Sub-Admin/Admin) who processed the transaction.",
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({
    description: "Filter by member ID.",
    example: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  memberId?: number;

  @ApiPropertyOptional({
    description: "The start date for the filter range (YYYY-MM-DD).",
    example: "2024-05-01",
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: "The end date for the filter range (YYYY-MM-DD).",
    example: "2024-05-31",
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({
    description: "Filter by transaction type: 'Earn' or 'Redeem'.",
    enum: [PointTransactionType.Earn, PointTransactionType.Redeem],
  })
  @IsOptional()
  @IsEnum([PointTransactionType.Earn, PointTransactionType.Redeem])
  transactionType?: PointTransactionType;

  @ApiPropertyOptional({
    description: "Filter by Card Type ID.",
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cardTypeId?: number;

  @ApiPropertyOptional({
    description: "Filter by Service Offering ID.",
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  serviceOfferingId?: number;

  @ApiPropertyOptional({
    description: "Search by member name, mobile, or bill number.",
    example: "Ajay",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
