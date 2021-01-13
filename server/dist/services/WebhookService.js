"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const connectionPool = DatabaseConnection_1.default.getInstance();
const dotenv_1 = require("dotenv");
dotenv_1.config();
const bodyParser = require('body-parser');
const moment = require("moment");
class WebhookService {
    constructor() {
        this.transferComplete = async (transfer) => {
            const transferID = transfer.id;
            const destAcc = transfer.destination;
            const amount = (parseFloat(transfer.amount) / 100); //default Stripe unit is cents, not dollars
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const getUserID = `SELECT recipientID
      FROM StripeRecipient
      WHERE stripeID = ?
    `;
            const updateBalance = `UPDATE StripeRecipient SET Balance=Balance - ? 
      WHERE recipientID = ? 
    `;
            const check = 'SELECT * FROM externalTransactions WHERE chargeID = ?';
            const insertTxn = 'INSERT INTO externaltransactions (userID, paymentMethodID, chargeID, transactionType, Amount, Status, creationTimestamp, clearedTimestamp) VALUES (?,?,?,?,?,?,?,?)';
            const updateTxn = 'UPDATE externaltransactions SET userID = ?, transactionType = ?, Amount = ?, Status = ?, clearedTimestamp = ? WHERE chargeID = ?';
            connectionPool.query(getUserID, [destAcc], (error, results, fields) => {
                if (error) {
                    console.error(error);
                }
                else {
                    //console.log("DDDDDDDDDDDDDDDDDDDD")
                    console.log(transferID);
                    //console.log(results)
                    if (results[0] !== undefined && results[0].recipientID !== undefined) {
                        const recipientID = results[0].recipientID;
                        connectionPool.query(updateBalance, [amount, recipientID], (error, results, fields) => {
                            if (error) {
                                console.error(error);
                            }
                            else {
                                connectionPool.query(check, [transferID], (error, results2, fields) => {
                                    if (error) {
                                        console.error(error);
                                    }
                                    else {
                                        if (results2[0] === undefined || results2[0].userID === undefined) {
                                            connectionPool.query(insertTxn, [recipientID, "temp", transferID, "Recipient Withdrawal", amount, "Cleared", date, date], (error, results, fields) => {
                                                if (error) {
                                                    console.error(error);
                                                }
                                                console.log("inserting txn");
                                            });
                                        }
                                        else {
                                            connectionPool.query(updateTxn, [recipientID, "Recipient Withdrawal", amount, "Cleared", date, transferID], (error, results, fields) => {
                                                if (error) {
                                                    console.error(error);
                                                }
                                                console.log("updating txn");
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        };
        /*
        public payoutPaid = async (transfer) => {
      
          
          //console.log(payout);
          const payoutID = transfer.id;
          const amount = (parseFloat(transfer.amount) / 100); //default Stripe unit is cents, not dollars
      
          const getUserID = 'SELECT userID FROM ExternalTransactions WHERE chargeID = ?'
          const getStripeID = 'SELECT stripeID FROM StripeRecipient WHERE recipientID = ?'
          const updateBalance = 'UPDATE StripeRecipient SET Balance= Balance - ? WHERE recipientID='
          const updateTxn = 'UPDATE ExternalTransactions SET Status = "Cleared" where chargeID = ?;';
          const updateFee = 'UPDATE Fee SET status=? where transactionID=?';
          
          connectionPool.query(getUserID, [payoutID], (error, results, fields) => {
            if (error) {
              console.error(error);
            } else {
             
      
              const recipID = results[0].userID;
              connectionPool.query(getStripeID, [recipID], (error, results, fields) => {
                if (error) {
                  console.error(error);
                } else {
                  
      
                  const stripeID = results[0].stripeID;
                  connectionPool.query(updateTxn, [payoutID], (error, results, fields) => {
                    if (error) {
                      console.error(error);
                    } else {
      
      
                      connectionPool.query(updateBalance, [amount, recipID], (error, results, fields) => {
                        if (error) {
                          console.error(error);
                        } else {
                          
                          
      
                          // get Transaction
                          const getTransaction = 'Select *  From ExternalTransactions where chargeID=?';
                          connectionPool.query(getTransaction, [payoutID], (error, results, fields) => {
                            if (error) {
                              console.log(error);
                            } else {
                              if(results.length == 0) {
                                console.log("No External Transaction Found");
                                return;
                              }
                              var transactionID=results[0].externalTransactionID;
                              console.log("Transaction Cleared");
                              connectionPool.query(updateFee, ['Cleared',transactionID], (error, results, fields) => {
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log("Fee Cleared");
                                }
                              });
                            }
                          });
                        }
                      });
      
                    }
                  });
                }
              });
            }
          });
        }
        */
        this.chargeFailed = async (pending) => {
            const chargeID = pending.data.object.id;
            const amount = parseFloat(pending.data.object.amount) / 100; //default Stripe unit is cents, not dollars
            const customerID = pending.data.object.customer;
            const updateTxn = 'UPDATE ExternalTransactions SET Status = "Failed" where chargeID = ?;';
            const findTxn = 'Select status from ExternalTransactions where chargeID = ?;';
            connectionPool.query(findTxn, [chargeID], (error, results, fields) => {
                if (error) {
                    console.error(error);
                }
                else {
                    const status = results[0].Status;
                    if (status == 'Pending') {
                        const updateBalance = 'UPDATE StripeDonor SET pendingBalance= pendingBalance - ? WHERE stripeID=?;';
                        connectionPool.query(updateBalance, [amount, customerID], (error, results, fields) => {
                            if (error) {
                                console.error(error);
                            }
                            else {
                                connectionPool.query(updateTxn, [chargeID], (error, results, fields) => {
                                    if (error) {
                                        console.error(error);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        connectionPool.query(updateTxn, [chargeID], (error, results, fields) => {
                            if (error) {
                                console.error(error);
                            }
                        });
                    }
                }
            });
        };
        this.chargePending = async (pending) => {
            const chargeID = pending.data.object.id;
            const amount = parseFloat(pending.data.object.amount) / 100; //default Stripe unit is cents, not dollars
            const customerID = pending.data.object.customer;
            //set status to pending in externaltransaction table
            const updateTxn = 'UPDATE ExternalTransactions SET Status = "Pending" where chargeID = ?;';
            //add pending balance for donor
            const updateBalance = 'UPDATE StripeDonor SET pendingBalance= pendingBalance + ? WHERE stripeID=?;';
            connectionPool.query(updateTxn, [chargeID], (error, results, fields) => {
                if (error) {
                    console.error(error);
                }
                else {
                    connectionPool.query(updateBalance, [amount - (amount * 0.008) - (amount * 0.025), customerID], (error, results, fields) => {
                        if (error) {
                            console.error(error);
                        }
                        else {
                            console.log("balance updated");
                        }
                    });
                }
            });
        };
        this.chargeSucceeded = async (charge) => {
            const chargeID = charge.data.object.id;
            const amount = parseFloat(charge.data.object.amount) / 100; //default Stripe unit is cents, not dollars
            const customerID = charge.data.object.customer;
            const paymentType = charge.data.object.payment_method_details.type;
            var clearedTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            let fee;
            if (paymentType != "card") {
                fee = (amount * 0.008) + (amount * 0.025);
            }
            else {
                fee = (amount * 0.029) + (amount * 0.025) + 0.5;
            }
            //set status to cleared in externaltransaction table
            const updateTxn = 'UPDATE ExternalTransactions SET Status = "Cleared" where chargeID = ?;';
            // add clearedTimestamp on externaltransaction table
            const updateClearedTimeStamp = 'UPDATE ExternalTransactions SET clearedTimestamp = ? where chargeID = ?;';
            //update Fee status
            const updateFee = 'UPDATE Fee SET status=? where transactionID=?';
            // get Transaction
            const getTransaction = 'Select * From ExternalTransactions where chargeID=?';
            connectionPool.query(getTransaction, [chargeID], (error, results, fields) => {
                if (error) {
                    console.error(error);
                }
                else {
                    if (results != undefined && results.length > 0) {
                        const prevStatus = results[0].Status;
                        if (prevStatus != "Initiated") {
                            //move balance from pendingBalance to Balance
                            const updateBalance = 'UPDATE StripeDonor SET pendingBalance= pendingBalance - ?, Balance= Balance + ? WHERE stripeID=?;';
                            connectionPool.query(updateTxn, [chargeID], (error, results, fields) => {
                                if (error) {
                                    console.error(error);
                                }
                                else {
                                    connectionPool.query(updateBalance, [amount - fee, amount - fee, customerID], (error, results, fields) => {
                                        if (error) {
                                            console.error(error);
                                        }
                                        else {
                                            console.log("balance updated");
                                            connectionPool.query(updateClearedTimeStamp, [clearedTimestamp, chargeID], (error, results, fields) => {
                                                if (error) {
                                                    console.log(error);
                                                }
                                                else {
                                                    console.log("ClearedTImeStamp added to externalTransaction table");
                                                    connectionPool.query(getTransaction, [chargeID], (error, results, fields) => {
                                                        if (error) {
                                                            console.log(error);
                                                        }
                                                        else {
                                                            if (results.length > 0 && results[0].externalTransactionID != undefined) {
                                                                var transactionID = results[0].externalTransactionID;
                                                                console.log("Transaction Cleared");
                                                                connectionPool.query(updateFee, ['Cleared', transactionID], (error, results, fields) => {
                                                                    if (error) {
                                                                        console.log(error);
                                                                    }
                                                                    else {
                                                                        console.log("Fee Cleared");
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            //move balance from pendingBalance to Balance
                            const updateBalance = 'UPDATE StripeDonor SET Balance= Balance + ? WHERE stripeID=?;';
                            connectionPool.query(updateTxn, [chargeID], (error, results, fields) => {
                                if (error) {
                                    console.error(error);
                                }
                                else {
                                    connectionPool.query(updateBalance, [amount - fee, customerID], (error, results, fields) => {
                                        if (error) {
                                            console.error(error);
                                        }
                                        else {
                                            console.log("balance updated");
                                            connectionPool.query(updateClearedTimeStamp, [clearedTimestamp, chargeID], (error, results, fields) => {
                                                if (error) {
                                                    console.log(error);
                                                }
                                                else {
                                                    console.log("ClearedTImeStamp added to externalTransaction table");
                                                    connectionPool.query(getTransaction, [chargeID], (error, results, fields) => {
                                                        if (error) {
                                                            console.log(error);
                                                        }
                                                        else {
                                                            if (results.length > 0 && results[0].externalTransactionID != undefined) {
                                                                var transactionID = results[0].externalTransactionID;
                                                                console.log("Transaction Cleared");
                                                                connectionPool.query(updateFee, ['Cleared', transactionID], (error, results, fields) => {
                                                                    if (error) {
                                                                        console.log(error);
                                                                    }
                                                                    else {
                                                                        console.log("Fee Cleared");
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        };
    }
}
exports.WebhookService = WebhookService;
WebhookService.instance = new WebhookService();
WebhookService.getInstance = () => WebhookService.instance;
