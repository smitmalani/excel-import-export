import { ApiProperty } from '@nestjs/swagger';
import { BusinessAdminResponseDto } from './business-admin-response.dto';

export class PaginatedBusinessAdminResponseDto {
  @ApiProperty({
    type: [BusinessAdminResponseDto],
    description: 'List of business admin records for the current page.',
  })
  data: BusinessAdminResponseDto[];

  @ApiProperty({
    example: 10,
    description: 'Total number of items matching the query.',
  })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number.' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page.' })
  limit: number;

  @ApiProperty({ example: 1, description: 'Total number of pages.' })
  totalPages: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page.',
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if there is a previous page.',
  })
  hasPrevPage: boolean;
}
