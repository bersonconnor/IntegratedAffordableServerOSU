export class Organization {
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

export enum OrganizationMembershipValues {
    MEMBER,
    ADMIN
}

export class OrganizationMembership {
    organization: Organization;
    membership: OrganizationMembershipValues;
}

export class AddMemberRequest {
    organizationId: number;
    userId: number;
    isAdmin: boolean;
}
