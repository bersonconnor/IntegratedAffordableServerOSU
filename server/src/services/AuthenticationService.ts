import { CreateUserRequest, CreateUserResponse, LoginRequest, LoginResponse, UserInfo, ChangePasswordReq } from "affordable-shared-models";

export interface AuthenticationService {

    refreshToken(username: string): Promise<LoginResponse>;

    getUserInfo(userIdOrUsername: string | number): Promise<UserInfo>;

    /**
     * Creates a user in affordable
     * @param request A {@class CreateUserRequest} object that must have the following fields:
     *  username
     *  email
     *  password
     *  usertype
     * @return CreateUserResponse {@class CreateUserResponse}
     */
    registerUser(request: CreateUserRequest): Promise<LoginResponse>;

    /**
     * Validate a login attempt
     * @returns LoginResponse {@class LoginResponse}
     */
    validateLogin(req: LoginRequest): Promise<any>;

    accountCanBeCreatedWithEmail(email: string): Promise<boolean>;

    deleteUserInfo(userId: number): Promise<void>;

    recoverAccountByEmail(req, res): void;

    sendVerificationEmailForNewAccount(req, res): void;

    updatePassword(req, res): void;

    changePassword(userInfo: UserInfo, req: ChangePasswordReq): Promise<void>;

    resetPassword(newPassword: string, code: string): Promise<void>;

    generateQRCode(req, res): void;

    validateTwoFactorCodeRegistration(req, res): void;

    validateTwoFactorCodeEmail(req, res): void;

    validateTwoFactorCodeUsername(req, res): void;

    isUsernameUnique(req, res): void;

    deactivateAccount(req, res): void;

    deactivateAccountById(userId: number): void;

    reactivateAccount(req, res): void;

    reactivateAccountById(userId: number): void;

    failedlogin(req, res): void;

    getAllUsers(): Promise<Array<UserInfo>>;
}