"use strict";
import db from "../database/DatabaseConnection";
import * as utils from "../utils";
const connectionPool = db.getInstance();

export class ApplicationService {
    private constructor() { }

    private static instance = new ApplicationService();

    public static getInstance = () => ApplicationService.instance;

    public addApp = async (req, res) => {
        var HUGID = req.body.HUG;
        var recipientID = req.body.username;
        var covid = req.body.covid;
        var montly = req.body.monthly;
        var amount = req.body.amount;
        var fullName = req.body.fullName;
        var story = req.body.story;
        var fileKey1 = req.body.file0;
        var fileKey2 = req.body.file1;
        var fileKey3 = req.body.file2;
        var share = req.body.share;

        if(res.locals.userInfo === undefined){
          res.send(401);
          return; 
        }
    
        const makeHug = "INSERT INTO StripeHug (ownerID, recipientID, fundingGoal) values ('admin', ?, ?)";
        const addApplicant = "INSERT INTO HugApplicants values(?,?,?,?,true,'Pending',?,?,?,?,?,?,?);";
        
        const getLastID = "select max(hugid) as MAX from stripeHUG";
        
        let lastID;
  
        connectionPool.query(makeHug, [recipientID, amount], (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(502).json({ error });
          } else {
           
            connectionPool.query(getLastID, [], (error, results, fields) => {
              if (error) {
                console.log(error);

              } else {
                lastID = results[0].MAX
                connectionPool.query(addApplicant, [lastID, recipientID, fullName,story,covid, share,montly,amount,fileKey1,fileKey2,fileKey3], (error, results, fields) => {
                  if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                  } else {
                    res.status(200).json({ success: 'Application Sent'});
                  }
                });
              }
            })

            
          }
        });
        
        
    }

    public getApps = async (req, res) => {
        var status = req.body.status;

        if(res.locals.userInfo === undefined){
          res.send(401);
          return; 
        }
    
        const sql = "Select * from HugApplicants where Status = ?;";
        connectionPool.query(sql, [status], (error, results, fields) => {
          if (error) {
            console.log(error);
            res.status(502).json({ error });
          } else {
            var recipients = [];
            for (let i = 0; i < results.length; i++) {
                recipients.push({
                   fullName: results[i].fullName,
                   covid: results[i].covid,
                   monthly_income: results[i].monthly_income,
                   desiredAmount: results[i].desiredAmount,
                   story: results[i].story,
                   status: results[i].Status,
                   file1: results[i].fileKey1,
                   file2: results[i].fileKey2,
                   file3: results[i].fileKey3,
                   HUGID: results[i].HUGID,
                   recipientID: results[i].recipientID,
                   share: results[i].share
                })
            }

            //returns successfully in both cases (HTTP200)
            if (recipients.length > 0) {
            res.status(200).json({
                //to access these from front end: 
                success: 'Applications Found',
                recipients: recipients
            });
            } else {
            res.status(200).json({ success: 'Applicants not found' });
            }
          }
        });
    }

}