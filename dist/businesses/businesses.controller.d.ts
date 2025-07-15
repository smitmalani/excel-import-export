import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from 'generated/prisma';
export declare class BusinessesController {
    private readonly businessesService;
    constructor(businessesService: BusinessesService);
    create(createBusinessDto: CreateBusinessDto, logo?: Express.Multer.File): Promise<Business>;
    findAll(): Promise<Business[]>;
    findAllWithInactive(): Promise<Business[]>;
    findOne(id: number): Promise<Business>;
    update(id: number, updateBusinessDto: UpdateBusinessDto, logo?: Express.Multer.File): Promise<Business>;
    remove(id: number): Promise<Business>;
}
