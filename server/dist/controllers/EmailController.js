"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const EmailService_1 = require("../services/EmailService");
class EmailController {
    constructor(emailService) {
        this.checkEmailVerification = async (req, res, next) => {
            try {
                const userInfo = res.locals.userInfo;
                const isVerified = await this.emailService.isVerified(userInfo.id);
                res.status(200).send({ isVerified: isVerified });
            }
            catch (error) {
                next(error);
            }
        };
        this.updatePrimaryEmail = async (req, res, next) => {
            const email = req.body.email;
            const userInfo = res.locals.userInfo;
            try {
                await this.emailService.updateEmail(userInfo, email);
                res.send(200);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyEmail = async (req, res) => {
            //parse code from url
            const code = req.query.code;
            console.log("emailcontroller code: " + code);
            //get correct redirect url from emailService
            const redirectUrl = await this.emailService.verifyEmail(code);
            res.redirect(redirectUrl);
        };
        /**
         * called when the user forgets their username or password
         * this will send the user an email containing their username
         * and also a link at which they will be able to reset their password
         * */
        this.forgotPassword = async (req, res, next) => {
            const email = req.body.email;
            try {
                await this.emailService.sendResetPasswordEmail(email);
                res.send(200);
            }
            catch (error) {
                next(error);
            }
        };
        this.emailService = emailService !== null && emailService !== void 0 ? emailService : new EmailService_1.EmailService();
    }
}
exports.EmailController = EmailController;
