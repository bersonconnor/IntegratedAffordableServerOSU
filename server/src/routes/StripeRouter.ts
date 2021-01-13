import { StripeService } from "../services/StripeService";
import { errorHandler } from "./ErrorHandler";

import AuthenticationRouter from "./AuthenticationRouter";

const service = StripeService.getInstance();
const stripe = require('express').Router();

stripe.use(AuthenticationRouter.verifyToken);
/**
* @api {post} /post-customer
* @apiName customer
* @apiGroup Stripe
*
* @apiParam {Object} req HTTP request object.
* @apiParam {Object} res HTTP response object.
*
* @apiSuccess {String} res_status Response Status set to 'OK'.
*/
stripe.post('/customer', service.postCustomer);



/**
 * @api {post} /post-addBank
 * @apiName addBank
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/bank', service.postBank);


/**
 * 
 * 
 * 
 * 
 * 
 * --------------------BELOW THIS UNSURE WHAT IS USED OR NOT!
 * 
 * 
 * 
 * 
 */


/**
 * @api {get} /get-timestamp Retrieve timestamp from Last Login
 * @apiName saveCard
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/saveCard', service.saveCard);

/**
 * @api {get} /get-getSavedPaymentMethod
 * @apiName getSavedPaymentMethod
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/getSavedPaymentMethod', service.getSavedPaymentMethod);




/**
 * @api {post} /post-deposit
 * @apiName deposit
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/deposit', service.deposit);

/**
 * @api {get} /get-getAccountBalance
 * @apiName getAccountBalance
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
**/
stripe.post('/getAccountBalance', service.getAccountBalance);


/**
 * @api {get} /get-transferFundFromHUGToRecipient
 * @apiName transferFundFromHUGToRecipient
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/transferFundFromHUGToRecipient', service.transferFundFromHUGToRecipient);

/**
 * @api {get} /get-transferFundFromDonorToHUG
 * @apiName transferFundFromDonorToHUG
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/transferFundFromDonorToHUG', service.transferFundFromDonorToHUG);

/**
 * @api {get} /get-getOwnedHugs
 * @apiName getOwnedHugs
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/getOwnedHugs', service.getOwnedHugs);

/**
 * @api {get} /get-getHUG
 * @apiName getHUG
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/getHUG', service.getHUG);

/**
 * @api {get} /get-getAllHUGs
 * @apiName getAllHUGs
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.get('/getAllHUGs', service.getAllHUGs);

/**
 * @api {get} /get-getRecipientAppliedHUGs
 * @apiName getRecipientAppliedHUGs
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/getRecipientAppliedHUGs', service.getRecipientAppliedHUGs);

/**
 * @api {post} /get-makeHUG
 * @apiName makeHUG
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/makeHUG', service.makeHUG);

/**
 * @api {get} /get-attachBankToCustomAccount
 * @apiName attachBankToCustomAccount
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/attachBankToCustomAccount', service.attachBankToCustomAccount);

/**
 * @api {get} /get-exchangeTokens
 * @apiName exchangeTokens
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/exchangeTokens', service.exchangeTokens);

/**
 * @api {get} /get-attachBankToCustomer
 * @apiName attachBankToCustomer
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post('/attachBankToCustomer', service.attachBankToCustomer);

/**
 * @api {get} /get-timestamp Retrieve timestamp from Last Login
 * @apiName addBankToCustomTable
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/addBankToCustomTable", service.addBankToCustomTable);

stripe.post('/removeCard', service.removeCard);

stripe.post('/removeBank', service.removeBank);

stripe.post('/applyHUG', service.applyToHug);

stripe.post('/rejectRecipient', service.rejectRecipient);

/**
 * @api {get} /get-timestamp Retrieve timestamp from Last Login
 * @apiName getCustomAccountID
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/getCustomAccountID", service.getCustomAccountID);

/**
 * @api {get} /get-timestamp Retrieve timestamp from Last Login
 * @apiName checkConnectedRequirements
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/checkConnectRequirements", service.checkConnectRequirements);

/**
 * @api {get} /get-timestamp Retrieve timestamp from Last Login
 * @apiName onboardingInfoRequest
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/onboardingInfoRequest", service.onboardingInfoRequest);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName onboardingInfoRequest
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/getHUGApplicants", service.getHUGApplicants);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName getCustomBank
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/getCustomBank", service.getCustomBank);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName transfer
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/transfer", service.transfer);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName payout
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/payout", service.payout);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName payoutUpdateTable
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/payoutUpdateTable", service.payoutUpdateTable);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName payoutUpdateFee
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/payoutUpdateFee", service.payoutUpdateFee);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName updateRecipientBalance
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/updateRecipientBalance", service.updateRecipientBalance);

/**
 * @api {post} /post-getHUGApplicants
 * @apiName affordablePayoutFee
 * @apiGroup Stripe
 *
 * @apiParam {Object} req HTTP request object.
 * @apiParam {Object} res HTTP response object.
 *
 * @apiSuccess {String} res_status Response Status set to 'OK'.
 */
stripe.post("/affordablePayoutFee", service.affordablePayoutFee);


stripe.use(errorHandler);

module.exports = stripe;
