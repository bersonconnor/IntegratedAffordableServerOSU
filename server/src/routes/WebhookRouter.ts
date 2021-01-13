import { WebhookService } from "../services/WebhookService";
import { errorHandler } from "./ErrorHandler";
import bodyParser from 'body-parser';
import db from "../database/DatabaseConnection";
import AuthenticationRouter from "./AuthenticationRouter";

const connectionPool = db.getInstance()
const webhook = require('express').Router();
const service = WebhookService.getInstance();

webhook.use(AuthenticationRouter.verifyToken);

webhook.post('/', (request, response) => {
    let event;

    try {
        event = request.body
    } catch (err) {
        console.log("fricking error")
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    console.log("starting switch");
    switch (event.type) {
        case 'transfer.created':
            const transfer = event.data.object;
            //console.log(transfer)
            if (transfer.destination === process.env.AFFORDABLE_PAYOUT_ACCOUNT) {
                response.status(200)
            } else {
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
                } else {
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
                } else {
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
    response.json({received: true});
  });






webhook.use(errorHandler);
module.exports = webhook;
