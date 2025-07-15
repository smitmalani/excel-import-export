import { ApiProperty } from '@nestjs/swagger';
import { LoyaltyRuleResponseDto } from './loyalty-rule-response.dto';

export class PaginatedLoyaltyRuleResponseDto {
  @ApiProperty({
    type: [LoyaltyRuleResponseDto],
    description: 'List of loyalty rules for the current page.',
  })
  data: LoyaltyRuleResponseDto[];

  @ApiProperty({
    description: 'Total number of loyalty rules matching the query.',
  })
  total: number;

  @ApiProperty({ description: 'Current page number.' })
  page: number;

  @ApiProperty({ description: 'Number of items per page.' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages.' })
  totalPages: number;

  @ApiProperty({ description: 'Indicates if there is a next page.' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indicates if there is a previous page.' })
  hasPrevPage: boolean;
}
