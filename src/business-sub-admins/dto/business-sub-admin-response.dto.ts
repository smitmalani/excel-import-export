import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class BusinessSubAdminResponseDto {
  @ApiProperty({ example: 101 })
  UserID: number;

  @ApiProperty({ example: 1 })
  BusinessID: number;

  @ApiProperty({ example: 'My Awesome Business' })
  BusinessName: string;

  @ApiProperty({ example: Role.BusinessSubAdmin })
  Role: string;

  @ApiProperty({ example: 'johndoe_sub' })
  Username: string;

  @ApiProperty({ example: 'John Doe' })
  FullName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  Email: string;

  @ApiProperty({ example: true })
  IsActive: boolean;

  @ApiProperty({ example: '2023-10-27T10:00:00.000Z', nullable: true })
  LastLogin: Date | null;

  @ApiProperty()
  CreatedAt: Date;

  @ApiProperty()
  UpdatedAt: Date;
}
