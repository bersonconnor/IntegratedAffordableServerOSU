"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const TransactionService_1 = require("../services/TransactionService");
class TransactionController {
    constructor(profileService) {
        this.transactionService = TransactionService_1.TransactionService.getInstance();
    }
}
exports.TransactionController = TransactionController;
