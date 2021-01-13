import * as AWS from "aws-sdk";
import {config} from "dotenv";
import {createTransport, SendMailOptions, SentMessageInfo} from "nodemailer";
import {AffordableEmailClient} from "./AffordableEmailClient";
import Mail = require("nodemailer/lib/mailer");
import {appendFile} from "fs";
import tmp from "tmp";
config();

export class AffordableSESClient implements AffordableEmailClient {
    private transporter: Mail;
    // Do not permit instantiation
    private constructor() {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === "false") {
            console.log("Email is disabled.");
            return;
        }

        var creds = new AWS.Credentials({
            accessKeyId: process.env.AFFORDABLE_SES_KEY_ID,
            secretAccessKey: process.env.AFFORDABLE_SES_KEY_SECRET
        });

        AWS.config.credentials = creds;
        AWS.config.region = process.env.AFFORDABLE_SES_REGION;

        this.transporter = createTransport({
            SES: new AWS.SES({
                apiVersion: "2010-12-01"
            }),
            sendingRate: 1 // max 1 messages/second
        });


    }
    private static instance = new AffordableSESClient();

    public static getInstance = () => AffordableSESClient.instance;

    sendEmail(opts: SendMailOptions): void {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === "false") {
            console.log("Email is disabled.");
            tmp.file({postfix: ".html"}, (err, path) => {
                appendFile(path, opts.html, () => {});
                console.log("Wrote email to " + path);
            });
            return;
        }

        this.transporter.verify(function (err, success) {
            if (err) {
                console.log(err);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        console.log(`Sending email via SES to ${opts.to}`);
        this.transporter.sendMail(opts,
            (err, info: SentMessageInfo) => {
                if (err) {
                    console.log(err);
                }
            }
        );
    }

}
