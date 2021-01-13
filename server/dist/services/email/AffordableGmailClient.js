"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffordableGmailClient = void 0;
const nodemailer_1 = require("nodemailer");
// TODO: AffordableEmailService should be an interface
// Gmail, SES, and perhaps a local file writer should be implementations
class AffordableGmailClient {
    // Do not permit instantiation
    constructor() {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === 'false') {
            console.log("Email is disabled.");
            return;
        }
        this.transporter = nodemailer_1.createTransport({
            service: 'gmail',
            auth: {
                user: 'Neweruser4@gmail.com',
                pass: 'testaccount1!​'
            }
        });
    }
    sendEmail(opts) {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === 'false') {
            console.log("Email is disabled.");
            console.log(opts);
            return;
        }
        this.transporter.verify(function (err, success) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Server is ready to take our messages");
            }
        });
        this.transporter.sendMail(opts, (err, info) => {
            if (err) {
                console.log(err);
            }
            console.log(info.envelope);
            console.log(info.messageId);
        });
    }
}
exports.AffordableGmailClient = AffordableGmailClient;
AffordableGmailClient.instance = new AffordableGmailClient();
AffordableGmailClient.getInstance = () => AffordableGmailClient.instance;
