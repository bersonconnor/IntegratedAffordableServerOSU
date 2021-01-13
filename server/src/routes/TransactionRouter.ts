import { TransactionService } from "../services/TransactionService";
import { errorHandler } from "./ErrorHandler";
import { TransactionController } from "../controllers/TransactionController";
import AuthenticationRouter from "./AuthenticationRouter";

const service = TransactionService.getInstance();
const controller = new TransactionController();
const transaction = require('express').Router();

transaction.use(AuthenticationRouter.verifyToken);


transaction.post('/balance', service.getBalance);
transaction.post('/donations', service.getDonationHistory);
transaction.post('/awarded', service.getAwardedHistory);
transaction.post('/depositCard', service.getCardDepositHistory);
transaction.post('/depositBank', service.getBankDepositHistory);
transaction.post('/withdrawCard', service.getCardWithdrawHistory);
transaction.post('/withdrawBank', service.getBankWithdrawHistory);
transaction.post('/cards', service.getCards);
transaction.post('/banks', service.getBanks);
transaction.post('/connectedBanks', service.getConnectedBanks);
transaction.post('/searchHugs', service.searchHUGS);
transaction.post('/support', service.supportEmail);
transaction.post('/depositStatus', service.getDepositStatus);
transaction.post('/adminAwarded', service.adminAwarded);

transaction.use(errorHandler);
module.exports = transaction;