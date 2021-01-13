import { Organization } from "..";
import { EligibilityCriteria } from "./EligibilityCriteria";
export declare class Grant {
    id?: number;
    grantName: string;
    grantAmount: number;
    startDate?: Date;
    endDate?: Date;
    category?: string;
    description: string;
    organization: Organization;
    recipientId?: number;
    eligibilityCriteria?: EligibilityCriteria;
    applied?: boolean | undefined;
}
