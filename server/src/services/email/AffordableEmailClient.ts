import {SendMailOptions} from "nodemailer";

export interface AffordableEmailClient {
    sendEmail(opts: SendMailOptions): void;
}