import { ApiProperty } from '@nestjs/swagger';
import { CardTypeResponseDto } from './card-type-response.dto';

export class PaginatedCardTypeResponseDto {
  @ApiProperty({
    description: 'Array of card type records for the current page.',
    type: [CardTypeResponseDto],
  })
  data: CardTypeResponseDto[];

  @ApiProperty({
    description: 'Total number of card types available.',
    example: 100,
  })
  total: number;

  @ApiProperty({ description: 'Current page number.', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page.', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages.', example: 10 })
  totalPages: number;

  @ApiProperty({
    description: 'Indicates if there is a next page.',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page.',
    example: false,
  })
  hasPrevPage: boolean;
}
