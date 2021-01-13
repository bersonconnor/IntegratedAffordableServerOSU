import { AddMemberRequest, CreateUserRequest, Grant, LoginResponse, Organization, OrganizationMembership, ProfileFields, UserInfo, TwoFactorResponse } from "affordable-shared-models";
import { AxiosError, AxiosRequestConfig } from "axios";
import { Applicant } from "affordable-shared-models/dist/models/Applicant";
import { UserType } from "affordable-shared-models";
declare class BalanceResponse {
    success: string;
    pendingBalance: number;
    balance: number;
}
export declare class AffordableClient {
    constructor();
    private baseURL;
    private cookies;
    private sessionToken;
    private myUserId;
    getUserId(): number;
    getBaseURL(): string;
    setBaseURL(url: string): void;
    private getSessionToken;
    private setSessionToken;
    protected getHeaders(): {
        "Content-Type": string;
        Authorization: string;
    } | {
        "Content-Type": string;
        Authorization?: undefined;
    };
    protected doGet<T>(endpoint: string, params?: any): Promise<T>;
    protected doDelete<T>(endpoint: string, params?: any): Promise<T>;
    protected doPost<T>(endpoint: string, body: any, axiosParams?: AxiosRequestConfig): Promise<T>;
    protected doPut<T>(endpoint: string, body: any, axiosParams?: AxiosRequestConfig): Promise<T>;
    getMyUserInfo(): Promise<UserInfo>;
    /**
     * Create a user account in Affordable
     * @param user
     */
    registerUser(user: CreateUserRequest): Promise<LoginResponse>;
    getEmails(user: string): Promise<any>;
    twoFactor(token: string, imageid: string, secret: string): Promise<TwoFactorResponse>;
    addTwoFactor(deviceName: string, username: string, email: string, randomString: any, timeStamp: string, secret: string): Promise<any>;
    removeTwoFactor(username: string, email: string): Promise<any>;
    checkTwoFactorByAgainstUsername(username: string, token: string, googleAuthOpt: string | Blob): Promise<any>;
    getBalance(username: string, usertype: UserType): Promise<BalanceResponse>;
    exchangeTokens(token: string, account: string, username: string): Promise<any>;
    stripeSaveCard(username: string, tokenId: string, cardType: string, cardName: string): Promise<any>;
    stripeGetSavedPaymentMethod(username: string, paymentType: string): Promise<any>;
    getApplications(status: string): Promise<any>;
    fileUpload(data: FormData): Promise<any>;
    fileDownload(data: FormData): Promise<any>;
    getAdminAwarded(): Promise<any>;
    addApplication(username: string, covid: string, monthly: string, amount: string, fullName: string, story: string, file1: string, file2: string, file3: string, share: string): Promise<BalanceResponse>;
    getDonations(username: string): Promise<any>;
    getAwarded(username: string): Promise<any>;
    getDeposit(username: string, card: boolean): Promise<any>;
    getWithdraw(username: string, usertype: UserType, card: boolean): Promise<any>;
    getPaymentMethod(username: string, card: boolean, connected: boolean): Promise<any>;
    removePaymentMethod(username: string, type: string, name: string, usertype: UserType): Promise<any>;
    awardHUG(HUGID: number, username: string, amount: number, email: string): Promise<any>;
    rejectApplicant(HUGID: number, username: string, email: string): Promise<any>;
    getStripeAccountID(username: string, usertype: string): Promise<any>;
    getConnectedRequirements(username: string, usertype: UserType, accountID: string): Promise<any>;
    getStripeAccountBalance(username: string, usertype: UserType, accountID: string): Promise<any>;
    onboardingInfoReq(username: string, usertype: UserType, accountID: string, url: string): Promise<any>;
    donateToHug(username: string, HUGName: string, amount: number): Promise<any>;
    stripeDeposit(username: string, type: string, method: string, beforetax: number, afterTax: number, stripeFee: number, fee: number): Promise<any>;
    getTransactionStatus(username: string, chargeID: string, type: string): Promise<any>;
    getCustomBank(data: FormData): Promise<any>;
    stripeTransfer(data: FormData): Promise<any>;
    stripePayout(data: FormData, update: boolean): Promise<any>;
    attachBankToCustomer(data: FormData, account: boolean): Promise<any>;
    addBankToCustomTable(data: FormData): Promise<any>;
    login(username: string, password: string): Promise<any>;
    /**
     * Retrieve a user's UserInfo
     * @param userId: the user's unique id
     */
    getUserInfo(userId: number): Promise<UserInfo>;
    /**
     * Changes a user's password in Affordable
     * @param oldPassword
     * @param newPassword
     */
    changePassword(oldPassword: string, newPassword: string): Promise<void>;
    /**
     * Sends an email to the user providing their username and
     * gives a link allowing them to change their password
     * @param email
     */
    forgotUserNameOrPassword(email: string): Promise<void>;
    /**
     * Resets the user's password from the email sent to them
     * @param email
     */
    resetPassword(password: string, code: string): Promise<void>;
    /**
     * Creates a user profile in Affordable
     * @param profile
     */
    createProfile(profile: ProfileFields.Profile): Promise<ProfileFields.Profile>;
    /**
     * Gets whether a user has verified their email in Affordable
     * @param userId
     */
    getEmailVer(): Promise<boolean>;
    /**
     * Gets a user profile in Affordable
     * @param userId
     */
    getProfile(userId: number): Promise<ProfileFields.Profile>;
    /**
     * Deletes a user profile in Affordable
     * @param profile
     */
    deleteProfile(userId: number): Promise<ProfileFields.Profile>;
    /**
     * Gets the primary email address of a user in Affordable
     * @param profile
     */
    getPrimaryEmail(username: string): Promise<string>;
    /**
     * Updates the primary email address of a user in Affordable
     * @param
     */
    updatePrimaryEmail(newEmail: string): Promise<void>;
    /**
     * Create an organization
     * @param organization
     * @returns the organization
     */
    createOrganization(organization: Organization): Promise<Organization>;
    /**
     * Update an organization
     * @param organization
     * @returns the organization
     */
    updateOrganization(organization: Organization): Promise<Organization>;
    /**
     * Get an organization in Affordable
     * @param organizationId
     */
    getOrganization(organizationId: number): Promise<Organization>;
    /**
     * Get the API key for an organization in Affordable
     * @param organizationId
     */
    getApiKey(organizationId: number): Promise<string>;
    /**
     * Get the API key for an organization in Affordable
     * @param profile
     */
    getOrganizationsForUser(userId: number): Promise<Array<OrganizationMembership>>;
    /**
     * Add a user to an organization
     * @param request
     */
    addUserToOrganization(request: AddMemberRequest): Promise<void>;
    /**
     * Remove a user from an organization
     * @param organizationId
     * @param userId
     */
    removeMemberFromOrganization(organizationId: number, userId: number): Promise<void>;
    /**
     * Create a Health Utilizing Grant
     * @param grant
     */
    createGrant(grant: Grant): Promise<Grant>;
    /**
     * Update a Health Utilizing Grant
     * @param grant
     */
    updateGrant(grant: Grant): Promise<Grant>;
    /**
     * Get a Health Utilizing Grant
     * @param id
     */
    getGrant(id: number): Promise<Grant>;
    /**
     * Delete a Health Utilizing Grant
     * @param id
     */
    deleteGrant(id: number): Promise<Grant>;
    /**
     * Get the list of grants that the user is eligible for
     */
    getEligibleGrants(): Promise<Array<Grant>>;
    /**
     * Get the list of applicants for a grant that the user has permission to manage
     */
    getGrantApplicants(id: number): Promise<Array<Applicant>>;
    /**
     * Apply to a grant, if you are an eligible recipient.
     */
    applyToGrant(id: number): Promise<void>;
    /**
     * Award a grant to a user that has applied for a grant, if you belong to the organization that manages the grant.
     * @param userId
     * @param grantId
     */
    awardGrantToUser(userId: number, grantId: number): Promise<void>;
    addActivity(request: any): Promise<void>;
    deleteEmail(request: any): Promise<void>;
    checkEmail(request: any): Promise<void>;
    /**
     *
     * rest of this class is newly created API routes for AUTUMN 2020
     *
     */
    stripeCustomer(id: string, name: string, email: string): Promise<any>;
    stripeAddBank(id: string): Promise<any>;
}
export declare class AffordableHttpError extends Error {
    responseStatus: number;
    constructor(error: AxiosError);
}
export {};
