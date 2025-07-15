import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceOfferingResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the service offering.',
    example: 1,
  })
  serviceOfferingID: number;

  @ApiPropertyOptional({
    description:
      'ID of the business this service offering belongs to (only present for SuperAdmins).',
    example: 10,
  })
  businessId?: number;

  @ApiPropertyOptional({
    description: 'Name of the business (only present for SuperAdmins).',
    example: 'MediCare Clinic',
  })
  businessName?: string;

  @ApiProperty({
    description: 'Name of the service offering.',
    example: 'Standard Consultation',
  })
  serviceName: string;

  @ApiProperty({
    description: 'ID of the card type associated with this service.',
    example: 1,
  })
  cardTypeId: number;

  @ApiPropertyOptional({
    description: 'Name of the associated card type.',
    example: 'Gold Member',
  })
  cardTypeName?: string;

  @ApiPropertyOptional({
    description: 'Description of the service offering.',
    example: 'A standard 30-minute consultation.',
  })
  description?: string | null;

  @ApiProperty({
    description: 'Active status of the service offering.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Date and time of creation.',
    example: '2024-01-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time of last update.',
    example: '2024-01-02T12:00:00.000Z',
  })
  updatedAt: Date;
}
