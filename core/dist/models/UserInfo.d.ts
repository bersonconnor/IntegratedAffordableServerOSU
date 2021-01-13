import { UserType } from "..";
export declare class UserInfo {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    primaryEmail?: string;
    userType: UserType;
    hasVerifiedEmail: boolean;
    twoFactor: boolean;
    isDeactivate?: boolean;
}
