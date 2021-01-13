import { UserType } from "./UserType";

export class CreateUserRequest {
    username: string;
    password: string;
    email: string;
    TwoFactor: boolean;
    TwoFactorCode: string;
    deactivated: boolean;
    usertype: UserType;
}
