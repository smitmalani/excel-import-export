export declare class ServiceOfferingResponseDto {
    serviceOfferingID: number;
    businessId?: number;
    businessName?: string;
    serviceName: string;
    cardTypeId: number;
    cardTypeName?: string;
    description?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
