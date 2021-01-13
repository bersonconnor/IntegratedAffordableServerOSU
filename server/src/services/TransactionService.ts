"use strict";
import {AffordableEmailClient} from "./email/AffordableEmailClient";
import {AffordableSESClient} from "./email/AffordableSESClient";
import db from "../database/DatabaseConnection";
import * as utils from "../utils";
const connectionPool = db.getInstance()

const dotenv_1 = require("dotenv");
dotenv_1.config();

export class TransactionService {
  private emailClient: AffordableEmailClient;

  private constructor(emailClient?: AffordableEmailClient) {
    this.emailClient = emailClient ?? AffordableSESClient.getInstance();
   }

  private static instance = new TransactionService();

  public static getInstance = () => TransactionService.instance;

  public getBalance = async (req, res) => {

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var pendingBalance: number = 0;
    var balance: number = 0;
    const username: string = req.body.username;
    const usertype: string = req.body.usertype;
    var sql = '';
    if (usertype === 'donor') {
      sql = 'SELECT * FROM StripeDonor WHERE donorID = ?';
    } else {
      sql = 'SELECT * FROM StripeRecipient WHERE recipientID = ?';
    }
    connectionPool.query(sql, [username], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
     //   console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        //returns successfully in both cases (HTTP200)
        if (results.length > 0) {
          pendingBalance = results[0].pendingBalance;
          balance = results[0].Balance;
          res.status(200).json({
            //to access these from front end: 
            success: 'Balance found',
            pendingBalance: pendingBalance,
            balance: balance,
            results: results
          });
        } else {
          res.status(200).json({ success: 'User balance not found' });
        }
      }
    });
  }

  public adminAwarded = async (req, res) => {
    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var type = "Hug to Recipient";

    var sql = 'SELECT fullName, i.Amount, i.creationTimestamp FROM InternalTransactions i, HugApplicants h WHERE transactionType=? and toID=recipientID;';
    connectionPool.query(sql, [type], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var awards = [];

        for (let i = 0; i < results.length; i++) {
          awards.push({
            date: results[i].creationTimestamp,
            type: "Awarded",
            name: results[i].fullName,
            amount: results[i].Amount,
            status: "Cleared"
          })
        }

        //returns successfully in both cases (HTTP200)
        if (awards.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Awarded found',
            awarded: awards
          });
        } else {
          res.status(200).json({ success: 'Awarded not found' });
        }
      }
    });
  }

  public getDonationHistory = async (req, res) => {
    const username: string = req.body.username;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var sql = 'SELECT * FROM InternalTransactions WHERE fromID = ?;';
    connectionPool.query(sql, [username], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var donations = [];
        for (let i = 0; i < results.length; i++) {
          donations.push({
            date: results[i].creationTimestamp,
            type: "Donation",
            name: results[i].toID,
            amount: results[i].Amount,
            status: "Cleared"
          })
        }

        //returns successfully in both cases (HTTP200)
        if (donations.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Donations found',
            donations: donations
          });
        } else {
          res.status(200).json({ success: 'Donations not found' });
        }
      }
    });
  }

  public getAwardedHistory = async (req, res) => {
    const username: string = req.body.username;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var sql = 'SELECT hugName, Amount, creationTimestamp FROM InternalTransactions, stripeHug WHERE toID = ? and fromID=hugID;';
    connectionPool.query(sql, [username], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var awards = [];

        for (let i = 0; i < results.length; i++) {
          awards.push({
            date: results[i].creationTimestamp,
            type: "Awarded",
            name: results[i].hugName,
            amount: results[i].Amount,
            status: "Cleared"
          })
        }

        //returns successfully in both cases (HTTP200)
        if (awards.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Awarded found',
            awarded: awards
          });
        } else {
          res.status(200).json({ success: 'Awarded not found' });
        }
      }
    });
  }

  public getCardDepositHistory = async (req, res) => {
    const username: string = req.body.username;
    const type: string = "Deposit";

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var sql = 'select Amount, Status, creationTimestamp, card_nickname from ExternalTransactions e, Card c where e.userID = c.donorID and c.stripeCardID = e.paymentMethodID and e.userID = ? and e.transactionType = ?;';
    connectionPool.query(sql, [username, type], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var deposits = [];

        for (let i = 0; i < results.length; i++) {
          var date = results[i].creationTimestamp;
          var amount = results[i].Amount;
          var status = results[i].Status;
          var name = results[i].card_nickname;

          deposits.push({
            date: date,
            type: "Deposit",
            name: name,
            amount: amount,
            status: status
          })
        }

        //returns successfully in both cases (HTTP200)
        if (deposits.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Card Deposits found',
            deposit: deposits
          });
        } else {
          res.status(200).json({ success: 'Card Deposits not found' });
        }
      }
    });
  }

  public getDepositStatus= async (req, res) => {

    const username: string = req.body.username;
    const chargeID: string = req.body.chargeID;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var sql = 'select  *  from ExternalTransactions  where userID =? and chargeId=? ';
    connectionPool.query(sql, [username, chargeID], (error, results, fields) => {         

      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else{
        console.log("Status is "+results[0].Status)
        res.status(200).json({ transactionStatus: results[0].Status});
        console.log("Transaction Status sent");
      }

    });
  }
   

  public getBankDepositHistory = async (req, res) => {
    const username: string = req.body.username;
    const type: string = "Deposit";

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var sql = 'select Amount, Status, creationTimestamp, bank_nickname from ExternalTransactions e, bankAccount b where e.userID = b.userID and b.stripeBankAccountID = e.paymentMethodID and e.userID = ? and e.transactionType = ?;';
    connectionPool.query(sql, [username, type], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var deposits = [];
        
        for (let i = 0; i < results.length; i++) {
          var date = results[i].creationTimestamp;
          var amount = results[i].Amount;
          var status = results[i].Status;
          var name = results[i].bank_nickname;

          deposits.push({
            date: date,
            type: "Deposit",
            name: name,
            amount: amount,
            status: status
          })
        }

        //returns successfully in both cases (HTTP200)
        if (deposits.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Bank Deposits found',
            deposit: deposits
          });
        } else {
          res.status(200).json({ success: 'Bank Deposits not found' });
        }
      }
    });
  }

  public getCardWithdrawHistory = async (req, res) => {
    const username: string = req.body.username;
    const usertype: string = req.body.usertype;
    var type: string = "";

    if (usertype === 'donor') {
      type = "Donor Withdrawal";
    } else {
      type = "Recipient Withdrawal";
    }

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    var sql = 'select Amount, Status, creationTimestamp, card_nickname from ExternalTransactions e, Card c where e.userID = c.donorID and c.stripeCardID = e.paymentMethodID and e.userID = ? and e.transactionType = ?;';
    connectionPool.query(sql, [username, type], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var withdraws = [];

        for (let i = 0; i < results.length; i++) {
          withdraws.push({
            date: results[i].creationTimestamp,
            type: "Withdraw",
            name: results[i].card_nickname,
            amount: results[i].Amount,
            status: results[i].Status
          })
        }

        //returns successfully in both cases (HTTP200)
        if (withdraws.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Withdrawals found',
            withdraw: withdraws
          });
        } else {
          res.status(200).json({ success: 'Withdrawals not found' });
        }
      }
    });
  }

  public getBankWithdrawHistory = async (req, res) => {
    const username: string = req.body.username;
    const usertype: string = req.body.usertype;
    var type: string = "";

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    if (usertype === 'donor') {
      type = "Donor Withdrawal";
    } else {
      type = "Recipient Withdrawal";
    }

    var sql = 'select Amount, Status, creationTimestamp, bank_nickname from ExternalTransactions e, ConnectedBankAccount b where e.userID = b.userID and b.stripeBankAccountID = e.paymentMethodID and e.userID = ? and e.transactionType = ?;';
    connectionPool.query(sql, [username, type], (error, results, fields) => {
      //log error and return bad response if DB error
      if (error) {
        console.log(error);
        res.status(502).json({ error });
        //execute intended code if no error
      } else {
        var withdraws = [];

        for (let i = 0; i < results.length; i++) {
          withdraws.push({
            date: results[i].creationTimestamp,
            type: "Withdraw",
            name: results[i].bank_nickname,
            amount: results[i].Amount,
            status: results[i].Status
          })
        }

        //returns successfully in both cases (HTTP200)
        if (withdraws.length > 0) {
          res.status(200).json({
            //to access these from front end: 
            success: 'Withdrawals found',
            withdraw: withdraws
          });
        } else {
          res.status(200).json({ success: 'Withdrawals not found' });
        }
      }
    });
  }

  public getCards = async (req, res) => {
    const username: string = req.body.username;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    const sql = 'SELECT  * FROM card WHERE donorID=?;';
    connectionPool.query(sql, [username], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        let cardList = [];

        for (let i = 0; i < results.length; i++) {
          cardList.push({
              cardName: results[i].card_nickname,
              cardType: results[i].cardType
          })
        }

        if (cardList.length > 0) {
          res.status(200).json({
            success: 'Cards Found',
            cardList: cardList
          });
        } else {
          res.status(200).json({ success: 'Cards not found', cardList: [] });
        }
      }
    });
  }

  public getBanks = async (req, res) => {
    const username: string = req.body.username;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    const getBankAccount = 'SELECT  * FROM BankAccount WHERE userID=?';
    connectionPool.query(getBankAccount, [username], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        let accountList = [];
        for (let i = 0; i < results.length; i++) {
          accountList.push({
              bankType: "Banking",
              bankName: results[i].bank_nickname
            })
        }

        if (accountList.length > 0) {
          res.status(200).json({
            success: 'Bank Account Found',
            bankList: accountList
          });
        } else {
          res.status(200).json({ success: 'User does not saved bank account' });
        }
      }
    });
  }

  public getConnectedBanks = async (req, res) => {
    const username: string = req.body.username;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    const getBankAccount = 'SELECT  * FROM ConnectedBankAccount WHERE userID=?';
    connectionPool.query(getBankAccount, [username], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {
        let accountList = [];
        for (let i = 0; i < results.length; i++) {
          accountList.push({
              bankType: "Banking",
              bankName: results[i].bank_nickname
            })
        }

        if (accountList.length > 0) {
          res.status(200).json({
            success: 'Bank Account Found',
            bankList: accountList
          });
        } else {
          res.status(200).json({ success: 'User does not saved bank account' });
        }
      }
    });
  }

  public searchHUGS = async (req, res) => {
    var HUGName: string = req.body.HUGName;
    HUGName = "%" + HUGName + "%";

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    const sql = 'select * from stripeHug where HUGName like ?;';
    connectionPool.query(sql, [HUGName], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(502).json({ error });
      } else {

        if (results !==null && results.length > 0) {
          res.status(200).json({
            success: 'Hugs Found',
            hugList: results
          });
        } else {
          res.status(200).json({ success: 'Hugs not found' });
        }
      }
    });
  }

  public supportEmail = (req, res) => {
    const email:string = req.body.to;
    const subject:string = req.body.subject;
    const text:string = req.body.text;

    if(res.locals.userInfo === undefined){
      res.send(401);
      return; 
    }

    this.emailClient.sendEmail({
      from: 'donotreply@affordhealth.org',
      to: email,
      subject: subject,
      html: utils.formatEmail([
                  '<p>'+ text + '</p>'
              ])
      });
}

}