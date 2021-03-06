"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransactionService_1 = require("../services/TransactionService");
const ErrorHandler_1 = require("./ErrorHandler");
const TransactionController_1 = require("../controllers/TransactionController");
const AuthenticationRouter_1 = __importDefault(require("./AuthenticationRouter"));
const service = TransactionService_1.TransactionService.getInstance();
const controller = new TransactionController_1.TransactionController();
const transaction = require('express').Router();
transaction.use(AuthenticationRouter_1.default.verifyToken);
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
transaction.use(ErrorHandler_1.errorHandler);
module.exports = transaction;
