export declare class Organization {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    fax?: string;
    url?: string;
    missionStatement?: string;
    providesService?: boolean;
    hasBankingInfo?: boolean;
    isVerified?: boolean;
    apiKey?: string;
    ein?: string;
    irsActivityCode?: string;
    taxSection?: string;
}
export declare enum OrganizationMembershipValues {
    MEMBER = 0,
    ADMIN = 1
}
export declare class OrganizationMembership {
    organization: Organization;
    membership: OrganizationMembershipValues;
}
export declare class AddMemberRequest {
    organizationId: number;
    userId: number;
    isAdmin: boolean;
}
