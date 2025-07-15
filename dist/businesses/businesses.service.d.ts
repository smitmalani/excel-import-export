import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from '../../generated/prisma';
import { MailService } from '../mail/mail.service';
export declare class BusinessesService {
    private prisma;
    private usersService;
    private mailService;
    constructor(prisma: PrismaService, usersService: UsersService, mailService: MailService);
    create(createBusinessDto: CreateBusinessDto, logoPath?: string): Promise<Business>;
    findAll(): Promise<Business[]>;
    findAllWithInactive(): Promise<Business[]>;
    findOne(businessId: number): Promise<Business>;
    update(businessId: number, updateBusinessDto: UpdateBusinessDto, logoPath?: string): Promise<Business>;
    remove(businessId: number): Promise<Business>;
}
