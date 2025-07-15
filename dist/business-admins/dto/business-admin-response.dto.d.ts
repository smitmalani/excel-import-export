import { Role } from '../../auth/enums/role.enum';
export declare class BusinessAdminResponseDto {
    UserID: number;
    BusinessID: number;
    BusinessName?: string;
    Role: Role;
    Username: string;
    FullName: string | null;
    Email: string;
    IsActive: boolean;
    LastLogin: Date | null;
    CreatedAt: Date;
    UpdatedAt: Date;
}
