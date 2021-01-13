"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebhookService_1 = require("../services/WebhookService");
const ErrorHandler_1 = require("./ErrorHandler");
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const connectionPool = DatabaseConnection_1.default.getInstance();
const webhook = require('express').Router();
const service = WebhookService_1.WebhookService.getInstance();
webhook.use(AuthenticationRouter_1.default.verifyToken);
webhook.post('/', (request, response) => {
    let event;
    try {
        event = request.body;
    }
    catch (err) {
        console.log("fricking error");
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    console.log("starting switch");
    switch (event.type) {
        case 'transfer.created':
            const transfer = event.data.object;
            //console.log(transfer)
            if (transfer.destination === process.env.AFFORDABLE_PAYOUT_ACCOUNT) {
                response.status(200);
            }
            else {
                service.transferComplete(transfer);
            }
            break;
        case 'charge.failed':
            const failed = event;
            service.chargeFailed(failed);
            break;
        case 'charge.pending':
            const pending = event;
            const customerID = event.customer;
            const getUser = 'SELECT donorID from StripeDonor WHERE stripeID=?';
            connectionPool.query(getUser, [customerID], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return response.status(502).end();
                }
                else {
                    service.chargePending(pending);
                    console.log('Txn moved to pending');
                }
            });
            break;
        case 'charge.succeeded':
            const charge = event;
            const chargeCustomerID = event.customer;
            const chargeGetUser = 'SELECT donorID from StripeDonor WHERE stripeID=?';
            connectionPool.query(chargeGetUser, [chargeCustomerID], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    return response.status(502).end();
                }
                else {
                    service.chargeSucceeded(charge);
                    console.log('Txn moved to cleared');
                }
            });
            break;
        // ... handle other event types
        default:
            // Unexpected event type
            return response.status(400).end();
    }
    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
});
webhook.use(ErrorHandler_1.errorHandler);
module.exports = webhook;
