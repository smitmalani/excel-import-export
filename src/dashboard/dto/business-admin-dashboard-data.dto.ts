import { ApiProperty } from '@nestjs/swagger';

export class BusinessAdminDashboardDataDto {
  @ApiProperty({ example: 10, description: 'Total number of active patients' })
  totalPatients: number;

  @ApiProperty({
    example: 5,
    description: 'Total number of active employees (sub-admins)',
  })
  totalEmployees: number;

  @ApiProperty({ example: 150.5, description: 'Total points added today' })
  todaysAddPoint: number;

  @ApiProperty({ example: 50.0, description: 'Total points redeemed today' })
  todaysRedeemPoint: number;
}
