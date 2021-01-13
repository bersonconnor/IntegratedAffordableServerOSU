import {createTransport, SendMailOptions, SentMessageInfo} from "nodemailer";
import {AffordableEmailClient} from "./AffordableEmailClient";
import Mail = require("nodemailer/lib/mailer");

// TODO: AffordableEmailService should be an interface
// Gmail, SES, and perhaps a local file writer should be implementations
export class AffordableGmailClient implements AffordableEmailClient {
    private transporter: Mail;

    // Do not permit instantiation
    private constructor() {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === 'false') {
            console.log("Email is disabled.");
            return;
        }

        this.transporter = createTransport({
            service: 'gmail',
            auth: {
                user: 'Neweruser4@gmail.com',
                pass: 'testaccount1!​'
            }
        });
    }
    private static instance = new AffordableGmailClient();

    public static getInstance = () => AffordableGmailClient.instance;

    sendEmail(opts: SendMailOptions): void {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === 'false') {
            console.log("Email is disabled.");
            console.log(opts);
            return;
        }

        this.transporter.verify(function (err, success) {
            if (err) {
                console.log(err);
            } else {
                console.log("Server is ready to take our messages");
            }
        })

        this.transporter.sendMail(opts,
            (err, info: SentMessageInfo) => {
                if (err) {
                    console.log(err);
                }
                console.log(info.envelope);
                console.log(info.messageId);
            }
        );
    }
}
