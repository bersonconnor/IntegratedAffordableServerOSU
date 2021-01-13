"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffordableSESClient = void 0;
const AWS = __importStar(require("aws-sdk"));
const dotenv_1 = require("dotenv");
const nodemailer_1 = require("nodemailer");
const fs_1 = require("fs");
const tmp_1 = __importDefault(require("tmp"));
dotenv_1.config();
class AffordableSESClient {
    // Do not permit instantiation
    constructor() {
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
        this.transporter = nodemailer_1.createTransport({
            SES: new AWS.SES({
                apiVersion: "2010-12-01"
            }),
            sendingRate: 1 // max 1 messages/second
        });
    }
    sendEmail(opts) {
        if (process.env.AFFORDABLE_EMAIL_ENABLED === "false") {
            console.log("Email is disabled.");
            tmp_1.default.file({ postfix: ".html" }, (err, path) => {
                fs_1.appendFile(path, opts.html, () => { });
                console.log("Wrote email to " + path);
            });
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
        console.log(`Sending email via SES to ${opts.to}`);
        this.transporter.sendMail(opts, (err, info) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
exports.AffordableSESClient = AffordableSESClient;
AffordableSESClient.instance = new AffordableSESClient();
AffordableSESClient.getInstance = () => AffordableSESClient.instance;
