import { MemberSystemType } from '../enums/member-system-type.enum';
import { Gender } from '../enums/gender.enum';
export declare class UpdateMemberDto {
    memberType?: MemberSystemType;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    email?: string;
    gender?: Gender;
    address?: string;
    age?: number;
    profileImageURL?: string;
    smartCardNumber?: string;
    isActive?: boolean;
}
