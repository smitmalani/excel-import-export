import { MemberSystemType } from '../enums/member-system-type.enum';
import { Gender } from '../enums/gender.enum';
export declare class CreateMemberDto {
    memberType: MemberSystemType;
    firstName: string;
    lastName?: string;
    mobileNumber: string;
    email?: string;
    gender?: Gender;
    address?: string;
    age?: number;
    smartCardNumber?: string;
    cardTypeId?: number;
    initialPoints?: number;
    businessId?: number;
}
