import { ApiProperty } from '@nestjs/swagger';
import { MemberResponseDto } from './member-response.dto';

export class PaginatedMembersResponseDto {
  @ApiProperty({
    description: 'Array of member records for the current page.',
    type: [MemberResponseDto],
  })
  data: MemberResponseDto[];

  @ApiProperty({ description: 'Total number of member records found.' })
  total: number;

  @ApiProperty({ description: 'The current page number.' })
  page: number;

  @ApiProperty({ description: 'The number of items per page.' })
  limit: number;

  @ApiProperty({ description: 'The total number of pages.' })
  totalPages: number;

  @ApiProperty({ description: 'Indicates if there is a next page.' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Indicates if there is a previous page.' })
  hasPrevPage: boolean;
}
