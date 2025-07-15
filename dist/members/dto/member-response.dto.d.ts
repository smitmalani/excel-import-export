import { Gender } from '../enums/gender.enum';
import { MemberSystemType } from '../enums/member-system-type.enum';
export declare class MemberResponseDto {
    memberID: number;
    businessID: number;
    businessName?: string;
    memberType: MemberSystemType;
    firstName: string;
    lastName: string | null;
    mobileNumber: string;
    email: string | null;
    gender: Gender | null;
    address: string | null;
    age: number | null;
    profileImageURL: string | null;
    smartCardNumber: string | null;
    cardTypeID: number | null;
    cardTypeName?: string;
    loyaltyCardUrl: string | null;
    currentLoyaltyPoints: number;
    isActive: boolean;
    registeredByUserID: number | null;
    createdAt: Date;
    updatedAt: Date;
}
