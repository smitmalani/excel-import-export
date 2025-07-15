import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '../../generated/prisma';
import { Role } from '../auth/enums/role.enum';
interface UserCreationPayload {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    role: Role;
    businessId?: number | null;
}
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: UserCreationPayload, tx?: Prisma.TransactionClient): Promise<User>;
    findOneByUsername(username: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    findUserByEmailAndBusinessId(email: string, businessId: number): Promise<User | null>;
    findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
    findOneById(userId: number): Promise<User | null>;
    update(userId: number, data: Prisma.UserUpdateInput): Promise<User>;
    setPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<User | null>;
    clearPasswordResetToken(userId: number): Promise<User | null>;
    findUserByValidResetToken(token: string): Promise<User | null>;
    changePassword(userId: number, oldPassword: any, newPassword: any): Promise<void>;
}
export {};
