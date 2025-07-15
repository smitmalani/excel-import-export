import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum'; // Adjust path as necessary

export class BusinessAdminResponseDto {
  @ApiProperty({ example: 1, description: 'User ID of the business admin' })
  UserID: number;

  @ApiProperty({ example: 1, description: 'Business ID this admin belongs to' })
  BusinessID: number;

  @ApiPropertyOptional({
    example: 'Global Corp',
    description: 'Name of the business this admin belongs to',
  })
  BusinessName?: string;

  @ApiProperty({
    enum: Role,
    example: Role.BusinessAdmin,
    description: 'Role of the user',
  })
  Role: Role;

  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the business admin',
  })
  Username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the business admin',
    nullable: true,
  })
  FullName: string | null;

  @ApiProperty({
    example: 'john.doe@business.com',
    description: 'Email of the business admin',
  })
  Email: string;

  @ApiProperty({ example: true, description: 'Active status of the admin' })
  IsActive: boolean;

  @ApiProperty({
    example: '2023-01-01T12:00:00.000Z',
    description: 'Last login timestamp',
    nullable: true,
  })
  LastLogin: Date | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation timestamp',
  })
  CreatedAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Last update timestamp',
  })
  UpdatedAt: Date;

  // Explicitly exclude PasswordHash and password reset token fields
  // Business relation can be added if needed, but typically BusinessID is sufficient here
}
