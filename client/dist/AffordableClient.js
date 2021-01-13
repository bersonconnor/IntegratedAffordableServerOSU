"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffordableHttpError = exports.AffordableClient = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const util_1 = require("./util");
var AUTH_EP = util_1.AffordableClientConstants.AUTH_EP;
var PROFILE_EP = util_1.AffordableClientConstants.PROFILE_EP;
var SESSION_TOKEN_COOKIE_KEY = util_1.AffordableClientConstants.SESSION_TOKEN_COOKIE_KEY;
var GRANT_EP = util_1.AffordableClientConstants.GRANT_EP;
var ORGANIZATION_EP = util_1.AffordableClientConstants.ORGANIZATION_EP;
var TRANSACTION = util_1.AffordableClientConstants.TRANSACTION;
var APPLICATION = util_1.AffordableClientConstants.APPLICATION;
var STRIPE = util_1.AffordableClientConstants.STRIPE;
var FILE = util_1.AffordableClientConstants.FILE;
var ACTIVITY_EP = util_1.AffordableClientConstants.ACTIVITY_EP;
const dotenv_1 = require("dotenv");
dotenv_1.config();
axios_1.default.defaults.withCredentials = true;
class BalanceResponse {
}
;
class AffordableClient {
    constructor() {
        this.cookies = new universal_cookie_1.default;
    }
    //For tlcoaesting purposes
    getUserId() {
        return this.myUserId;
    }
    getBaseURL() {
        return this.baseURL ? this.baseURL : process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
    }
    setBaseURL(url) {
        this.baseURL = url;
    }
    getSessionToken() {
        return this.sessionToken ? this.sessionToken : this.cookies.get(SESSION_TOKEN_COOKIE_KEY);
    }
    setSessionToken(token) {
        this.sessionToken = token;
        this.cookies.set(SESSION_TOKEN_COOKIE_KEY, token, { maxAge: 60 * 60 * 8 } // 8 hours
        );
        // Get the UserInfo out of the token
        const decoded = jsonwebtoken_1.default.decode(token);
        this.myUserId = JSON.parse(decoded.sub).id;
    }
    getHeaders() {
        return this.getSessionToken() ? {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.getSessionToken()
        } : {
            "Content-Type": "application/json"
        };
    }
    doGet(endpoint, params) {
        var _a;
        return axios_1.default.get(endpoint, {
            params: params,
            headers: (_a = params === null || params === void 0 ? void 0 : params.headers) !== null && _a !== void 0 ? _a : this.getHeaders()
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            return null;
            //throw new AffordableHttpError(error)
        });
    }
    doDelete(endpoint, params) {
        var _a;
        return axios_1.default.delete(endpoint, {
            params: params,
            headers: (_a = params === null || params === void 0 ? void 0 : params.headers) !== null && _a !== void 0 ? _a : this.getHeaders()
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            throw new AffordableHttpError(error);
        });
    }
    doPost(endpoint, body, axiosParams) {
        var _a;
        return axios_1.default.post(endpoint, body, Object.assign(Object.assign({}, axiosParams), { headers: (_a = axiosParams === null || axiosParams === void 0 ? void 0 : axiosParams.headers) !== null && _a !== void 0 ? _a : this.getHeaders() })).then((response) => {
            return response.data;
        }).catch((error) => {
            throw new AffordableHttpError(error);
        });
    }
    doPut(endpoint, body, axiosParams) {
        return axios_1.default.put(endpoint, body, Object.assign(Object.assign({}, axiosParams), { headers: this.getHeaders() })).then((response) => {
            return response.data;
        }).catch((error) => {
            throw new AffordableHttpError(error);
        });
    }
    getMyUserInfo() {
        return this.getUserInfo(this.myUserId);
    }
    /**
     * Create a user account in Affordable
     * @param user
     */
    registerUser(user) {
        return this.doPost(this.getBaseURL() + AUTH_EP, user, {
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => {
            this.setSessionToken(response.token);
            return response;
        });
    }
    getEmails(user) {
        return this.doPost(this.getBaseURL() + PROFILE_EP + "/get-emails", { username: user }).then((response) => {
            return response;
        });
    }
    twoFactor(token, imageid, secret) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/two-factor", {
            token: token,
            imageid: imageid,
            secret: secret
        }).then((response) => {
            return response;
        });
    }
    addTwoFactor(deviceName, username, email, randomString, timeStamp, secret) {
        return this.doPost(this.getBaseURL() + PROFILE_EP + "/add-two-factor", {
            DeviceName: deviceName,
            Username: username,
            Email: email,
            RandomString: randomString,
            TimeStamp: timeStamp,
            Secret: secret
        }).then((response) => {
            return response;
        });
    }
    removeTwoFactor(username, email) {
        return this.doPost(this.getBaseURL() + PROFILE_EP + "/remove-two-factor", {
            Username: username,
            Email: email
        }).then((response) => {
            return response;
        });
    }
    checkTwoFactorByAgainstUsername(username, token, googleAuthOpt) {
        console.log("GOOG: ", googleAuthOpt);
        return this.doPost(this.getBaseURL() + AUTH_EP + "/two-factor/username", {
            username: username,
            token: token,
            GoogleAuth: googleAuthOpt
        }).then((response) => {
            return response;
        });
    }
    getBalance(username, usertype) {
        return this.doPost(this.getBaseURL() + TRANSACTION + '/balance', {
            username: username,
            usertype: usertype
        }).then((response) => {
            return response;
        });
    }
    exchangeTokens(token, account, username) {
        return this.doPost(this.getBaseURL() + STRIPE + '/exchangeTokens', {
            public_token: token,
            account_id: account,
            username: username
        }).then((response) => {
            return response;
        });
    }
    stripeSaveCard(username, tokenId, cardType, cardName) {
        return this.doPost(this.getBaseURL() + STRIPE + '/saveCard', {
            username: username,
            tokenId: tokenId,
            cardType: cardType,
            cardName: cardName
        }).then((response) => {
            return response;
        });
    }
    stripeGetSavedPaymentMethod(username, paymentType) {
        return this.doPost(this.getBaseURL() + STRIPE + '/getSavedPaymentMethod', {
            username: username,
            paymentType: paymentType
        }).then((response) => {
            return response;
        });
    }
    getApplications(status) {
        return this.doPost(this.getBaseURL() + APPLICATION + '/getApps', { status: status
        }).then((response) => {
            return response;
        });
    }
    fileUpload(data) {
        return this.doPost(this.getBaseURL() + FILE + '/upload', data).then((response) => {
            return response;
        });
    }
    fileDownload(data) {
        return this.doPost(this.getBaseURL() + FILE + '/download', data, { responseType: 'blob' }).then((response) => {
            console.log(response);
            return response;
        });
    }
    getAdminAwarded() {
        return this.doPost(this.getBaseURL() + TRANSACTION + '/adminAwarded', {}).then((response) => {
            return response;
        });
    }
    addApplication(username, covid, monthly, amount, fullName, story, file1, file2, file3, share) {
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
        return this.doPost(this.getBaseURL() + APPLICATION + '/addApp', body);
    }
    getDonations(username) {
        return this.doPost(this.getBaseURL() + TRANSACTION + '/donations', { username: username
        }).then((response) => {
            return response;
        });
    }
    getAwarded(username) {
        return this.doPost(this.getBaseURL() + TRANSACTION + '/awarded', { username: username
        }).then((response) => {
            return response;
        });
    }
    getDeposit(username, card) {
        if (card) {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/depositCard', { username: username
            }).then((response) => {
                return response;
            });
        }
        else {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/depositBank', { username: username
            }).then((response) => {
                return response;
            });
        }
    }
    getWithdraw(username, usertype, card) {
        if (card) {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/withdrawCard', { username: username, usertype: usertype
            }).then((response) => {
                return response;
            });
        }
        else {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/withdrawBank', { username: username, usertype: usertype
            }).then((response) => {
                return response;
            });
        }
    }
    getPaymentMethod(username, card, connected) {
        if (card) {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/cards', { username: username
            }).then((response) => {
                return response;
            });
        }
        else if (connected) {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/connectedBanks', { username: username
            }).then((response) => {
                return response;
            });
        }
        else {
            return this.doPost(this.getBaseURL() + TRANSACTION + '/banks', { username: username
            }).then((response) => {
                return response;
            });
        }
    }
    removePaymentMethod(username, type, name, usertype) {
        if (type === 'Bank') {
            return this.doPost(this.getBaseURL() + STRIPE + '/removeBank', { username: username, nickname: name, usertype: usertype
            }).then((response) => {
                return response;
            });
        }
        else {
            return this.doPost(this.getBaseURL() + STRIPE + '/removeCard', { username: username, type: type, name: name
            }).then((response) => {
                return response;
            });
        }
    }
    awardHUG(HUGID, username, amount, email) {
        return this.doPost(this.getBaseURL() + STRIPE + '/transferFundFromHUGToRecipient', {
            HUGID: HUGID,
            recipientID: username,
            amount: amount,
            email: email
        }).then((response) => {
            return response;
        });
    }
    rejectApplicant(HUGID, username, email) {
        return this.doPost(this.getBaseURL() + STRIPE + '/rejectRecipient', {
            HUGID: HUGID,
            username: username,
            email: email
        }).then((response) => {
            return response;
        }).catch((error) => {
            console.log("502 by Rejection");
            return { sucess: "Updated Awarded status" };
        });
    }
    getStripeAccountID(username, usertype) {
        return this.doPost(this.getBaseURL() + STRIPE + '/getCustomAccountID', { username: username, usertype: usertype
        }).then((response) => {
            return response;
        });
    }
    getConnectedRequirements(username, usertype, accountID) {
        return this.doPost(this.getBaseURL() + STRIPE + '/checkConnectRequirements', { username: username, usertype: usertype, accountID: accountID
        }).then((response) => {
            return response;
        });
    }
    getStripeAccountBalance(username, usertype, accountID) {
        return this.doPost(this.getBaseURL() + STRIPE + '/getAccountBalance', { username: username, usertype: usertype, accountID: accountID
        }).then((response) => {
            return response;
        });
    }
    onboardingInfoReq(username, usertype, accountID, url) {
        return this.doPost(this.getBaseURL() + STRIPE + '/onboardingInfoRequest', { username: username, usertype: usertype, accountID: accountID,
            successURL: url, failureURL: url
        }).then((response) => {
            return response;
        });
    }
    donateToHug(username, HUGName, amount) {
        return this.doPost(this.getBaseURL() + STRIPE + '/transferFundFromDonorToHUG', { username: username, HUGName: HUGName, amount: amount
        }).then((response) => {
            return response;
        });
    }
    stripeDeposit(username, type, method, beforetax, afterTax, stripeFee, fee) {
        return this.doPost(this.getBaseURL() + STRIPE + '/deposit', {
            username: username,
            paymentType: type,
            paymentMethod: method,
            amountToCharge: beforetax,
            amountToDeposit: afterTax,
            stripeFee: stripeFee,
            managementFee: fee
        }).then((response) => {
            return response;
        });
    }
    getTransactionStatus(username, chargeID, type) {
        return this.doPost(this.getBaseURL() + TRANSACTION + '/depositStatus', { username: username, chargeID: chargeID
        }).then((response) => {
            return response;
        });
    }
    getCustomBank(data) {
        return this.doPost(this.getBaseURL() + STRIPE + '/getCustomBank', data).then((response) => {
            return response;
        });
    }
    stripeTransfer(data) {
        return this.doPost(this.getBaseURL() + STRIPE + '/transfer', data).then((response) => {
            return response;
        });
    }
    stripePayout(data, update) {
        if (update) {
            return this.doPost(this.getBaseURL() + STRIPE + '/payoutUpdateTable', data).then((response) => {
                return response;
            });
        }
        else {
            return this.doPost(this.getBaseURL() + STRIPE + '/payout', data).then((response) => {
                return response;
            });
        }
    }
    attachBankToCustomer(data, account) {
        if (account === true) {
            return this.doPost(this.getBaseURL() + STRIPE + '/attachBankToCustomAccount', data).then((response) => {
                return response;
            });
        }
        else {
            return this.doPost(this.getBaseURL() + STRIPE + '/attachBankToCustomer', data).then((response) => {
                return response;
            });
        }
    }
    addBankToCustomTable(data) {
        return this.doPost(this.getBaseURL() + STRIPE + '/addBankToCustomTable', data).then((response) => {
            return response;
        });
    }
    login(username, password) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/login", {
            username: username,
            password: password
        }, {
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => {
            console.log(response);
            if (typeof response.userInfo !== "undefined") { // Check if return type is LoginResponse
                this.setSessionToken(response.token);
                return response;
            }
            else {
                return response;
            }
        });
    }
    /**
     * Retrieve a user's UserInfo
     * @param userId: the user's unique id
     */
    getUserInfo(userId) {
        return this.doGet(this.getBaseURL() + PROFILE_EP + `/${userId}/userInfo`);
    }
    /**
     * Changes a user's password in Affordable
     * @param oldPassword
     * @param newPassword
     */
    changePassword(oldPassword, newPassword) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/change-password", {
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    }
    /**
     * Sends an email to the user providing their username and
     * gives a link allowing them to change their password
     * @param email
     */
    forgotUserNameOrPassword(email) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/forgot-password", {
            email: email
        });
    }
    /**
     * Resets the user's password from the email sent to them
     * @param email
     */
    resetPassword(password, code) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/reset-password", {
            password: password,
            code: code
        });
    }
    /**
     * Creates a user profile in Affordable
     * @param profile
     */
    createProfile(profile) {
        return this.doPost(this.getBaseURL() + PROFILE_EP, { profile: profile });
    }
    /**
     * Gets whether a user has verified their email in Affordable
     * @param userId
     */
    getEmailVer() {
        return this.doGet(this.getBaseURL() + AUTH_EP + "/get-verification");
    }
    /**
     * Gets a user profile in Affordable
     * @param userId
     */
    getProfile(userId) {
        return this.doGet(this.getBaseURL() + PROFILE_EP, { userId: userId });
    }
    /**
     * Deletes a user profile in Affordable
     * @param profile
     */
    deleteProfile(userId) {
        return this.doDelete(this.getBaseURL() + PROFILE_EP, { userId: userId });
    }
    /**
     * Gets the primary email address of a user in Affordable
     * @param profile
     */
    getPrimaryEmail(username) {
        return axios_1.default.get(this.getBaseURL() + PROFILE_EP + "/get-primary-email", {
            params: { username: username },
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.data)
            .catch((error) => {
            throw new AffordableHttpError(error);
        });
    }
    /**
     * Updates the primary email address of a user in Affordable
     * @param
     */
    updatePrimaryEmail(newEmail) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/email/update", {
            email: newEmail
        });
    }
    /**
     * Create an organization
     * @param organization
     * @returns the organization
     */
    createOrganization(organization) {
        return this.doPost(this.getBaseURL() + ORGANIZATION_EP, organization);
    }
    /**
     * Update an organization
     * @param organization
     * @returns the organization
     */
    updateOrganization(organization) {
        return this.doPost(this.getBaseURL() + ORGANIZATION_EP + `/${organization.id}`, organization);
    }
    /**
     * Get an organization in Affordable
     * @param organizationId
     */
    getOrganization(organizationId) {
        return this.doGet(this.getBaseURL() + ORGANIZATION_EP + `/${organizationId}`);
    }
    /**
     * Get the API key for an organization in Affordable
     * @param organizationId
     */
    getApiKey(organizationId) {
        return this.doGet(this.getBaseURL() + ORGANIZATION_EP + `/${organizationId}/apiKey`);
    }
    /**
     * Get the API key for an organization in Affordable
     * @param profile
     */
    getOrganizationsForUser(userId) {
        return this.doGet(this.getBaseURL() + PROFILE_EP + `/${userId}/organizations`);
    }
    /**
     * Add a user to an organization
     * @param request
     */
    addUserToOrganization(request) {
        return this.doPost(this.getBaseURL() + ORGANIZATION_EP + `/${request.organizationId}/members`, request);
    }
    /**
     * Remove a user from an organization
     * @param organizationId
     * @param userId
     */
    removeMemberFromOrganization(organizationId, userId) {
        return this.doDelete(this.getBaseURL() + ORGANIZATION_EP + `/${organizationId}/members/${userId}`);
    }
    /**
     * Create a Health Utilizing Grant
     * @param grant
     */
    createGrant(grant) {
        return this.doPost(this.getBaseURL() + GRANT_EP, grant);
    }
    /**
     * Update a Health Utilizing Grant
     * @param grant
     */
    updateGrant(grant) {
        return this.doPut(this.getBaseURL() + GRANT_EP + `/${grant.id}`, grant);
    }
    /**
     * Get a Health Utilizing Grant
     * @param id
     */
    getGrant(id) {
        return this.doGet(this.getBaseURL() + GRANT_EP + `/${id}`);
    }
    /**
     * Delete a Health Utilizing Grant
     * @param id
     */
    deleteGrant(id) {
        return this.doDelete(this.getBaseURL() + GRANT_EP + `/${id}`);
    }
    /**
     * Get the list of grants that the user is eligible for
     */
    getEligibleGrants() {
        return this.doGet(this.getBaseURL() + GRANT_EP);
    }
    /**
     * Get the list of applicants for a grant that the user has permission to manage
     */
    getGrantApplicants(id) {
        return this.doGet(this.getBaseURL() + GRANT_EP + `/${id}/applicants`);
    }
    /**
     * Apply to a grant, if you are an eligible recipient.
     */
    applyToGrant(id) {
        return this.doPut(this.getBaseURL() + GRANT_EP + `/${id}/apply`, {});
    }
    /**
     * Award a grant to a user that has applied for a grant, if you belong to the organization that manages the grant.
     * @param userId
     * @param grantId
     */
    awardGrantToUser(userId, grantId) {
        return this.doPut(this.getBaseURL() + GRANT_EP + `/${grantId}/award/${userId}`, {});
    }
    addActivity(request) {
        return this.doPost(this.getBaseURL() + ACTIVITY_EP + "/add-activity", request).then((response) => {
            return response;
        });
    }
    deleteEmail(request) {
        return this.doPost(this.getBaseURL() + PROFILE_EP + "/delete-email", request).then((response) => {
            return response;
        });
    }
    checkEmail(request) {
        return this.doPost(this.getBaseURL() + AUTH_EP + "/email", request).then((response) => {
            return response;
        });
    }
    /**
     *
     * rest of this class is newly created API routes for AUTUMN 2020
     *
     */
    stripeCustomer(id, name, email) {
        return this.doPost(this.getBaseURL() + STRIPE + '/customer', {
            id: id,
            name: name,
            email: email,
        }).then((response) => {
            return response;
        });
    }
    stripeAddBank(id) {
        return this.doPost(this.getBaseURL() + STRIPE + '/addBank', {
            id: id
        }).then((response) => {
            console.log("ENTERING ADD BANK");
            return response;
        });
    }
}
exports.AffordableClient = AffordableClient;
class AffordableHttpError extends Error {
    constructor(error) {
        super(error.message + ": " + error.response.data.error);
        this.responseStatus = error.response.status;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AffordableHttpError.prototype);
    }
}
exports.AffordableHttpError = AffordableHttpError;
