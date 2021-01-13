import { CreateUserRequest, UserInfo, LoginRequest, LoginResponse, ChangePasswordReq } from "affordable-shared-models";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../services/AuthenticationService";
import { AuthenticationServiceImpl } from "../services/AuthenticationServiceImpl";
import jsonwebtoken from "jsonwebtoken";
import { config } from "dotenv";
config();



export class AuthenticationController {

    authNService: AuthenticationService;

    // TODO: Consider DI
    public constructor(authenticationService?: AuthenticationService) {
        this.authNService = authenticationService ?? new AuthenticationServiceImpl();

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
    public async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user: CreateUserRequest = req.body as CreateUserRequest;
        const promise = this.authNService.registerUser(user);
        promise.then((loginRes: LoginResponse) => {
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
    public changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const changePassReq: ChangePasswordReq = new ChangePasswordReq();
        changePassReq.oldPassword = oldPassword;
        changePassReq.newPassword = newPassword;
        const promise = this.authNService.changePassword(res.locals.userInfo, changePassReq);
        promise.then(() => {
            res.send(200);
        }).catch(error => {
            next(error);
        })
        return;
    }
    
    /**
     * Resets a user's password in Affordable
     * @param req Express request object
     * @param res Express response object
     * @param next Express next function
     */
    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const newPassword = req.body.password;
        const code = req.body.code;
        console.log("In controller reset password")
        try {
            await this.authNService.resetPassword(newPassword, code);
            res.sendStatus(200);
        } catch (error) {
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
    public async accountCanBeCreatedWithEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        const email: string = req.body.email;
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
    public async validateLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("validating login...");
        const username: string = req.body.username;
        const password: string = req.body.password;
        console.log("Login attempt for: " + username);
        const loginReq = new LoginRequest();
        loginReq.username = username;
        loginReq.password = password;
        this.authNService.validateLogin(loginReq)
            .then((loginRes: any) => {
                console.log(loginRes)
                if (typeof loginRes.userInfo !== 'undefined') { // Check if return type is LoginResponse
                    res.status(200)
                    .cookie("affordable.session.token", loginRes.token, {
                        httpOnly: false,
                        // sameSite: "strict",
                        // secure: true,
                        maxAge: 60 * 60 * 8 // 8 hours
                    })
                    .send(loginRes);
                } else if (typeof loginRes.isValidUsername !== 'undefined') { // Check if return type is InvalidLoginResponse
                    res.status(200).send(loginRes);
                } else {
                    res.status(500).send();
                }
                
            }).catch(error =>
                next(error)
            );
    }

    /**
     * Middleware for validating a JSON web token, and refreshing it
     * @param req
     * @param res
     * @param next
     */
    async verifyUser(req: Partial<Request>, res: Response, next: NextFunction) {
        // Get auth header value
        const bearerHeader = req.headers["authorization"];
        // Check if bearer is undefined
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1]; // getting the actual token
            // now verify the token
            jsonwebtoken.verify(bearerToken,
                process.env.AFFORDABLE_TOKEN_SIGNING_KEY,
                async (err, obj) => { // obj is the payload or data being held in the jwt
                    if (!err) {
                        const userInfo = JSON.parse((obj as AffordableJwt).sub) as UserInfo;
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

        } else {
            console.log("User is unauthorized");
            if (process.env.REQUIRE_JWT_VERIFICATION == "true") {
                res.status(401).send();
            } else {
                next();
            }
        }
    }
}

interface AffordableJwt {
    sub: string;
}

