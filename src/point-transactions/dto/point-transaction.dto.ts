import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { PointTransactionType } from "@generated/prisma";

export class PointTransactionDto {
  @ApiProperty({
    description: "The ID of the member for this transaction.",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty({
    description:
      "The type of transaction: 'Earn' for adding points, 'Redeem' for spending them.",
    enum: [PointTransactionType.Earn, PointTransactionType.Redeem],
    example: PointTransactionType.Earn,
  })
  @IsEnum([PointTransactionType.Earn, PointTransactionType.Redeem])
  @IsNotEmpty()
  transactionType: PointTransactionType;

  @ApiProperty({
    description: "The total amount of the bill or transaction.",
    example: 1500.5,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: "The ID of the service offering being availed.",
    example: 4,
  })
  @IsInt()
  @IsNotEmpty()
  serviceOfferingId: number;

  @ApiPropertyOptional({
    description: "An optional title for the transaction.",
    example: "Annual Checkup",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: "An optional description for the transaction.",
    example: "Regular annual health checkup.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "The bill or invoice number associated with the transaction.",
    example: "INV-2024-9876",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billNumber?: string;

  @ApiPropertyOptional({
    description:
      "For Redeem transactions only. The number of points the member wishes to redeem.",
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  pointsToRedeem?: number;
}
