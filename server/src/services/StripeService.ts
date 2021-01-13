"use strict";

import db from "../database/DatabaseConnection";
import {UserInfo, UserType} from "affordable-shared-models";
import {AffordableEmailClient} from "./email/AffordableEmailClient";
import {AffordableSESClient} from "./email/AffordableSESClient";
import * as utils from "../utils";

import Stripe from 'stripe'
import { send } from "process";

const moment = require("moment");

const connectionPool = db.getInstance()

const dotenv_1 = require("dotenv");
dotenv_1.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var plaid = require('plaid');

export class StripeService {

  private emailClient: AffordableEmailClient;

  private constructor() { 
    this.emailClient= AffordableSESClient.getInstance();
  }

  private static instance = new StripeService();

  public static getInstance = () => StripeService.instance;

  /*
  Description: function handles creating a new stripe customer and inserts the affordable 
  id and the customer id from the response body of stripe.customer.create()
  --> https://stripe.com/docs/api/customers/create
  */
  public postCustomer = (req, res) =>{
    stripe.customers.create({
      description: "Customer is associated with Affordable id = " + req.body.id,
      name: req.body.name,
      email: req.body.email
    },(err,customer) => {
      res.send(customer)
      if (err){
        console.log(err)
      }
      const sql = 'INSERT INTO UserStripe(userID, stripeCustomerID, epochTime) VALUES?;'  
      const values = [
        [
          req.body.id, //Affordable id
          customer.id, //customer id retrieved from response body
          new Date().getTime()
        ]
      ]
      connectionPool.query(sql, [values], (error, results, fields) => {
        if (error) {
          console.log(error);
          connectionPool
        } else {
          console.log("Customer was created!")
          console.log('stripe customer ID inserted');
        }
      });
    })
  }

  public postBank = (req, res) =>{
    stripe.customers.createSource(
      req.body.customer_id,
      {source: {
          'object': "bank_account",
          'country': "US",
          'currency': "usd",
          'account_holder_name': req.body.account_holder_name,
          'routing_number': req.body.routing_number,
          'account_number': req.body.account_number,
          'account_holder_type': "individual"
        }
      },(err,bank) => {
          res.send(bank)
          if (err){
            console.log(err)
          }
          const sql = 'INSERT INTO BankAccount(bankAccountID,stripeCustomerID,userID,accountHolder,Verified) VALUES?;'  
          const values = [
            [
              bank.id, //bank id retrieved from response body
              bank.customer, //customer id retrieved from response body
              req.body.id,
              bank.account_holder_name,
              0
            ]
          ]
          connectionPool.query(sql, [values], (error, results, fields) => {
            if (error) {
              console.log(error);
            } else {
              console.log('stripe bank account attached to customer associated with Affordable ID = ' + req.body.id);
            }
          });
        }
    );
  }

/*
*
*
*BELOW THIS IS OLD AND UNUSED CODE
*
*
*/
  public saveCard = async (req, res) => {
    const tokenId: string = req.body.tokenId;
    const username: string = req.body.username;
    const cardName: string = req.body.cardName;
    const cardType: string = req.body.cardType;
    var stripeID = '';


    const getStripeId = 'SELECT  * FROM StripeDonor WHERE donorID=\'' + username + '\';';
    const storeCard = 'INSERT INTO Card (stripeCardID, donorID,card_nickname,cardType) VALUES ?';

    connectionPool.query(getStripeId, (error, results) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        stripeID = results[0].stripeID;
        stripe.customers.createSource(
          stripeID,
          {
            source: tokenId
          },
          function (err, card) {
            if (err) {
              console.log(err);
              res.status(502).json({ error });
            } else {
              const values = [
                [
                  card.id,
                  username,
                  cardName,
                  cardType
                ]
              ];

              connectionPool.query(storeCard, [values], (error, results, fields) => {
                if (error) {
                  console.log(error);
                  res.status(502).json({ error });
                } else {
                  console.log('Card inserted');
                  res.status(200).json({ success: 'Card inserted' });
                }
              });


            }
          })
      }
    });
  }

  public deposit = async (req, res) => {

    const username: string = req.body.username;
    const paymentMethod: string = req.body.paymentMethod;
    const paymentType: string = req.body.paymentType;
    const amountToCharge: string = req.body.amountToCharge;
    const amountToDeposit: string = req.body.amountToDeposit;
    const stripeFee: string= req.body.stripeFee;
    const managementFee: string= req.body.managementFee;




    const getCustomer = 'SELECT * FROM StripeDonor WHERE donorID=?';
    const addExternalTransaction = 'INSERT INTO ExternalTransactions (userID, paymentMethodID,chargeID,transactionType,Amount,Status, creationTimestamp) VALUES ?';
    const insertFee = 'INSERT INTO Fee (transactionID, stripeFee, managementFee, Status) VALUES ?';
    

    var  getPaymentMethodMethod;
    var paymentMethodID;
    var customerId;
    var externalTransactionID;

  

    if(paymentType=="Credit" || paymentType=="Debit"){
      getPaymentMethodMethod = 'SELECT * FROM card WHERE card_nickname=? ;';

      await connectionPool.query(getPaymentMethodMethod, [paymentMethod], (error, results, fields) => {

        if (error) {
          console.log(error);
          res.status(502).json({ error });
        } else {
          paymentMethodID=results[0].stripeCardID;
           connectionPool.query(getCustomer, [username], (error, results, fields) => {

              if (error) {
                console.log(error);
                res.status(502).json({ error });
              } else {
               customerId=results[0].stripeID;

          stripe.charges.create({
            amount: Math.floor(parseFloat(amountToCharge)*100),
            currency: 'usd',
            customer:customerId,
            source:paymentMethodID,
          }, function(err, charge) {
            if (err) {
              console.log(err);
            }else{
            console.log(charge);
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

            //insert to external transaction
            const values=[[username,paymentMethodID,charge.id,'Deposit',parseFloat(amountToDeposit),'Initiated',mysqlTimestamp]]
            connectionPool.query(addExternalTransaction, [values], (error, results, fields) => {
              if (error) {
                console.error(error);
              } else {
                externalTransactionID=results.insertId;
                console.log('Deposit Inserted');
                  //insert to Fee transaction
           const values2=[[externalTransactionID,stripeFee,managementFee,'Pending']]
           connectionPool.query(insertFee, [values2], (error, results, fields) => {
             if (error) {
               console.error(error);
             } else {
               console.log('Fee Inserted');
               
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

        }else{

          getPaymentMethodMethod = 'SELECT * FROM bankaccount WHERE bank_nickname=? ;';


          await connectionPool.query(getPaymentMethodMethod, [paymentMethod], (error, results, fields) => {

            if (error) {
              console.log(error);
              res.status(502).json({ error });
            } else {
              paymentMethodID=results[0].stripeBankAccountID;
               connectionPool.query(getCustomer, [username], (error, results, fields) => {

                  if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                  } else {
                     customerId=results[0].stripeID;

              stripe.charges.create({
                amount: Math.floor(parseFloat(amountToCharge)*100),
                currency: 'usd',
                customer:customerId,
                source:paymentMethodID,
              }, function(err, charge) {
                if (err) {
                  console.log(err);
                }
                console.log(charge);
                var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

                   //insert to external transaction
            const values=[[username,paymentMethodID,charge.id,'Deposit',parseFloat(amountToDeposit),'Pending',mysqlTimestamp]]
            connectionPool.query(addExternalTransaction, [values], (error, results, fields) => {
              if (error) {
                console.error(error);
              } else {
                externalTransactionID=results.insertId;
                console.log('Deposit Inserted');
                    //insert to Fee transaction
           const values2=[[externalTransactionID,stripeFee,managementFee,'Pending']]
           connectionPool.query(insertFee, [values2], (error, results, fields) => {
             if (error) {
               console.error(error);
             } else {
               console.log('Fee Inserted');
             }
           });
              }
            });

                  });
                } });

           } });


        }

}





  public getSavedPaymentMethod = async (req, res) => {
    const username: string = req.body.username;
    const paymentType: string = req.body.paymentType;

    if (paymentType == "Credit" || paymentType == "Debit") {
      const getCard = 'SELECT  * FROM card WHERE donorID=? and cardType=? ;';
      connectionPool.query(getCard, [username, paymentType], (error, results, fields) => {
        if (error) {
          console.log(error);
          res.status(502).json({ error });
        } else {
          let cardList = [];

          for (let i = 0; i < results.length; i++) {
            cardList.push(
              {
                cardName: results[i].card_nickname
              }
            )
          }

          if (cardList.length > 0) {
            res.status(200).json({
              success: 'Cards Found',
              cardList: cardList
            });
          } else {
            res.status(200).json({ success: 'User does not saved card', cardList: cardList });
          }
        }
      });
    }else{
      const getBankAccount = 'SELECT  * FROM bankAccount WHERE userID=?;';
      connectionPool.query(getBankAccount, [username], (error, results, fields) => {
        if (error) {
          console.log(error);
          res.status(502).json({ error });
        } else {
          let bankList = [];

          for (let i = 0; i < results.length; i++) {
            bankList.push(
              {
                cardName: results[i].bank_nickname
              }
            )
          }

          if (bankList.length > 0) {
            res.status(200).json({
              success: 'Account Found',
              cardList: bankList
            });
          } else {
            res.status(200).json({ success: 'User does not saved Bank Account',  cardList: bankList});
          }
        }
      });

    }
  }

  /**
     * Creates an empty Connect custom account and add to main Stripe account.
     *  Returns account
     */
  public async createConnectedAccount(user, isDonor) {
    // command to create account
    // mcc is merchant type: set by default to charity services (8398)
    // business url is default set to AFFORDABLE's website
    await stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email: user.email,
      business_url: "https://www.affordhealth.org/",
      mcc: '8398',
      requested_capabilities: ['card_payments', 'transfers'],
    }, function (err, results) { //callback function, updates database to associate user with account ID
      if (results == null) {
        console.log(err)
      }
      else {
        const values = [
          [
            user.username,
            results.id,
            0,
            0
          ]];

          // if user is a recipient, add to the StripeRecipient table
          if(!isDonor) {
            //database insertion
            const sql = 'INSERT INTO StripeRecipient VALUES ?';
            connectionPool.query(sql, [values], (error, results, fields) => {
              if (error) {
                console.error(error);
              } else {
                console.log('StripeRecipient inserted');
              }
            });
          }

          // if user is a donor, update StripeDonor table
          // It is assumed that createCustomer() was called before this
          else {
            //database insertion
            const sql = 'UPDATE StripeDonor SET connectedAccountID=? WHERE donorID=?';
            connectionPool.query(sql, [results.id, user.username], (error, results, fields) => {
              if (error) {
                console.error(error);
              } else {
                console.log('Stripe Donor Updated with Connected Account');
              }
            });
          }
      }
    });
  }

  /**
   * Attaches a bank account to an existing account
   * @param: req must have two pieces of information
   *    username - AFFORDABLE account username
   *    usertype - boolean to determine if donor and recipient
   *    btok - bank account token to attach to the custom account
   */
  public attachBankToCustomAccount = async (req, res) => {
    const username: string = req.body.username;
    const usertype = req.body.usertype;
    var btok = req.body.btok;

    // first, must find the Stripe Custom Account ID
    var accountID = null;

    // if user is a recipient
    if (usertype == '0') {

      // check for Stripe Account ID from DB
      var sql = 'SELECT * FROM StripeRecipient WHERE recipientID=?';
      connectionPool.query(sql, [username], async (error, results, fields) => {
        if (error) {
          console.log(error);
          res.status(502).json({ error });
        } else {

          // checks if there are results, if not, return error
          if(results.length == 0) {
            res.status(200).json({
              success: "Error: No such user found"
            })
          }

          else {
            accountID = results[0].stripeID;

            // if account ID is found
            if(accountID != null) {
              // Stripe API call: attach the bank account to Connected account
              await stripe.accounts.createExternalAccount(
                accountID,
                { external_account: btok },
                function (err, results) {
                  if (results == null) {
                    console.error(err);
                    res.status(200).json({success: "Stripe Error",
                                          message: err})
                  } else {
                    console.log("Bank Account Added to " + accountID + "\n" + results);
                    res.status(200).json({
                    success: "Bank Account Added",
                    message: results
                    });
                  }
                }
              );
            }
            // if no account found
            else {
              res.status(200).json({
                success: "No Attached Connected Account"
              })
            }
          }
        }
      });
    }

    // if user is a donor
    else {

      var sql = 'SELECT * FROM StripeDonor WHERE donorID=?';
      connectionPool.query(sql, [username], async (error, results, fields) => {

        if (error) {
          console.log(error);
          res.status(502).json({ error });
        } else {
          // checks if there are results, if not, return error
          if(results.length == 0) {
            res.status(200).json({
              success: "Error: No such user found"
            })
          }

          else {
            accountID = results[0].connectedAccountID;

            // if account ID is not found
            if(accountID != null) {
              // Stripe API call: attach the bank account to Connected account
              await stripe.accounts.createExternalAccount(
                accountID,
                { external_account: btok },
                function (err, results) {
                  if (results == null) {
                    console.error(err);
                    res.status(200).json({success: "Stripe Error",
                                          message: err})
                  } else {
                    console.log("Bank Account Added to " + accountID + "\n" + results);
                    res.status(200).json({
                      success: "Bank Account Added",
                      message: results
                      });
                  }
                }
              );

              // put a success message now because idk how to force
              // the Stripe API call to wait for the status
              res.status(200).json({
                success: "Attaching bank account to Custom Account"
              })

            }
            // if no account found
            else {
              res.status(200).json({
                success: "Error: No Attached Connected Account"
              })
            }
          }

        }
      });
    }
  }

  /**
   * Adds a new entry onto the ConnectedBankAccount Table
   * @param req must have
   *  - username - string AFFORDABLE username
   *  - bankaccount_id - string Stripe bank account ID
   *  - bankAccountStatus - string, Stripe status of bank account
   *  - last4 - last four digits of account
   *  - bankname - string of the bank name
   */
  public addBankToCustomTable = async (req, res) => {
    const username = req.body.username;
    const bankAccountID = req.body.bankaccount_id;
    const bankAccountStatus = req.body.bankaccount_status
    const last4 = req.body.last4;
    const bankName = req.body.bankname;

    var verified = 0;
    if(bankAccountStatus == "verified") {
      verified = 1;
    }

    const sql = "INSERT INTO ConnectedBankAccount (bankAccountID, stripeBankAccountID, userID, bank_nickname, Verified) VALUES (?,?,?,?,?)"
    connectionPool.query(sql, [0, bankAccountID, username, bankName+last4, verified], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        //returns successfully in both cases (HTTP200)

        res.status(200).json({
          //to access these from front end:
          success: 'Successfully Inserted Bank Account to ConnectedBankAccount table'
        });
      }
    });

  }

  /**
   * Function returns the CustomBankAccount ID
   * @param req musthave
   *  - username - String of the AFFORDABLE username
   */
  public getCustomBank = async (req, res) => {
    const bank = req.body.paymentMethod;
    const username = req.body.username;

    const sql = "SELECT * FROM ConnectedBankAccount WHERE bank_nickname=? AND userID=?";
    connectionPool.query(sql, [bank,username], async (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        // checks if there are results, if not, return error
        if(results.length == 0) {
          res.status(200).json({
            success: "No User Found"
          })
        } else {
          res.status(200).json({
            success: "Account Found",
            accountID: results[0].stripeBankAccountID
          })
        }
      }
    });
  }

  /**
   * Called when Stripe needs more info to authenticate account. Returns object received. If success, has 'url' object to redirect user to form
   * @param: req must have three pieces of information
   *    accountID - this is the custom account ID
   *    successURL - this is the redirect link on success
   *    failureURL - this is the redirect link on failure
   */
  public onboardingInfoRequest = async (req, res) => {
    const accountID: string = req.body.accountID;
    const successURL: string = req.body.successURL;
    const failureURL: string = req.body.failureURL;

    // using Connect Onboarding for verification process
    var accountLinks = stripe.accountLinks.create({
      account: accountID,
      failure_url: failureURL,
      success_url: successURL,
      type: 'custom_account_verification',
      collect: 'eventually_due',
    }, function (err, results) {
      if (results == null) {
        console.log(err);
        res.status(502).json({ err });
      } else {
        if(results == null) {
          res.status(200).json({
            success: "STRIPE ERROR",
            message: err
          })
        } else {
          res.status(200).json({
            success: "Link Made",
            message: results
          });
        }
      }
    });
  }

  /**
   * Transfers money from main account to a custom account
   * @param req must include
   * - accountID - string of the custom account ID
   * - amount - amount of money being transfered in CENTS
   */
  public transfer = async (req, res) => {
    const accountID = req.body.accountID;
    const amount = req.body.amount;

    // first transfer to target account
    var amountFloat = parseInt(amount);
    await stripe.transfers.create({
      amount: amountFloat,
      currency: 'usd',
      destination: accountID,
      source_type: 'bank_account'
    },
      function (err, transfer) {
        if (transfer == null) {
          console.log(err);
          res.status(200).json({
            success: "STRIPE ERROR",
            message: err
          })
        }
        else {
          console.log(transfer)
          res.status(200).json({
            success: "Transfer Success",
            message: transfer
          })
        }
      });
  }

  /**
   * Function that payouts to the a target custom account given an account ID
   * @param req must include
   *  - accountID: string of the custom account ID
   *  - amount: amount of money being paid out IN CENTS
   *  - destination: target bank account ID
   *  - description: helpful description?
   */
  public payout = async(req, res) => {

    const accountID = req.body.accountID;
    const amount = req.body.amount;
    const bankID = req.body.bankID;
    const description = req.body.description;

    // then finish payout
    var amountFloat = parseInt(amount); 
    await stripe.payouts.create({
      amount: amountFloat,
      currency: 'usd',
      description: description,
      destination: bankID,
      source_type: 'bank_account'
    }, {
      stripeAccount: accountID,
    },
      function (err, payout) {
        if (payout == null) {
          console.log(err);
          res.status(200).json({
            success: "STRIPE ERROR",
            message: err
          })
        } else {
          console.log(payout)
          res.status(200).json({
            success: "Payout Success",
            message: payout
          })
        }
      });
  }

  /**
   * On payout, call this function to insert into external transaction table
   * @param req must have:
   *  - username - AFFORDABLE username
   *  - paymentMethod - bank ID to payout
   *  - payoutID - Stripe ID of the payout
   *  - amount - amount of money sent
   *  - status - status of the transaction
   *  - creationTimeStamp - Date.now() creation time of the payout
   * 
   */
  public payoutUpdateTable = async (req, res) => {
    const username = req.body.username;
    const paymentMethod = req.body.bankID;;
    const transferID = req.body.transferID;
    const transactionType = "Recipient Withdrawal";
    const amount = req.body.amount;
    const status = "Pending"
    const creationTimestamp = req.body.timestamp;

    const check = 'SELECT * FROM externalTransactions WHERE chargeID = ?'
    const update = "UPDATE externaltransactions SET paymentMethodID = ? WHERE chargeID = ?"
    const insert = "INSERT INTO externalTransactions (chargeID, paymentMethodID, userID, creationTimestamp) values (?,?,?,?)"

    connectionPool.query(check, [transferID], (error, results, fields) => {
      if(error) {
        console.error(error);
        res.status(502).json({error});
      } else {
        if (results[0] === undefined || results[0].userID === undefined) {
          connectionPool.query(insert, [transferID, paymentMethod, username, creationTimestamp], (error, results, fields) => {
            if(error) {
              console.error(error);
              res.status(502).json({error});
            } else {
              res.status(200).json({
                success: "Table Insertion Success",
              })
            }
          });
        } else {
          connectionPool.query(update, [paymentMethod, transferID], (error, results, fields) => {
            if(error) {
              console.error(error);
              res.status(502).json({error});
            } else {
              res.status(200).json({
                success: "Table Update Success",
              })
            }
          });
        }
      }
    });
    /*
    const sql = 'INSERT INTO externaltransactions (userID, paymentMethodID, chargeID, transactionType, Amount, Status, creationTimestamp) VALUES (?,?,?,?,?,?,?)';
    connectionPool.query(sql, [username, paymentMethod, transferID, transactionType, amount, status, creationTimestamp], (error, results, fields) => {
      if(error) {
        console.error(error);
        res.status(502).json({error});
      } else {
        const sql2 = 'SELECT * FROM externaltransactions WHERE userID=? AND chargeID=?';
        connectionPool.query(sql2, [username, transferID], (error, results2, fields) => {
          if(error) {
            console.error(error);
            res.status(502).json({error});
          } else {
            res.status(200).json({
              success: "Table Insertion Success",
              transactionID: results2[0].externalTransactionID
            })
          }
        });
      }
    });
    */
  }

  /**
   * On payout, log the fee AFFORDABLE takes
   * @param req must have:
   *  - payoutID - Stripe ID of the payout
   *  - fee - Fee AFFORDABLE took
   */
  public payoutUpdateFee = async (req, res) => {
    const transactionID = req.body.transactionID;
    const stripeFee = 0.0;
    const managementFee = req.body.fee;
    const status = "Pending";

    const sql = 'INSERT INTO Fee (transactionID, stripeFee, managementFee, Status) VALUES (?,?,?,?)';
    connectionPool.query(sql, [transactionID, stripeFee, managementFee, status], (error, results, fields) => {
      if(error) {
        console.error(error);
        res.status(502).json({error});
      } else {
        res.status(200).json({
          success: "Table Insertion Success"
        })
      }
    })
  }

  /**
   * This function updates a recipient's balance
   * @param req must have:
   * - username - AFFORDABLE username
   * - newBalance - the new balance of the recipient
   */
  public updateRecipientBalance = async (req, res) => {
    const username = req.body.username;
    const newBalance = req.body.newBalance;

    const sql = 'UPDATE StripeRecipient SET Balance=? WHERE recipientID=?'
    connectionPool.query(sql, [newBalance, username], (error, results, fields) => {
      if(error) {
        console.error(error);
        res.status(502).json({error});
      } else {
        res.status(200).json({
          success: "Table Update Success"
        })
      }
    })
  }

  public getOwnedHugs = (req, res) => {
    const sql = 'SELECT * FROM StripeHUG WHERE ownerID = ?';
    const username: string = req.body.username;

    connectionPool.query(sql, [username], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {

        let hugList = [];
        /**
         * DB results returned as results array.
         * This loop iterates through every returned row and adds needed info
         * to the hugList array in JSON format.
        */
        for (let i = 0; i < results.length; i++) {
          var hugStatus = results[i].recipientID === null ? "Pending":"Awarded";
          //pushes a new JSON block
          hugList.push(
            {
              HUGID: results[i].HUGID,
              HUGName: results[i].HUGName,
              Status: hugStatus
            }
          )
        }

        //returns successfully in both cases (HTTP200)
        if (hugList.length > 0) {
          res.status(200).json({
            //to access these from front end:
            success: 'getOwnedHugs()',
            hugList: hugList
          });
        } else {
          res.status(200).json({ success: 'User does not have any two factor devices' });
        }

      }
    });
  }

  public getAccountBalance = (req, res) => {
    const username: string = req.body.username;
    const usertype: string = req.body.usertype;
    const sql = usertype === "donor" ?
    'SELECT * FROM stripeDonor WHERE donorID = ?' :
    'SELECT * FROM stripeRecipient WHERE recipientID = ?';


    connectionPool.query(sql, [username], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        console.log(results);
        if(results.length > 0){
          //returns successfully in both cases (HTTP200)
          res.status(200).json({
            //to access these from front end:
            success: 'Success',
            accountAmount: results[0].Balance
          });
        }
        else{
          res.status(200).json({
            //to access these from front end:
            success: 'Success but 0',
            accountAmount: 0
          });
        }
      }
    });

  }

  public transferFundFromHUGToRecipient = (req, res) => {
      const hugID: string = req.body.HUGID;
      const recipientID: string = req.body.recipientID;
      const amount: number = req.body.amount;
      console.log(hugID)
      console.log(recipientID)

      let floatValue = 0.0;
      const realAmount = (floatValue +(amount)) * 100
      const feeAmount = Math.round(realAmount * 0.025)
      const recipAmount = realAmount - feeAmount

      // Add amount to Recipient
      const awardRecip = "UPDATE StripeRecipient SET Balance = Balance + ? WHERE recipientID = ?"
      // transaction
      const logTrans = "INSERT INTO InternalTransactions (fromID, transactionType, toID, creationTimestamp, Amount) VALUES (?, 'Hug to Recipient', ?, ?, ?)"
      // Award
      var award = "update HugApplicants set Status = 'Accepted' where HUGID = ? and recipientID = ?;";

      const logFee = 'INSERT INTO Fee (HUGID, managementFee) VALUES (?,?)';

      const retrieveTrans = 'SELECT * FROM InternalTransactions WHERE creationTimestamp = ?'

      var remove = "DELETE FROM StripeHug WHERE HUGID = ? and recipientID = ?;"

      var getEmail="SELECT * FROM emails INNER JOIN authenticationInformation ON emails.userID=authenticationInformation.id && authenticationInformation.username=?;"



      var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      
      connectionPool.query(award, [hugID, recipientID], (error, results, fields) => {
        //log error and return bad response if DB error
        if (error) {
          console.log(error);
          res.status(502).json({ error });
          //execute intended code if no error
        } else {

          connectionPool.query(awardRecip, [(recipAmount/100), recipientID], (error, results, fields) => {
            //log error and return bad response if DB error
            if (error) {
              console.log(error);
              res.status(502).json({ error });
              //execute intended code if no error
            } else {

            }
          })

          

          connectionPool.query(logTrans, [hugID, recipientID, mysqlTimestamp, (recipAmount/100)], (error, results, fields) => {
            //log error and return bad response if DB error
            if (error) {
              console.log(error);
              res.status(502).json({ error });
              //execute intended code if no error
            }
          })

          connectionPool.query(logFee, [hugID, feeAmount], (error, results, fields) => {
            //log error and return bad response if DB error
            if (error) {
              console.log(error);
              res.status(502).json({ error });
              //execute intended code if no error
            }  else {
              
              connectionPool.query(getEmail, [recipientID], (error, results, fields) => {
                if (error) {
                  console.log(error);
                  res.status(502).json({ error });
                } else {
          
                 // Send Email
                 const desiredLink = process.env.AFFORDABLE_FRONTEND_URL +"/login";
                 const desiredText = "Log in to Claim You Award";
                 this.emailClient.sendEmail({
                 from: "donotreply@affordhealth.org",
                 to: results[0].email,
                 subject: "Affordable:: Congratulations! You have been awarded a grant",
                 html: utils.formatEmail(
                     [
                       "<h1>Congratulations! You have been awarded a grant." +  " </h3><br></br> <a href=\"" + desiredLink + "\">" + desiredText + "</a>"
                     ]
                 )
             });
    
              }
             });


              this.affordablePayoutFee(feeAmount)
              res.status(200).json({
                //to access these from front end:
                success: 'funds transferred'
              });
              
              /*
              connectionPool.query(remove, [hugID, recipientID], (error, results, fields) => {
                //log error and return bad response if DB error
                if (error) {
                  console.log(error);
                  res.status(502).json({ error });
                  //execute intended code if no error
                }  else {
                  
                }
              })
           */

            }
          })

        }
      })

      
  }

  public transferFundFromDonorToHUG = (req, res) => {
    const hugName: string = req.body.HUGName;
    const donorID: string = req.body.username;
    const amount: number = req.body.amount;
    // Add amount to HUG
    const sql1 = "UPDATE StripeHUG SET Balance = Balance + ? WHERE HUGName = ?"
    //Remove amount from donor account
    const sql2 = "UPDATE StripeDonor SET Balance = Balance - ? WHERE donorID = ?"

    // Insert entry into InternalTransactions
    const sql3 = "INSERT INTO InternalTransactions (fromID, transactionType, toID, creationTimestamp, Amount) VALUES (?, 'Donor to Hug', ?,?, ?)"

    connectionPool.query(sql1, [amount, hugName], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        //returns successfully in both cases (HTTP200)
        if(res === null || res.length === 0){
          res.status(200).json({
            //to access these from front end:
            success: 'Add funds to HUG'
          });
        }
      }
    });

    connectionPool.query(sql2, [amount, donorID], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        //returns successfully in both cases (HTTP200)

        // res.status(200).json({
        //   //to access these from front end:
        //   success: 'Remove donated amount from the donor account'
        // });
      }
    });
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    connectionPool.query(sql3, [donorID, hugName, mysqlTimestamp, amount], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        //returns successfully in both cases (HTTP200)

        res.status(200).json({
          //to access these from front end:
          success: 'Recorded internal transaction'
        });
      }
    });

  }

  public makeHUG = async (req, res) => {
    const username: string = req.body.username;
    const hugName: string = req.body.hugName;
    const hugDescription: string = req.body.description;
    const goal: number = req.body.desiredAmount;

    const sql1 = "INSERT INTO StripeHUG (ownerID, HUGName, HUGDescription, Balance, fundingGoal) VALUES (?, ?, ?, '0', ?)"


    connectionPool.query(sql1, [username, hugName, hugDescription, goal], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {

        res.status(200).json({ success: 'HUG had been inserted into database' });

      }
    });
  }


  /**
   * Here is an example of how one would use the above function in the front end:
   *
   *const data = new FormData();
    data.append("username", 'admin');<--- admin is the username in this case
    try {
      const response = await fetch("http://localhost:4000/stripe/getOwnedHugs", {
          method: "POST",
          body: data
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json(); <-- pulls JSON fields back out (success, hugList)
      console.log(json.hugList)
      console.log(json.success)
      console.log(json.whatever_you_want_here)
    } catch (error) {
      console.log(error);
    }
   */

   // Fetches all info of a HUG with a given ID
   public getHUG = (req, res) => {
       const sql = 'select * from stripehug where HUGName = ?';
       const HUGName: string = req.body.HUGName;

       connectionPool.query(sql, [HUGName], (error, results, fields) => {
           if (error) {
               console.log("server/src/services/StripeService.ts getHUG() ERROR:");
               console.log(error);
               res.status(502).json({ error });
           }
           else if (results == null || results.length <= 0) {
               console.log("server/src/services/StripeService.ts getHUG() ERROR:");
               res.status(502).json({ returnedResult: "empty result" });
           }
           else {
               res.status(200).json({
                   success: 'getHUG()',
                   HUGInfo: results
               });
           }
       });
   }

   // Fetches all info all HUGs
   public getAllHUGs = (req, res) => {
       const sql = 'select * from stripehug';

       connectionPool.query(sql, [], (error, results, fields) => {
           if (error) {
               console.log("server/src/services/StripeService.ts getAllHUGs() ERROR:");
               console.log(error);
               res.status(502).json({ error });
           }
           else if (results == null || results.length <= 0) {
               console.log("server/src/services/StripeService.ts getAllHUGs() ERROR:");
               res.status(502).json({ returnedResult: "empty result" });
           }
           else {
               res.status(200).json({
                   success: 'getAllHUGs()',
                   HUGInfo: results
               });
           }
       });
   }

   // Fetch a recipient's applied-to HUGs by their username as a list of HUG IDs
   public getRecipientAppliedHUGs = (req, res) => {
      //  const sql = 'select * from hugapplicants where recipientID = ?';
       const sql = 'select h.HUGID, s.HUGName, h.recipientID, s.Balance, h.Status, isNew from HugApplicants h, stripeHug s where h.recipientID=? and h.HUGID = s.HUGID;';
       const recipientUsername: string = req.body.recipientUsername;

       connectionPool.query(sql, [recipientUsername], (error, results, fields) => {
           if (error) {
               console.log("server/src/services/StripeService.ts getRecipientAppliedHUGs() ERROR:");
               console.log(error);
               res.status(502).json({ error });
           }
           else if (results == null || results.length <= 0) {
               console.log("server/src/services/StripeService.ts getRecipientAppliedHUGs() ERROR:");
               res.status(200).json({
                success: 'getRecipientAppliedHUGs()',
                hugList: []
            });
           }
           else {
               res.status(200).json({
                   success: 'getRecipientAppliedHUGs()',
                   hugList: results
               });
           }
       });
   }

  /**
   * This function attaches a given bank account token (provided via a bank account token)
   * to a Stripe Customer account that is associated with the passed in user.
   * It also adds the bank account into the database
   * @param req must have
   *  - username - User's username in AFFORDABLE
   *  - btok - bank account token
   */
  public attachBankToCustomer = (req, res) => {
    const username = req.body.username;
    const bankAccountToken = req.body.btok;
    var stripeID = '';


    const getStripeId = 'SELECT  * FROM StripeDonor WHERE donorID=\'' + username + '\';';
    const storeAccount = 'INSERT INTO bankaccount (stripeBankAccountID, userID,bank_nickname,verified) VALUES ?';

    connectionPool.query(getStripeId, (error, results) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        stripeID = results[0].stripeID;
        stripe.customers.createSource(
          stripeID,
          {
            source: bankAccountToken
          },
          function (err, bankAccount) {
            if (err) {
              console.log(err);
              res.status(502).json({ error });
            } else {
              console.log(bankAccount)
              const values = [
                [
                  bankAccount.id,
                  username,
                  bankAccount.bank_name+' '+bankAccount.last4,
                  1

                ]
              ];

              connectionPool.query(storeAccount, [values], (error, results, fields) => {
                if (error) {
                  console.log(error);
                  res.status(502).json({ error });
                } else {
                  console.log('Account inserted');
                  res.status(200).json({
                     success: 'Account Inserted',
                     bankAccount: bankAccount });
                }
              });


            }
          })
      }
    });


  }

  /**
   * Function passes in Plaid tokens and account id to generate bank account token
   * @param res must include
   *  - Plaid Public Token
   *  - Plaid Account ID
   */
  public exchangeTokens = (req, res) => {
    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var PUBLIC_TOKEN = req.body.public_token;
    var id = req.body.account_id;
    console.log("token recieved " + PUBLIC_TOKEN);
    //  console.log("recived username" + req.body.username);
    var username = req.body.username;
    var bank_nickname = req.body.nickname;

    //console.log(PUBLIC_TOKEN);
    var plaidClient = new plaid.Client(
      process.env.PLAID_CLIENT_ID,
      process.env.PLAID_SECRET,
      process.env.PLAID_PUBLIC_KEY,
      plaid.environments.sandbox
    );
    plaidClient.exchangePublicToken(PUBLIC_TOKEN, function (err, results) {
      // if Plaid encounters error
      if(results == null) {
        res.status(200).json({
          success: "Plaid Error",
          message: err
        })
      }

      else {
        var accessToken = results.access_token;
        // Generate a bank account token
        plaidClient.createStripeToken(accessToken, id, function (err, results) {

          // if Plaid encounters error
          if(results == null) {
            res.status(200).json({
              success: "Plaid Error",
              message: err
            })
          }
          // returns bank account token as success status
          else {
            var bankAccountToken = results.stripe_bank_account_token;
            res.status(200).json({
              success: "Bank Account Token Generated",
              btok: bankAccountToken,
              message: results
            })
          }
        });
      }
    });
  }


  public removeCard = async (req, res) => {
    const username: string = req.body.username;
    const type: string = req.body.type;
    const name: string = req.body.name;

    const getCard = 'SELECT  * FROM card WHERE donorID=? && card_nickname=? ;';
    const getCustomer = 'SELECT * FROM StripeDonor WHERE donorID=?';
    const deleteCard = 'DELETE FROM Card WHERE donorID = ? and cardType = ? and card_nickname = ?;';


    var cardId;
    var customerId;

    await connectionPool.query(getCard, [username,name], (error, results, fields) => {

      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
         cardId=results[0].stripeCardID;
         connectionPool.query(getCustomer, [username], (error, results, fields) => {

            if (error) {
              console.log(error);
              res.status(502).json({ error });
            } else {
               customerId=results[0].stripeID;
               stripe.customers.deleteSource(
                customerId,
                cardId,
                function(err, confirmation) {
                  if(err){
                    console.log(err);
                  }else{
                    console.log("Card Removed FROM Stripe");
                    console.log(confirmation);

                    connectionPool.query(deleteCard, [username, type, name], (error, results, fields) => {
                      if (error) {
                        console.log(error);
                        res.status(502).json({ error });
                      } else {
                        console.log("Card Removed FROM DB");
                          res.status(200).json({ success: 'Card Removed from DB' });
                      }
                    });
                  }
                }
              );

          } });

     } });



  }


  public removeBank = async (req, res) => {
    const username: string = req.body.username;
    const nickname: string = req.body.nickname;
    const usertype: UserType = req.body.usertype;

    let getBankAccount = "";
    let getCustomer = "";
    var removeBankAccount = "";

    if (usertype === UserType.DONOR){
      getBankAccount = 'SELECT  * FROM bankaccount WHERE userID=? && bank_nickname=? ;';
      getCustomer = 'SELECT * FROM StripeDonor WHERE donorID=?';
      removeBankAccount = 'DELETE FROM BankAccount WHERE userID = ? and bank_nickname = ?;';
    } else {
      getBankAccount = 'SELECT  * FROM ConnectedBankAccount WHERE userID=? && bank_nickname=? ;';
      getCustomer = 'SELECT * FROM StripeRecipient WHERE recipientID=?';
      removeBankAccount = 'DELETE FROM ConnectedBankAccount WHERE userID = ? and bank_nickname = ?;';
    }

    var bankAccountId;
    var customerId;

    await connectionPool.query(getBankAccount, [username, nickname], (error, results, fields) => {

      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        bankAccountId=results[0].stripeBankAccountID;
         connectionPool.query(getCustomer, [username], (error, results, fields) => {

            if (error) {
              console.log(error);
              res.status(502).json({ error });
            } else {
               customerId=results[0].stripeID;
              stripe.customers.deleteSource(
                customerId,
                bankAccountId,
                function(err, confirmation) {
                  if(err){
                    console.log(err);
                  }else{
                    console.log("Bank Removed from Stripe");
                    console.log(confirmation);

              connectionPool.query(removeBankAccount, [username,nickname], (error, results, fields) => {
                if (error) {
                  console.log(error);
                  res.status(502).json({ error });
                } else {
                   console.log("Bank Removed FROM DB");
                    res.status(200).json({ success: 'Bank Removed from DB' });
                }
              });
                  }
                }
              );

          } });

     } });


  }

  /**
   * This function simply checks if theres any requirements due
   * for a Connected Custom account
   * @param req Must include
   *  - accountID: account ID of the Custom Account
   */
  public checkConnectRequirements = async (req, res) => {
    const accountID = req.body.accountID;

    // function to retreive the account
    await stripe.account.retrieve(
      accountID,
      function(err, account) {
        if(account == null) {
          console.error(err);
          res.status(200).json({
            success: "STRIPE ERROR",
            message: err
          })
        } else {
          console.log(account);
          const requirements = account.verification.fields_needed;
          const pending = account.verification.pending_verification;
          // if no requirements
          if(requirements.length == 0 && pending.length == 0) {
            res.status(200).json({
              success: "Account Found",
              status: "None"
            });
          // if requirements due
          } else {
            res.status(200).json({
              success: "Account Found",
              status: "Requirements Due",
              requirements: requirements
            });
          }
        }
      }
    )
  }


  /**
   * This method simply gets the custom account ID of the passed in AFFORDABLE user
   * This is for both recipients and donors
   * @param req Must include
   * - username: string AFFORDABLE username
   * - usertype: string to check if user is a donor or recipient
   */
  public getCustomAccountID = async (req, res) => {
    const username: string = req.body.username;
    const usertype: string = req.body.usertype;
    console.log(username + ", " + usertype);

    // if user is a recipient
    if (usertype == '0') {

      // check for Stripe Account ID in StripeRecipient in DB
      var sql = 'SELECT * FROM StripeRecipient WHERE recipientID=?';
      connectionPool.query(sql, [username], (error, results, fields) => {
        if(error) {
          console.log(error);
          res.status(502).json({ error });
        } else {
          console.log("HERE MOFO: " + results);
          // if no account is found, return not found
          if(results == null) {
            res.status(200).json({
              // returns ID
              success: 'No Account Found',
             });
          }
          else {
            res.status(200).json({
              // returns ID
              success: 'Found Connected Account',
              id: results[0].stripeID
            });
          }
        }
      });
    }

    // if user is a donor
    else {

      //check for Stripe Account ID in StripeDonor in DB
      var sql = 'SELECT * FROM StripeDonor WHERE donorID=?';
      connectionPool.query(sql, [username], (error, results, fields) => {
        if(error) {
          console.log(error);
          res.status(502).json({ error });
        } else {
          if(results.length == 0) {
            res.status(200).json({
              // returns ID
              success: 'No Account Found',
             });
          }
          else {
            res.status(200).json({
              //returns ID
              success: "Found Connected Account",
              id: results[0].connectedAccountID
            });
          }
        }
      });
    }
  }

  public applyToHug = async (req, res) => {
    const username: string = req.body.username;
    const HUGName: string = req.body.HUGName;

    var sql = 'SELECT HUGID FROM stripeHug WHERE HUGName = ?'
    var insertsql = "INSERT INTO HugApplicants VALUES (?, ?, true, 'Pending');";
    await connectionPool.query(sql, [HUGName], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        if (results !== null && results.length > 0){
          var HUGID = results[0].HUGID;
          connectionPool.query(insertsql, [HUGID, username], (error, results, fields) => {
            if (error) {
              console.log(error);
              res.status(502).json({ error });
            } else {
              res.status(200).json({ success: 'Application Submitted'});
            }
          });
        }else {
          res.status(200).json({ success: 'No HUG Found'});
        }
      }
    });
  }

  public rejectRecipient = async (req, res) => {
    const username: string = req.body.username;
    const HUGID: string = req.body.HUGID;
    const email: string = req.body.email;

    var rejected = "update HugApplicants set Status = 'Rejected' where HUGID = ? and recipientID = ?;"
    var remove = "DELETE FROM StripeHug WHERE HUGID = ? and recipientID = ?;"
    var getEmail="SELECT * FROM emails INNER JOIN authenticationInformation ON emails.userID=authenticationInformation.id && authenticationInformation.username=?;"

    await connectionPool.query(rejected, [HUGID, username], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
         connectionPool.query(getEmail, [username], (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(502).json({ error });
          } else {
    
              // Send Email
              this.emailClient.sendEmail({
              from: "donotreply@affordhealth.org",
              to: results[0].email,
              subject: "Affordable:: Thank you for applying!",
               html: utils.formatEmail(
                   [
                     "<h3>Thank you for taking time to apply for a grant. Unfortunately we were not able to provide you a grant at this time.<br> We highly encourage you to apply in the future "
                   ]
              )
          });
        }
      });
    

        connectionPool.query(remove, [HUGID, username], (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(502).json({ error });
          } else {
             res.status(200).json({ success: 'Updated Awarded status'});
          }
        });
      }
    });
  }

public getHUGApplicants = async (req, res) => {
    const sql = "select * from hugapplicants where HUGID = ?";
    const HUGID: string = req.body.HUGID;

    await connectionPool.query(sql, [HUGID], (error, results, fields) => {
        if (error || (results == null || results.length <= 0)) {
            console.log("//////////////////////////");
            console.log("//// getHUGApplicants ////");
            console.log("//////////////////////////");
            console.log(error);
            console.log("//////////////////////////");
            res.status(502).json({ error });
        }
        else {
           res.status(200).json({
               success: 'HUG applicants got',
               applicants: results
       });
        }
    });
}

  /**
   * This function simply payouts the fee to the stated AFFORDABLE account
   * @param req must have
   *  - fee_amount: amount of money to payout
   *  - description: description of the fee payout 
   */
  public affordablePayoutFee = async (fee) => {
    const account = process.env.AFFORDABLE_PAYOUT_ACCOUNT;
    const description = "AFFORDABLE Withdraw: Initiated by Admin | Amount: $" + fee
    var feeInt = parseInt(fee); 

    await stripe.transfers.create({
      currency: 'usd',
      amount: feeInt,
      destination: account,
      source_type: 'bank_account'
    },
      async function (err, transfer) {
        if (transfer == null) {
          console.log(err);
        }
        else {
          console.log(transfer)
          await stripe.payouts.create({
            currency: 'usd',
            amount: feeInt,
            description: description,
            source_type: 'bank_account'
          }, {
            stripeAccount: account,
          },
            function (err, payout) {
              if (payout == null) {
                console.log(err);
              } else {
                console.log(payout)
              }
            });
        }
      });
  }


}
