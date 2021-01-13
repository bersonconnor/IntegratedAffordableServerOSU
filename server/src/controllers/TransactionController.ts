import { TransactionService } from "../services/TransactionService";


export class TransactionController {

    private transactionService: TransactionService;

    public constructor(profileService?) {
        this.transactionService = TransactionService.getInstance();
    }




}