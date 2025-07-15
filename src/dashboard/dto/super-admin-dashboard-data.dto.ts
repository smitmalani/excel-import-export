import { ApiProperty } from '@nestjs/swagger';

export class SuperAdminDashboardDataDto {
  @ApiProperty({
    description:
      'Total number of businesses registered in the system (active and inactive).',
    example: 150,
  })
  totalBusinesses: number;

  @ApiProperty({
    description: 'Total number of business admin accounts in the system.',
    example: 165,
  })
  totalBusinessAdmins: number;
}
