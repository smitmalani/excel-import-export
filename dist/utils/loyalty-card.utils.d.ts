import { Member } from 'generated/prisma';
declare function generateLoyaltyCard(member: Member, cardTypeName: string): Promise<string>;
export { generateLoyaltyCard };
