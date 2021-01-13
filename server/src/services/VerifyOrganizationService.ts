import { promisify } from 'util';
import db from "../database/DatabaseConnection";
import * as utils from "../utils";
import { AffordableSESClient } from "./email/AffordableSESClient";
import request from "request";

const connectionPool = db.getInstance();
const emailService = AffordableSESClient.getInstance();
const requestPromise = promisify(request);

const _EXTERNAL_URL = 'https://projects.propublica.org/nonprofits/api/v2/organizations/';

export class VerifyOrganizationService {

    //Verify Organization
    public verifyOrganization = async (req, res1) => {
        const orgValues = {
            orgName: req.body.orgName,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            ein: req.body.ein,
            taxSection: req.body.taxSection,
            irsActivityCode: req.body.irsActivityCode
        };

        const orgName = req.body.orgName;

        const getOrgId = async (res, res1, compare) => {
            //Get org id
            const sqlOrgId = 'SELECT ID FROM Organization WHERE name=\"' + req.body.orgName + "\"";
            let exists = false;
            //Perform query
            await connectionPool.query(sqlOrgId, function (error, orgId) {
                if (error) {
                    //successfulQuery = false;
                    res.status(502).json({ error });
                    console.log("error");
                }
                else {
                    console.log(orgId);
                    let orgDbId = 0;
                    exists = orgId.length > 0;
                    if (exists) {
                        orgDbId = orgId[0].ID;
                        console.log(orgId);
                        console.log('Organization ID found ' + orgDbId);
                    }

                    if (compare && exists) { //info matches ProPublica and exists in db
                        console.log("Organization is valid and exists in database");
                        res1.status(res.statusCode).json({ 'status': 'OK', 'valid': 'true' });
                    } else if (!exists) { //org not added to db
                        console.log("Organization is NOT valid, does not exist in database");
                        res1.status(res.statusCode).json({ 'status': 'NOT OK', 'valid': 'false' });
                    } else { //potential mismatch of info
                        console.log("Further verification needed");
                        res1.status(res.statusCode).json({ 'status': 'OK', 'valid': 'false' });
                    }



                    //return orgId[0].ID;
                    //res.status(200).json({'status':'OK'});
                    if (orgDbId) {
                        const sqlOrgIRSInfo = 'UPDATE Organization SET ein=?, taxSection=?, IRSActivityCode=? WHERE ID=' + orgDbId;
                        console.log(sqlOrgIRSInfo);
                        const orgIRSInfo = [
                            req.body.ein, req.body.taxSection, req.body.irsActivityCode
                        ];

                        connectionPool.query(sqlOrgIRSInfo, orgIRSInfo, (error) => {
                            if (error) {
                                console.log(error);
                                console.log("HERE");
                                const successfulQuery = false;
                                res.status(502).json({ error });
                            }
                            else {
                                console.log('Organization Records updated');
                                //res.status(200).json({'status':'OK'});
                            }
                        });

                        const validationMessage = compare ? "Match" : "Different";

                        if (validationMessage === "Match") {
                            const sqlOrgVerified = 'UPDATE Organization SET verified=true WHERE ID=' + orgDbId;

                            connectionPool.query(sqlOrgVerified, (error) => {
                                if (error) {
                                    console.log(error);
                                    const successfulQuery = false;
                                    res.status(502).json({ error });
                                } else {
                                    console.log('Organization was successfully verified');
                                }
                                //Will only send status 200 if all previous queries were successful
                            });
                        }
                        const sqlOrgLocation = 'INSERT INTO OrgLocations VALUES ?';
                        const orgLocationInfo = [[
                            null, orgDbId, validationMessage, req.body.addressLine1, req.body.addressLine2, req.body.city, req.body.state, req.body.zip
                        ]];

                        //Performs query
                        connectionPool.query(sqlOrgLocation, [orgLocationInfo], (error) => {
                            if (error) {
                                console.log(error);
                                const successfulQuery = false;
                                res.status(502).json({ error });
                            } else {
                                console.log('Organization Verify Location types inserted');
                            }
                            //Will only send status 200 if all previous queries were successful
                        });
                    }
                }
            });
            return exists;
        };


        const orgLocationMatch = async (orgId, compare) => {

        };

        //     await requestPromise(_EXTERNAL_URL + req.body.ein + '.json', { json: true }, (err, res, body) => {
        //         if (err) {
        //             console.log("ERROR");
        //             res1.status(502).json({ err });

        //         }
        //         // res.status(200).json({'status':'OK'});
        //         // console.log("Success");
        //         console.log(res.statusCode);
        //         const proPublicaBody = body.organization;

        //         if (res.statusCode === 200) {
        //             let compare = true;

        //             if (req.body.orgName.toUpperCase() != proPublicaBody.name) {
        //                 compare = false;
        //             }
        //             //Will concatenate addressLine1 and addressLine2 if addressLine2 exists
        //             const addressConcat = req.body.addressLine1.toUpperCase() + (req.body.addressLine2 == "" ? "" : (" " + req.body.addressLine2));
        //             if (compare && addressConcat != proPublicaBody.address) {
        //                 compare = false;
        //             } if (compare && req.body.city.toUpperCase() != proPublicaBody.city) {
        //                 compare = false;
        //             } if (compare && req.body.state.toUpperCase() != proPublicaBody.state) {
        //                 compare = false;
        //             } if (compare && req.body.zip != proPublicaBody.zipcode.substring(0, 5)) {
        //                 compare = false;
        //             } if (compare && req.body.ein != proPublicaBody.ein) {
        //                 compare = false;
        //             } if (compare && req.body.taxSection != proPublicaBody.subsection_code) {
        //                 compare = false;
        //             } if (compare && req.body.irsActivityCode.toUpperCase() != proPublicaBody.ntee_code) {
        //                 compare = false;
        //             }
        //             const orgExists = getOrgId(res, res1, compare);
        //             console.log(orgExists);

        //             //console.log("YES" + orgId);



        //         } else {
        //             res1.status(res.statusCode).json({ 'status': '404 Not Found', 'valid': 'false' });
        //         }


        //         //return proPublicaBody;
        //     });
        // };

    };

    //Send verification email for verify org
    public sendVerificationEmailForVerifyOrg = (req, res) => {
        //donor admin user email
        const email = req.body.email;
        emailService.sendEmail({
            from: 'donotreply@affordhealth.org',
            to: email,
            subject: 'Affordable:: About Your Organization',
            html: utils.formatVerifyOrgEmail("orgName"), // TODO: variable 'orgname' was undefined
            attachments: [{
                filename: 'EmailsLogo.png',
                path: '../app/src/assets/images/EmailsLogo.png',
                cid: 'VerifyEmailsLogo'
            }]
        });
        res.sendStatus(200);
    };
}