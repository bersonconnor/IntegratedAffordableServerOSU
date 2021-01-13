"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const affordable_shared_models_1 = require("affordable-shared-models");
const AuthenticationServiceImpl_1 = require("../services/AuthenticationServiceImpl");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
class AuthenticationController {
    // TODO: Consider DI
    constructor(authenticationService) {
        this.authNService = authenticationService !== null && authenticationService !== void 0 ? authenticationService : new AuthenticationServiceImpl_1.AuthenticationServiceImpl();
        this.registerUser = this.registerUser.bind(this);
        this.accountCanBeCreatedWithEmail = this.accountCanBeCreatedWithEmail.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }
    /**
     * Register a user in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async registerUser(req, res, next) {
        const user = req.body;
        const promise = this.authNService.registerUser(user);
        promise.then((loginRes) => {
            res.status(200)
                .cookie("affordable.session.token", loginRes.token, {
                httpOnly: false,
                // sameSite: "strict",
                // secure: true,
                maxAge: 60 * 60 * 8 // 8 hours
            })
                .send(loginRes);
        }).catch(error => {
            next(error);
        });
    }
    /**
     * Changes a user's password in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    changePassword(req, res, next) {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const changePassReq = new affordable_shared_models_1.ChangePasswordReq();
        changePassReq.oldPassword = oldPassword;
        changePassReq.newPassword = newPassword;
        const promise = this.authNService.changePassword(res.locals.userInfo, changePassReq);
        promise.then(() => {
            res.send(200);
        }).catch(error => {
            next(error);
        });
        return;
    }
    /**
     * Resets a user's password in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async resetPassword(req, res, next) {
        const newPassword = req.body.password;
        const code = req.body.code;
        console.log("In controller reset password");
        try {
            await this.authNService.resetPassword(newPassword, code);
            res.sendStatus(200);
        }
        catch (error) {
            next(error);
        }
        return;
    }
    /**
     * Determines if an email address is unique in affordable. If true, an account can be created with that address
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async accountCanBeCreatedWithEmail(req, res, next) {
        const email = req.body.email;
        this.authNService.accountCanBeCreatedWithEmail(email)
            .then((val) => {
            res.status(200).send({ emailIsUnique: val });
        }).catch(error => {
            next(error);
        });
    }
    /**
     * Login attempt
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    async validateLogin(req, res, next) {
        console.log("validating login...");
        const username = req.body.username;
        const password = req.body.password;
        console.log("Login attempt for: " + username);
        const loginReq = new affordable_shared_models_1.LoginRequest();
        loginReq.username = username;
        loginReq.password = password;
        this.authNService.validateLogin(loginReq)
            .then((loginRes) => {
            console.log(loginRes);
            if (typeof loginRes.userInfo !== 'undefined') { // Check if return type is LoginResponse
                res.status(200)
                    .cookie("affordable.session.token", loginRes.token, {
                    httpOnly: false,
                    // sameSite: "strict",
                    // secure: true,
                    maxAge: 60 * 60 * 8 // 8 hours
                })
                    .send(loginRes);
            }
            else if (typeof loginRes.isValidUsername !== 'undefined') { // Check if return type is InvalidLoginResponse
                res.status(200).send(loginRes);
            }
            else {
                res.status(500).send();
            }
        }).catch(error => next(error));
    }
    /**
     * Middleware for validating a JSON web token, and refreshing it
     * @param req
     * @param res
     * @param next
     */
    async verifyUser(req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers["authorization"];
        // Check if bearer is undefined
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1]; // getting the actual token
            // now verify the token
            jsonwebtoken_1.default.verify(bearerToken, process.env.AFFORDABLE_TOKEN_SIGNING_KEY, async (err, obj) => {
                if (!err) {
                    const userInfo = JSON.parse(obj.sub);
                    res.locals.userInfo = userInfo;
                    // We get a new token because the user's info might have changed
                    const refreshed = await this.authNService.refreshToken(userInfo.username);
                    // Set the cookie. TODO: find a way to pass the token into JS, or create a refresh token endpoint
                    res.cookie("affordable.session.token", refreshed.token, {
                        httpOnly: false,
                        // sameSite: "strict",
                        // secure: true,
                        maxAge: 60 * 60 * 8 // 8 hours
                    });
                    res.locals.userInfo = refreshed.userInfo;
                }
                next();
            });
        }
        else {
            console.log("User is unauthorized");
            if (process.env.REQUIRE_JWT_VERIFICATION == "true") {
                res.status(401).send();
            }
            else {
                next();
            }
        }
    }
}
exports.AuthenticationController = AuthenticationController;
