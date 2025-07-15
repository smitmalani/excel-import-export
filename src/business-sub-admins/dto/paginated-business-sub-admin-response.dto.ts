import { ApiProperty } from '@nestjs/swagger';
import { BusinessSubAdminResponseDto } from './business-sub-admin-response.dto';

export class PaginatedBusinessSubAdminResponseDto {
  @ApiProperty({ type: [BusinessSubAdminResponseDto] })
  data: BusinessSubAdminResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPrevPage: boolean;
}
