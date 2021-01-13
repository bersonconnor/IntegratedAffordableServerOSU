import { UserType } from "./UserType";

export class CreateUserResponse {
    id: number;

    username: string;

    email: string;

    usertype: UserType;
}
