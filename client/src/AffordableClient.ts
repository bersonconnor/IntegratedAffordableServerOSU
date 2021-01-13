import { AddMemberRequest, CreateUserRequest, Grant, LoginResponse, Organization, OrganizationMembership, ProfileFields, UserInfo, TwoFactorResponse } from "affordable-shared-models";
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { Applicant } from "affordable-shared-models/dist/models/Applicant";
import {UserType} from "affordable-shared-models";

import jwt from "jsonwebtoken";
import UniversalCookies from 'universal-cookie';

import { AffordableClientConstants } from "./util";
import AUTH_EP = AffordableClientConstants.AUTH_EP;
import PROFILE_EP = AffordableClientConstants.PROFILE_EP;
import SESSION_TOKEN_COOKIE_KEY = AffordableClientConstants.SESSION_TOKEN_COOKIE_KEY;
import GRANT_EP = AffordableClientConstants.GRANT_EP;
import ORGANIZATION_EP = AffordableClientConstants.ORGANIZATION_EP;
import TRANSACTION = AffordableClientConstants.TRANSACTION;
import APPLICATION = AffordableClientConstants.APPLICATION;
import STRIPE = AffordableClientConstants.STRIPE;
import FILE = AffordableClientConstants.FILE;
import ACTIVITY_EP = AffordableClientConstants.ACTIVITY_EP;

import { config } from "dotenv";
import { idText } from "typescript";
config();

axios.defaults.withCredentials = true;

class BalanceResponse {
    success: string;
    pendingBalance: number;
    balance: number;
};

export class AffordableClient {

    constructor() {
        this.cookies = new UniversalCookies;
    }


    private baseURL: string;
    private cookies: UniversalCookies;
    private sessionToken: string;
    private myUserId: number;

    //For tlcoaesting purposes
    getUserId(): number {
        return this.myUserId
    }

    public getBaseURL(): string {
        return this.baseURL ? this.baseURL: process.env.REACT_APP_AF_BACKEND_URL || (window as any).REACT_APP_AF_BACKEND_URL;
    }

    public setBaseURL(url: string) {
        this.baseURL = url;
    }

    private getSessionToken(): string {
        return this.sessionToken ? this.sessionToken : this.cookies.get(SESSION_TOKEN_COOKIE_KEY);
    }

    private setSessionToken(token: string) {
        this.sessionToken = token;
        this.cookies.set(
            SESSION_TOKEN_COOKIE_KEY,
            token,
            { maxAge: 60 * 60 * 8 } // 8 hours
        );
        // Get the UserInfo out of the token
        const decoded = jwt.decode(token);
        this.myUserId = (JSON.parse(decoded.sub) as UserInfo).id;
    }

    protected getHeaders() {
        return this.getSessionToken() ? {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.getSessionToken()
        } : {
                "Content-Type": "application/json"
            }
    }

    protected doGet<T>(endpoint: string, params?: any): Promise<T> {
        return axios.get<T>(endpoint, {
            params: params,
            headers: params?.headers ?? this.getHeaders()
        }).then((response: AxiosResponse<T>) => {
            return response.data
        }).catch((error: AxiosError) => {
            return null;
            //throw new AffordableHttpError(error)
        });
    }

    protected doDelete<T>(endpoint: string, params?: any): Promise<T> {
        return axios.delete<T>(endpoint, {
            params: params,
            headers: params?.headers ?? this.getHeaders()
        }).then((response: AxiosResponse<T>) => {
            return response.data
        }).catch((error: AxiosError) => {
            throw new AffordableHttpError(error)
        });
    }

    protected doPost<T>(endpoint: string, body: any, axiosParams?: AxiosRequestConfig): Promise<T> {
        return axios.post<T>(endpoint, body, {
            ...axiosParams,
            headers: axiosParams?.headers ?? this.getHeaders()
        }).then((response: AxiosResponse<T>) => {
            return response.data
        }).catch((error: AxiosError) => {
            throw new AffordableHttpError(error)
        });
    }

    protected doPut<T>(endpoint: string, body: any, axiosParams?: AxiosRequestConfig): Promise<T> {
        return axios.put<T>(endpoint, body, {
            ...axiosParams,
            headers: this.getHeaders()
        }).then((response: AxiosResponse<T>) => {
            return response.data
        }).catch((error: AxiosError) => {
            throw new AffordableHttpError(error)
        });
    }

    public getMyUserInfo(): Promise<UserInfo> {
        return this.getUserInfo(this.myUserId);
    }

    /**
     * Create a user account in Affordable
     * @param user
     */
    registerUser(user: CreateUserRequest): Promise<LoginResponse> {
        return this.doPost<LoginResponse>(this.getBaseURL() + AUTH_EP, user, {
            headers: {"Content-Type": "application/json"}
        })
            .then((response: LoginResponse) => {
                this.setSessionToken(response.token);
                return response;
            });
    }

    getEmails(user: string) {
        return this.doPost<boolean>(this.getBaseURL() + PROFILE_EP + "/get-emails", {username: user}).then((response: any) => {
            return response;
        });
    }

    twoFactor(token: string, imageid: string, secret: string): Promise<TwoFactorResponse> {
        return this.doPost<any>(this.getBaseURL() + AUTH_EP + "/two-factor",
        {
            token: token,
            imageid: imageid,
            secret: secret
        }).then((response: any) => {
            return response;
        });
    }

    addTwoFactor(deviceName: string, username: string, email: string, randomString: any, timeStamp: string, secret: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + PROFILE_EP + "/add-two-factor", 
        {
            DeviceName: deviceName,
            Username: username,
            Email: email,
            RandomString: randomString,
            TimeStamp: timeStamp,
            Secret: secret
        }).then((response: any) => {
            return response
        });
    }

    removeTwoFactor(username: string, email: string) {
        return this.doPost<any>(this.getBaseURL() + PROFILE_EP + "/remove-two-factor", 
        {
            Username: username,
            Email: email
        }).then((response: any) => {
            return response
        });
    }

    checkTwoFactorByAgainstUsername(username: string, token: string, googleAuthOpt: string | Blob): Promise<any> {
        console.log("GOOG: ", googleAuthOpt);
        return this.doPost<any>(this.getBaseURL() + AUTH_EP + "/two-factor/username", {
            username: username,
            token: token,
            GoogleAuth: googleAuthOpt
        }).then((response: any) => {
            return response;
        })
    }

    getBalance(username: string, usertype: UserType): Promise<BalanceResponse> {
        return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/balance',
        {
            username: username,
            usertype: usertype
        }).then((response: any) => {
            return response;
        });
    }

    exchangeTokens(token: string, account: string, username: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/exchangeTokens',
        {
            public_token: token,
            account_id: account,
            username: username
        }).then((response: any) => {
            return response;
        });
    }

    stripeSaveCard(username: string, tokenId: string, cardType: string, cardName:string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/saveCard',
        {
            username: username,
            tokenId: tokenId,
            cardType: cardType,
            cardName: cardName
        }).then((response: any) => {
            return response;
        });
    }

    stripeGetSavedPaymentMethod(username:string, paymentType: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/getSavedPaymentMethod',
        {
            username: username,
            paymentType: paymentType
        }).then((response: any) => {
            return response;
        });
    }

    getApplications(status: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + APPLICATION + '/getApps',
        { status: status
        }).then((response: any) => {
            return response;
        });
    }

    fileUpload(data: FormData): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + FILE + '/upload',
        data).then((response: any) => {
            return response;
        });
    }

    fileDownload(data: FormData): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + FILE + '/download',
        data, {responseType: 'blob'}).then((response: any) => {
            console.log(response);
            return response;
        });
    }

    getAdminAwarded(): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/adminAwarded',
        {}).then((response: any) => {
            return response;
        });
    }

    addApplication(username: string, covid: string, monthly: string,
        amount: string,fullName: string, story: string, file1: string,
        file2: string, file3: string, share: string): Promise<BalanceResponse> {
            let body = {
                username: username,
                covid: covid,
                monthly: monthly,
                amount: amount,
                fullName: fullName,
                story: story,
                file0: file1,
                file1: file2,
                file2: file3, 
                share: share
            };
        return this.doPost<any>(this.getBaseURL() + APPLICATION + '/addApp',body);
    }

    getDonations(username: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/donations',
        { username: username
        }).then((response: any) => {
            return response;
        });
    }

    getAwarded(username: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/awarded',
        { username: username
        }).then((response: any) => {
            return response;
        });
    }

    getDeposit(username: string, card:boolean): Promise<any> {
        if(card){
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/depositCard',
            { username: username
            }).then((response: any) => {
                return response;
            });
        } else {
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/depositBank',
            { username: username
            }).then((response: any) => {
                return response;
            });
        }
    }

    getWithdraw(username: string, usertype: UserType ,card:boolean): Promise<any> {
        if(card){
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/withdrawCard',
            { username: username, usertype: usertype
            }).then((response: any) => {
                return response;
            });
        } else {
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/withdrawBank',
            { username: username, usertype: usertype
            }).then((response: any) => {
                return response;
            });
        }
    }

    getPaymentMethod(username: string, card: boolean, connected:boolean): Promise<any> {
        if(card){
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/cards',
            { username: username
            }).then((response: any) => {
                return response;
            });
        } else if (connected) {
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/connectedBanks',
            { username: username
            }).then((response: any) => {
                return response;
            });
        } else {
            return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/banks',
            { username: username
            }).then((response: any) => {
                return response;
            });
        }
    }

    removePaymentMethod(username: string, type: string,name: string, usertype:UserType): Promise<any> {
        if(type === 'Bank'){
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/removeBank',
            { username: username, nickname: name, usertype: usertype
            }).then((response: any) => {
                return response;
            });
        } else {
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/removeCard',
            { username: username, type: type, name: name
            }).then((response: any) => {
                return response;
            });
        }
    }

    awardHUG(HUGID: number, username: string, amount: number, email: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/transferFundFromHUGToRecipient',
        {
            HUGID: HUGID,
            recipientID: username,
            amount: amount,
            email: email
        }).then((response: any) => {
            return response;
        });
    }

    rejectApplicant(HUGID: number, username: string, email: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/rejectRecipient',
        {
            HUGID: HUGID,
            username: username,
            email: email
        }).then((response: any) => {
            return response;
        }).catch((error: AxiosError) => {
            console.log("502 by Rejection");
            return {sucess: "Updated Awarded status"};
        });
    }

    getStripeAccountID(username:string, usertype: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/getCustomAccountID',
        { username: username, usertype: usertype
        }).then((response: any) => {
            return response;
        });
    }

    getConnectedRequirements(username:string, usertype: UserType, accountID: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/checkConnectRequirements',
        { username: username, usertype: usertype, accountID: accountID
        }).then((response: any) => {
            return response;
        });
    }

    getStripeAccountBalance(username:string, usertype: UserType, accountID: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/getAccountBalance',
        { username: username, usertype: usertype, accountID: accountID
        }).then((response: any) => {
            return response;
        });
    }

    onboardingInfoReq(username:string, usertype: UserType, accountID: string, url: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/onboardingInfoRequest',
        { username: username, usertype: usertype, accountID: accountID,
            successURL: url, failureURL: url
        }).then((response: any) => {
            return response;
        });
    }

    donateToHug(username: string, HUGName: string, amount: number): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/transferFundFromDonorToHUG',
        { username: username, HUGName: HUGName, amount: amount
        }).then((response: any) => {
            return response;
        });
    }

    stripeDeposit(username: string, type: string, method: string, beforetax: number,
        afterTax: number, stripeFee: number, fee: number): Promise<any>{
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/deposit',
            {
                username: username,
                paymentType: type,
                paymentMethod: method,
                amountToCharge: beforetax,
                amountToDeposit: afterTax,
                stripeFee: stripeFee,
                managementFee: fee
            }).then((response: any) => {
                return response;
            });
    }

    getTransactionStatus(username: string, chargeID: string, type: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + TRANSACTION + '/depositStatus',
        { username: username, chargeID: chargeID
        }).then((response: any) => {
            return response;
        });
    }

    getCustomBank(data:FormData): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/getCustomBank',
        data).then((response: any) => {
            return response;
        });
    }

    stripeTransfer(data:FormData): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/transfer',
        data).then((response: any) => {
            return response;
        });
    }

    stripePayout(data:FormData, update:boolean): Promise<any> {
        if (update){
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/payoutUpdateTable',
            data).then((response: any) => {
                return response;
            });
        } else {
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/payout',
            data).then((response: any) => {
                return response;
            });
        }
    }

    attachBankToCustomer(data: FormData, account: boolean): Promise<any> {
        if (account === true){
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/attachBankToCustomAccount',
            data).then((response: any) => {
                return response;
            });
        } else {
            return this.doPost<any>(this.getBaseURL() + STRIPE + '/attachBankToCustomer',
            data).then((response: any) => {
                return response;
            });
        }
    }

    addBankToCustomTable(data: FormData): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/addBankToCustomTable',
        data).then((response: any) => {
            return response;
        });
    }

    login(username: string, password: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + AUTH_EP + "/login",
            {
                username: username,
                password: password
            }, {
                headers: {"Content-Type": "application/json"}
            })
            .then((response: any) => {
                console.log(response)
                if (typeof response.userInfo !== "undefined") { // Check if return type is LoginResponse
                    this.setSessionToken(response.token);
                    return response;
                } else {
                    return response;
                }
            });
    }

    /**
     * Retrieve a user's UserInfo
     * @param userId: the user's unique id
     */
    getUserInfo(userId: number): Promise<UserInfo> {
        return this.doGet<UserInfo>(this.getBaseURL() + PROFILE_EP + `/${userId}/userInfo`);
    }


    /**
     * Changes a user's password in Affordable
     * @param oldPassword
     * @param newPassword
     */
    changePassword(oldPassword: string, newPassword: string): Promise<void> {
        return this.doPost<void>(this.getBaseURL() + AUTH_EP + "/change-password",
            {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
    }

    /**
     * Sends an email to the user providing their username and
     * gives a link allowing them to change their password
     * @param email
     */
    forgotUserNameOrPassword(email: string): Promise<void> {
        return this.doPost<void>(this.getBaseURL() + AUTH_EP + "/forgot-password",
            {
                email: email
            });
    }

    /**
     * Resets the user's password from the email sent to them
     * @param email
     */
    resetPassword(password: string, code: string): Promise<void> {
        return this.doPost<void>(this.getBaseURL() + AUTH_EP + "/reset-password",
            {
                password: password,
                code: code
            });
    }

    /**
     * Creates a user profile in Affordable
     * @param profile
     */
    createProfile(profile: ProfileFields.Profile): Promise<ProfileFields.Profile> {
        return this.doPost<ProfileFields.Profile>(this.getBaseURL() + PROFILE_EP, { profile: profile });
    }

    /**
     * Gets whether a user has verified their email in Affordable
     * @param userId
     */
    getEmailVer(): Promise<boolean> {
        return this.doGet<boolean>(this.getBaseURL() + AUTH_EP + "/get-verification");
    }

    /**
     * Gets a user profile in Affordable
     * @param userId
     */
    getProfile(userId: number): Promise<ProfileFields.Profile> {
        return this.doGet<ProfileFields.Profile>(this.getBaseURL() + PROFILE_EP, { userId: userId });
    }

    /**
     * Deletes a user profile in Affordable
     * @param profile
     */
    deleteProfile(userId: number): Promise<ProfileFields.Profile> {
        return this.doDelete<ProfileFields.Profile>(this.getBaseURL() + PROFILE_EP, { userId: userId });
    }

    /**
     * Gets the primary email address of a user in Affordable
     * @param profile
     */
    getPrimaryEmail(username: string): Promise<string> {
        return axios.get<string>(this.getBaseURL() + PROFILE_EP + "/get-primary-email", {
            params: { username: username },
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.data)
            .catch((error: AxiosError) => {
                throw new AffordableHttpError(error)
            });
    }


    /**
     * Updates the primary email address of a user in Affordable
     * @param
     */
    updatePrimaryEmail(newEmail: string): Promise<void> {
        return this.doPost<void>(this.getBaseURL() + AUTH_EP + "/email/update", {
            email: newEmail
        })
    }

    /**
     * Create an organization
     * @param organization
     * @returns the organization
     */
    createOrganization(organization: Organization): Promise<Organization> {
        return this.doPost<Organization>(this.getBaseURL() + ORGANIZATION_EP,
            organization);
    }

    /**
     * Update an organization
     * @param organization
     * @returns the organization
     */
    updateOrganization(organization: Organization): Promise<Organization> {
        return this.doPost<Organization>(this.getBaseURL() + ORGANIZATION_EP + `/${organization.id}`, organization);
    }

    /**
     * Get an organization in Affordable
     * @param organizationId
     */
    getOrganization(organizationId: number): Promise<Organization> {
        return this.doGet<Organization>(this.getBaseURL() + ORGANIZATION_EP + `/${organizationId}`)
    }

    /**
     * Get the API key for an organization in Affordable
     * @param organizationId
     */
    getApiKey(organizationId: number): Promise<string> {
        return this.doGet<string>(this.getBaseURL() + ORGANIZATION_EP + `/${organizationId}/apiKey`)
    }

    /**
     * Get the API key for an organization in Affordable
     * @param profile
     */
    getOrganizationsForUser(userId: number): Promise<Array<OrganizationMembership>> {
        return this.doGet<Array<OrganizationMembership>>(this.getBaseURL() + PROFILE_EP + `/${userId}/organizations`);
    }

    /**
     * Add a user to an organization
     * @param request
     */
    addUserToOrganization(request: AddMemberRequest): Promise<void> {
        return this.doPost<void>(this.getBaseURL() + ORGANIZATION_EP + `/${request.organizationId}/members`,
            request);
    }

    /**
     * Remove a user from an organization
     * @param organizationId
     * @param userId
     */
    removeMemberFromOrganization(organizationId: number, userId: number): Promise<void> {
        return this.doDelete<void>(this.getBaseURL() + ORGANIZATION_EP + `/${organizationId}/members/${userId}`);
    }

    /**
     * Create a Health Utilizing Grant
     * @param grant
     */
    createGrant(grant: Grant): Promise<Grant> {
        return this.doPost<Grant>(this.getBaseURL() + GRANT_EP, grant);
    }

    /**
     * Update a Health Utilizing Grant
     * @param grant
     */
    updateGrant(grant: Grant): Promise<Grant> {
        return this.doPut<Grant>(this.getBaseURL() + GRANT_EP + `/${grant.id}`,
            grant);
    }

    /**
     * Get a Health Utilizing Grant
     * @param id
     */
    getGrant(id: number): Promise<Grant> {
        return this.doGet<Grant>(this.getBaseURL() + GRANT_EP + `/${id}`);
    }

    /**
     * Delete a Health Utilizing Grant
     * @param id
     */
    deleteGrant(id: number): Promise<Grant> {
        return this.doDelete<Grant>(this.getBaseURL() + GRANT_EP + `/${id}`);
    }

    /**
     * Get the list of grants that the user is eligible for
     */
    getEligibleGrants(): Promise<Array<Grant>> {
        return this.doGet<Array<Grant>>(this.getBaseURL()  + GRANT_EP)
    }

    /**
     * Get the list of applicants for a grant that the user has permission to manage
     */
    getGrantApplicants(id: number): Promise<Array<Applicant>> {
        return this.doGet<Array<Applicant>>(this.getBaseURL()  + GRANT_EP + `/${id}/applicants`)
    }

    /**
     * Apply to a grant, if you are an eligible recipient.
     */
    applyToGrant(id: number): Promise<void> {
        return this.doPut<void>(this.getBaseURL()  + GRANT_EP + `/${id}/apply`, {});
    }

    /**
     * Award a grant to a user that has applied for a grant, if you belong to the organization that manages the grant.
     * @param userId
     * @param grantId
     */
    awardGrantToUser(userId: number, grantId: number): Promise<void> {
        return this.doPut<void>(this.getBaseURL() + GRANT_EP + `/${grantId}/award/${userId}`, {});
    }

    addActivity(request: any): Promise<void> {
        return this.doPost<boolean>(this.getBaseURL() + ACTIVITY_EP + "/add-activity", request).then((response: any) => {
            return response;
        });
    }

    deleteEmail(request: any): Promise<void> {
        return this.doPost<boolean>(this.getBaseURL() + PROFILE_EP + "/delete-email", request).then((response: any) => {
            return response;
        });
    }

    checkEmail(request: any): Promise<void> {
        return this.doPost<boolean>(this.getBaseURL() + AUTH_EP + "/email", request).then((response: any) => {
            return response;
        });
    }



    /**
     * 
     * rest of this class is newly created API routes for AUTUMN 2020
     * 
     */


    stripeCustomer(id:string, name:string, email: string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/customer',
        {
            id: id,
            name: name,
            email: email,
        }).then((response: any) => {
            return response;
        });
    }

    stripeAddBank(id:string): Promise<any> {
        return this.doPost<any>(this.getBaseURL() + STRIPE + '/addBank',
        {
            id: id
        }).then((response: any) => {
            console.log("ENTERING ADD BANK")
            return response;
        });
    }
}


export class AffordableHttpError extends Error {
    public responseStatus: number;

    constructor(error: AxiosError) {
        super(error.message + ": " + error.response.data.error);
        this.responseStatus = error.response.status;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AffordableHttpError.prototype);
    }
}
