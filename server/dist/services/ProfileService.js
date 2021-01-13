"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const affordable_shared_models_1 = require("affordable-shared-models");
const DBOEmailRecordDAOImpl_1 = require("../database/dao/email/DBOEmailRecordDAOImpl");
const AddressDAO_1 = require("../database/dao/profile/AddressDAO");
const DBOLegalNameDAOImpl_1 = require("../database/dao/profile/DBOLegalNameDAOImpl");
const FinancesDAO_1 = require("../database/dao/profile/FinancesDAO");
const HealthcareDAO_1 = require("../database/dao/profile/HealthcareDAO");
const IdentificationInformationDAO_1 = require("../database/dao/profile/IdentificationInformationDAO");
const InformationProviderDAO_1 = require("../database/dao/profile/InformationProviderDAO");
const InsuranceDAO_1 = require("../database/dao/profile/InsuranceDAO");
const MarriageInformationDAO_1 = require("../database/dao/profile/MarriageInformationDAO");
const PhoneNumberDAO_1 = require("../database/dao/profile/PhoneNumberDAO");
const SexAndEthnicityDAO_1 = require("../database/dao/profile/SexAndEthnicityDAO");
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const storedProcedure = __importStar(require("../database/storedProcedure"));
const IllegalStateError_1 = require("../models/IllegalStateError");
const Address_1 = require("../models/orm/profile/Address");
const Finances_1 = require("../models/orm/profile/Finances");
const Healthcare_1 = require("../models/orm/profile/Healthcare");
const IdentificationInformation_1 = require("../models/orm/profile/IdentificationInformation");
const InformationProvider_1 = require("../models/orm/profile/InformationProvider");
const Insurance_1 = require("../models/orm/profile/Insurance");
// Imports for ORMs and DAO objects
const LegalName_1 = require("../models/orm/profile/LegalName");
const MarriageInformation_1 = require("../models/orm/profile/MarriageInformation");
const PhoneNumber_1 = require("../models/orm/profile/PhoneNumber");
const SexAndEthnicity_1 = require("../models/orm/profile/SexAndEthnicity");
const utils = __importStar(require("../utils"));
const Validation_1 = require("../utils/Validation");
const AuthorizationUtils_1 = require("./AuthorizationUtils");
const AffordableSESClient_1 = require("./email/AffordableSESClient");
const DBOAuthenticationInformationDAOImpl_1 = require("../database/dao/authentication/DBOAuthenticationInformationDAOImpl");
const connectionPool = DatabaseConnection_1.default.getInstance();
const emailService = AffordableSESClient_1.AffordableSESClient.getInstance();
class ProfileService {
    constructor(emailDao, legalNameDao) {
        this.getPrimaryEmail = async (username) => {
            Validation_1.Validation.requireParam(username, "username");
            return (await this.emailDao.getPrimaryEmail(username)).email;
        };
        //requires req.body.username, req.body.email
        this.addEmail = (req, res) => {
            const values = [
                [
                    req.body.username,
                    req.body.email,
                    false,
                    false
                ]
            ];
            const sql = 'INSERT INTO emails VALUES ?';
            connectionPool.query(sql, [values], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Email Records inserted');
                }
            });
            res.status(200).json({ success: 'email inserted' });
        };
        //requires req.body.username, req.body.email
        this.addUnverifiedEmail = (req, res) => {
            const values = [
                [
                    req.body.username,
                    req.body.email,
                    false,
                    false
                ]
            ];
            const sql = 'INSERT INTO emails VALUES ?';
            connectionPool.query(sql, [values], (error, results, fields) => {
                if (error) {
                    // console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    // console.log('Email Records inserted');
                }
            });
            res.status(200).json({ success: 'email inserted' });
        };
        //requires username
        this.verifyEmail = (req, res) => {
            const sql = 'UPDATE emails SET verified = 1 WHERE Email = ?';
            connectionPool.query(sql, [req.body.email], (error, results, fields) => {
                if (error) {
                    // console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    // console.log('Email Verified');
                }
            });
            res.status(200).json({ success: 'email inserted' });
        };
        //requires req.body.username
        this.getEmails = async (req, res) => {
            console.log(req.body.username);
            this.emailDao.getAllEmails(req.body.username)
                .then((results) => {
                if (results) {
                    if (results.length > 0) {
                        // Return emails
                        const emailList = results.map(record => {
                            return {
                                email: record.email,
                                isPrimary: record.isPrimary,
                                verified: record.verified
                            };
                        });
                        res.status(200).json({
                            success: 'Emails Found',
                            emails: emailList
                        });
                    }
                    else {
                        // User must not exist
                        res.status(404).json({ error: 'Username does not exist' });
                    }
                }
            }).catch(error => {
                // Error
                console.log(error);
                res.status(502).json({ error });
            });
        };
        //requires req.body.username
        this.getDevices = (req, res) => {
            console.log('Getting Devices for ' + req.body.username + '...');
            const sql = 'SELECT * FROM twofactor WHERE username = ? ';
            connectionPool.query(sql, [req.body.username], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    const deviceList = [];
                    for (let i = 0; i < results.length; ++i) {
                        deviceList.push({
                            deviceName: results[i].DeviceName,
                            username: results[i].Username
                        });
                        console.log('Device ' + (i + 1) + ': ' + results[i].DeviceName);
                    }
                    if (results.length > 0) {
                        res.status(200).json({
                            success: 'Devices Found',
                            devices: deviceList
                        });
                    }
                    else {
                        res.status(200).json({ success: 'User does not have any two factor devices' });
                    }
                }
            });
        };
        //requires req.body.randomString
        this.getRequest = (req, res) => {
            console.log('IN REQUEST');
            const sql = 'SELECT * FROM requests WHERE RandomString = ? ';
            connectionPool.query(sql, [req.body.randomString], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    if (results[0]) {
                        res.status(200).json({
                            success: 'request found',
                            Username: results[0].Username,
                            NewEmail: results[0].NewEmail,
                            OldEmail: results[0].OldEmail,
                            RandomString: results[0].RandomString,
                            Timestamp: results[0].Timestamp,
                        });
                    }
                    else {
                        res.status(502).json({ failure: 'Cannot find request' });
                    }
                }
            });
        };
        //requires req.body.randomString
        this.removeRequest = (req, res) => {
            console.log('deleting!: ' + req.body);
            console.log('deleting!: ' + req.body.randomstring);
            const sql = 'DELETE FROM requests WHERE RandomString = ? ';
            connectionPool.query(sql, [req.body.randomstring], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    res.status(200).json({
                        success: 'request removed'
                    });
                }
            });
        };
        this.getUserType = (req, res) => {
            console.log('user: ' + req.body.username);
            const sql = 'SELECT * FROM AuthenticationInformation WHERE username = ?';
            connectionPool.query(sql, [req.body.username], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    if (results[0]) {
                        res.status(200).json({
                            success: 'User Type Found',
                            usertype: results[0].isDonor
                        });
                    }
                    else {
                        res.status(502).json({ error: 'Username does not exist' });
                    }
                }
            });
        };
        //requires req.body.email
        this.deleteEmail = (req, res) => {
            // TODO: Don't let the user delete an email that is primary? otherwise the app crashes?
            const sql = 'DELETE FROM emails WHERE email = ?';
            connectionPool.query(sql, req.body.email, (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    res.status(200).json({ success: 'Email Deleted' });
                }
            });
        };
        //requires req.body.newEmail, req.body.oldEmail
        this.updateEmail = (req, res) => {
            let sql = 'UPDATE emails SET email = ? WHERE email = ?';
            connectionPool.query(sql, [req.body.newEmail, req.body.oldEmail], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    sql = 'UPDATE AuthenticationInformation SET email = ? WHERE email = ?';
                    connectionPool.query(sql, [req.body.newEmail, req.body.oldEmail], (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.status(502).json({ error });
                        }
                        else {
                            res.status(200).json({ success: 'Email Updated' });
                        }
                    });
                }
            });
        };
        //rewquires username, current password and new password
        this.changePassword = (req, res) => {
            const new_password = req.body.newPw;
            const email = req.body.email;
            let requireTwoFactor = false;
            const sql = 'SELECT * FROM AuthenticationInformation WHERE Username = ? AND Password = ?';
            connectionPool.query(sql, [req.body.username, req.body.currentPw], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    let validLogin = false;
                    if (results[0]) {
                        validLogin = true;
                    }
                    if (validLogin) {
                        if (results[0].RequiresTwoFactorAuthentication === 'true') {
                            console.log('User requires Two Factor');
                            requireTwoFactor = true;
                        }
                        connectionPool.query(storedProcedure.updatePasswordByUsername, [[req.body.username, new_password]], (error, results, fields) => {
                            if (error) {
                                console.log(error);
                                res.status(502).json({ error });
                            }
                            else {
                                if (!requireTwoFactor) {
                                    console.log('Password Updated!');
                                    console.log('Sending notification email that password has been changed');
                                    emailService.sendEmail({
                                        from: 'donotreply@affordhealth.org',
                                        to: email,
                                        subject: 'Affordable:: Your password has been changed!',
                                        html: utils.formatEmail([
                                            '<h2>There has been an attempt to change the password for your account with the username: ' + req.body.username
                                        ])
                                    });
                                }
                                res.status(200).json({ success: 'Password Updated', requiresTwoFactor: requireTwoFactor });
                            }
                        });
                    }
                    else {
                        res.status(200).json({ success: 'Incorrect Current Password' });
                    }
                }
            });
        };
        this.changePrimaryEmailVerify = (req, res) => {
            res.status(500).json({ status: "Unimplemented" });
            return;
            const values = [
                [
                    req.body.username,
                    req.body.newEmail,
                    req.body.oldEmail,
                    req.body.randomString,
                    req.body.timestamp
                ]
            ];
            const sql = 'INSERT INTO requests VALUES ?';
            connectionPool.query(sql, [values], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Request inserted!');
                }
            });
            const email = req.body.newEmail;
            const oldEmail = req.body.oldEmail;
            const url = 'temp=' + req.body.randomString;
            const urlEncrypt = encodeURIComponent(url);
            const desiredLink = process.env.AFFORDABLE_FRONTEND_URL + '/change_primary_email_verify?' + urlEncrypt;
            const desiredText = 'Click Here';
            if (email) {
                emailService.sendEmail({
                    from: 'donotreply@affordhealth.org',
                    to: email,
                    subject: 'Affordable:: Please Verify your Email',
                    html: utils.formatEmail([
                        '<h2>Your old email was: ' + oldEmail +
                            'Click on the following link to verify your new email as ' +
                            email +
                            ': </h2> <a href="' +
                            desiredLink + '">' +
                            desiredText + '</a>'
                    ])
                });
            }
            res.sendStatus(200);
        };
        this.addSecondaryEmailVerify = (req, res) => {
            req.body.secret = 0;
            const values = [
                [
                    req.body.username,
                    req.body.newEmail,
                    req.body.oldEmail,
                    req.body.randomString,
                    req.body.timestamp,
                    req.body.secret
                ]
            ];
            const sql = 'INSERT INTO requests VALUES ?';
            connectionPool.query(sql, [values], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Request inserted!');
                }
            });
            const email = req.body.newEmail;
            const oldEmail = req.body.oldEmail;
            const url = 'temp=' + req.body.randomString;
            const urlEncrypt = encodeURIComponent(url);
            if (email) {
                const desiredLink = process.env.AFFORDABLE_FRONTEND_URL + '/add_secondary_email_verify?' + urlEncrypt;
                const desiredText = 'Click Here';
                emailService.sendEmail({
                    from: 'donotreply@affordhealth.org',
                    to: email,
                    subject: 'Affordable:: Please Verify your Email',
                    html: utils.formatEmail([
                        '<h2>Click on the following link verify your secondary email as ' + email + ': </h2> <a href="' + desiredLink + '">' + desiredText + '</a>'
                    ])
                });
            }
            res.sendStatus(200);
        };
        //requires req.body.username, req.body.email
        this.makePrimary = (req, res) => {
            let sql = 'UPDATE emails SET primary_ind = 0 WHERE username = ?';
            connectionPool.query(sql, [req.body.username], (error, results, fields) => {
                if (error) {
                    // console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    sql = 'UPDATE AuthenticationInformation SET email = ? WHERE username = ?';
                    connectionPool.query(sql, [req.body.email, req.body.username], (error, results, fields) => {
                        if (error) {
                            // console.log(error);
                            res.status(502).json({ error });
                        }
                        else {
                            sql = 'UPDATE emails SET primary_ind = 1 WHERE email = ?';
                            connectionPool.query(sql, [req.body.email], (error, results, fields) => {
                                if (error) {
                                    // console.log(error);
                                    res.status(502).json({ error });
                                }
                                else {
                                    res.status(200).json({ success: 'Email Updated' });
                                }
                            });
                        }
                    });
                }
            });
        };
        // TODO - fix bug when phone is added with an apostrophe.
        this.addTwoFactor = (req, res) => {
            const values = [
                [
                    req.body.DeviceName,
                    req.body.Username,
                    req.body.Email,
                    req.body.RandomString,
                    req.body.Timestamp,
                    req.body.Secret
                ]
            ];
            const sql = 'INSERT INTO twofactor VALUES ?';
            connectionPool.query(sql, [values], (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    console.log('Two Factor Deivce inserted');
                }
            });
            this.authenticationInformationDAO.setUserRequiresTwoFactorAuthentication(req.body.Username, true);
            res.status(200).json({ success: 'Two Factor Deivce inserted' });
            //setup email client
            emailService.sendEmail({
                from: 'donotreply@affordhealth.org',
                to: req.body.Email,
                subject: 'Affordable:: Added MFA implementation!',
                html: utils.formatEmail([
                    '<h2>Congratulations! You\'ve added MultiFactor Authentication for the profile of: ' + req.body.username
                ])
            });
        };
        this.removeTwoFactor = (req, res) => {
            console.log('Removing Device: ' + req.body.DeviceName);
            console.log('From Account with Username: ' + req.body.Username);
            var sql = '';
            var params = [];
            if (req.body.DeviceName != null) {
                sql = 'DELETE FROM twofactor WHERE DeviceName = ? AND Username = ?';
                params = [req.body.DeviceName, req.body.Username];
            }
            else {
                sql = 'DELETE FROM twofactor WHERE Username = ?';
                params = [req.body.Username];
                // TODO separate out to separate endpoint when multiple devices can be added.
                this.authenticationInformationDAO.setUserRequiresTwoFactorAuthentication(req.body.Username, false);
                // connectionPool.query('UPDATE AuthenticationInformation SET RequiresTwoFactorAuthentication = false WHERE Username = ?', [req.body.Username], (error, results, fields) => {
                //     if (error) {
                //         console.log(error);
                //         res.status(502).json({ error });
                //         return;
                //     }
                // });
            }
            let changedRows;
            connectionPool.query(sql, params, (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.status(502).json({ error });
                }
                else {
                    changedRows = results.affectedRows;
                    if (changedRows == 0) {
                        console.log('No two factor device with name ' + req.body.DeviceName + ' in database');
                        res.status(200).json({
                            success: 'No two factor device with name ' + req.body.DeviceName + ' in database',
                            changed: 0
                        });
                    }
                    else {
                        res.status(200).json({
                            success: 'Two Factor Device Removed',
                            changed: 1
                        });
                        console.log('Two Factor Device Removed');
                    }
                }
            });
            emailService.sendEmail({
                from: 'donotreply@affordhealth.org',
                to: req.body.Email,
                subject: 'Affordable:: Upadate to MFA implementation',
                html: utils.formatEmail([
                    '<h2>The following account has removed a MultiFactor Authentication from its profile: ' + req.body.username
                ])
            });
        };
        this.emailDao = emailDao !== null && emailDao !== void 0 ? emailDao : new DBOEmailRecordDAOImpl_1.DBOEmailRecordDAOImpl();
        this.legalNameDao = legalNameDao !== null && legalNameDao !== void 0 ? legalNameDao : new DBOLegalNameDAOImpl_1.DBOLegalNameDAOImpl();
        this.sexAndEthnicityDao = new SexAndEthnicityDAO_1.SexAndEthnicityDAO();
        this.identificationInformationDAO = new IdentificationInformationDAO_1.IdentificationInformationDAO();
        this.addressDAO = new AddressDAO_1.AddressDAO();
        this.marriageDAO = new MarriageInformationDAO_1.MarriageInformationDAO();
        this.phoneNumberDAO = new PhoneNumberDAO_1.PhoneNumberDAO();
        this.informationProviderDAO = new InformationProviderDAO_1.InformationProviderDAO();
        this.insuranceDAO = new InsuranceDAO_1.InsuranceDAO();
        this.financesDAO = new FinancesDAO_1.FinancesDAO();
        this.healthcareDAO = new HealthcareDAO_1.HealthcareDAO();
        this.authenticationInformationDAO = new DBOAuthenticationInformationDAOImpl_1.DBOAuthenticationInformationDAOImpl();
    }
    /**
     * Save a profile into the database
     * @param profile A Profile model object
     * @param userId The AuthenticationInformation.id of the current user,
     *                  it will be used as a foreign key for profile tables
     */
    async createProfile(profile, userInfo) {
        AuthorizationUtils_1.AuthorizationUtils.checkAuthorization(userInfo, false, affordable_shared_models_1.UserType.RECIPIENT);
        Validation_1.Validation.requireArray(profile.legalNames, "legalNames");
        // Validation.requireParam(profile.sex, "sex");
        // Validation.requireParam(profile.ethnicity, "ethnicity");
        Validation_1.Validation.requireParam(profile.birthDate, "birthDate");
        // Validation.requireParam(profile.identificationInfo, "identificationInfo");
        Validation_1.Validation.requireParam(profile.address, "address");
        // Validation.requireParam(profile.maritalStatus, "maritalStatus");
        // Validation.requireParam(profile.numberOfProvidedChildren, "numberOfProvidedChildren");
        Validation_1.Validation.requireArray(profile.phoneNumbers, "phoneNumbers");
        // Validation.requireParam(profile.preferredLanguage, "preferredLanguage");
        // Validation.requireParam(profile.informationProvider, "informationProvider");
        // Validation.requireParam(profile.finances, "finances");
        const userId = userInfo.id;
        // *** legalNames ***
        const legalNameArr = ProfileService.getLegalNames(profile, userId);
        console.log(legalNameArr);
        for (const element of legalNameArr) {
            await this.legalNameDao.addLegalName(element);
        }
        // *** phoneNumbers ***
        const phoneNumArr = ProfileService.getPhoneNumbers(profile, userId);
        for (const element of phoneNumArr) {
            await this.phoneNumberDAO.addPhoneNumber(element);
        }
        // *** identificationInformation ***
        const idInfo = ProfileService.getIdentificationInformation(userId, profile);
        await this.identificationInformationDAO.addIdentificationInformation(idInfo);
        // *** address ***
        const address = ProfileService.getAddress(userId, profile);
        await this.addressDAO.addAddress(address);
        // The following parts of the profile object were removed to simplify the form.
        // *** sexAndEthnicity ***
        // const sexAndEthnicity = ProfileService.getSexAndEthnicity(userId, profile);
        // await this.sexAndEthnicityDao.addSexAndEthnicity(sexAndEthnicity);
        // *** marriageInformation ***
        // const marriageInfo = ProfileService.getMarriageInformation(userId, profile);
        // await this.marriageDAO.addMarriageInformation(marriageInfo);
        // *** informationProvider ***
        // const infoProvider = ProfileService.getInformationProvider(userId, profile);
        // await this.informationProviderDAO.addInformationProvider(infoProvider);
        // *** healthInsurance ***
        // const insurance = ProfileService.getHealthInsurance(userId, profile);
        // await this.insuranceDAO.addInsurance(insurance);
        // *** finances ***
        // const finances = ProfileService.getFinances(userId, profile);
        // await this.financesDAO.addFinances(finances);
        // *** healthCare ***
        // const hc = ProfileService.getHealthCare(userId, profile);
        // await this.healthcareDAO.addHealthcare(hc);
    }
    static getHealthCare(userId, profile) {
        const hc = new Healthcare_1.Healthcare();
        hc.userId = userId;
        if (profile.healthCare != null) { // then the user has a physician
            hc.hasPhysician = true;
            hc.physicianFirstName = profile.healthCare.firstName;
            hc.physicianLastName = profile.healthCare.lastName;
            hc.physicianLocation = profile.healthCare.practiceLocation;
        }
        else { // the user does not have a physician
            hc.hasPhysician = false;
        }
        return hc;
    }
    static getFinances(userId, profile) {
        const finances = new Finances_1.Finances;
        finances.userId = userId;
        finances.employmentStatus = profile.finances.currentlyEmployed;
        if (profile.finances.currentlyEmployed == true) { // then the user is employed
            finances.currentEmployer = profile.finances.employedInfo.employerName;
            finances.positionTitle = profile.finances.employedInfo.positionTitle;
            finances.grossAnnualIncome = profile.finances.employedInfo.grossAnnualIncome;
        }
        else { // then the user is unemployed
            finances.unemploymentPeriod = profile.finances.unemployedInfo.lengthOfUnemployment;
            // TODO: not sure what profile.finances.unemployedInfo.supportSource is for
        }
        finances.receivesFinancialAssistance = profile.finances.receiveFinancialAssistance;
        if (profile.finances.receiveFinancialAssistance == true) {
            finances.assistanceExplanation = profile.finances.assistanceText;
        }
        finances.receivesSocialSecurity = profile.finances.receiveSocialSecurity;
        finances.numberOfPeopleInHousehold = profile.finances.peopleInHouseHold;
        return finances;
    }
    static getHealthInsurance(userId, profile) {
        const insurance = new Insurance_1.Insurance;
        insurance.userId = userId;
        // Check to see if the user had health insurance
        if (profile.healthInsurance != null) {
            insurance.hasInsurance = true;
            insurance.primaryInsurance = profile.healthInsurance.primaryCarrier;
            insurance.planType = profile.healthInsurance.planType;
            insurance.policyId = profile.healthInsurance.policyNumber;
            // Check to see if the policy holder is the user
            if (profile.healthInsurance.policyHolderIsSelf == true) {
                insurance.policyHolder = "self";
            }
            else { // the policy holder is someone else
                insurance.policyHolder = profile.healthInsurance.policyHolderName;
            }
            insurance.insuranceFromEmployer = profile.healthInsurance.offeredByEmployer;
            insurance.companyName = profile.healthInsurance.employerName;
            insurance.groupNumberPlanCode = profile.healthInsurance.groupNumber;
            insurance.hasDeductiblesOrCoPayments = profile.healthInsurance.deductiblesOrCopayments;
            // TODO: add insurance.deductibleAmount and insurance.copayment
        }
        else { // the user does not have insurance
            insurance.hasInsurance = false;
        }
        return insurance;
    }
    static getInformationProvider(userId, profile) {
        const infoProvider = new InformationProvider_1.InformationProvider();
        infoProvider.userId = userId;
        if (profile.informationProvider.self == true) { // then the info provider is the user
            infoProvider.informationProvider = "self";
        }
        else { // the info provider is someone else
            // Check to see that the provider name was given
            if (profile.informationProvider.providerName != null) {
                infoProvider.informationProvider = profile.informationProvider.providerName;
            }
            else {
                console.log("ERROR: The information provider's name must be provided.");
            }
        }
        infoProvider.relationshipToPatient = profile.informationProvider.providerRelationship;
        infoProvider.placeOfEmployment = profile.informationProvider.providerEmployment;
        return infoProvider;
    }
    static getPhoneNumbers(profile, userId) {
        const preferredLanguage = profile.preferredLanguage;
        const phoneNumArr = [];
        for (let i = 0; i < profile.phoneNumbers.length; i++) {
            const phoneNum = new PhoneNumber_1.PhoneNumber;
            phoneNum.userId = userId;
            phoneNum.phone = profile.phoneNumbers[i];
            phoneNum.preference = i;
            phoneNum.preferredLanguage = preferredLanguage;
            phoneNumArr.push(phoneNum);
        }
        return phoneNumArr;
    }
    static getMarriageInformation(userId, profile) {
        const marriageInfo = new MarriageInformation_1.MarriageInformation;
        marriageInfo.userId = userId;
        marriageInfo.marriageStatus = profile.maritalStatus;
        marriageInfo.numberOfChildren = profile.numberOfProvidedChildren;
        return marriageInfo;
    }
    static getAddress(userId, profile) {
        const address = new Address_1.Address;
        address.userId = userId;
        address.street = profile.address.street;
        address.city = profile.address.city;
        address.state = profile.address.state;
        address.zipcode = profile.address.zip;
        return address;
    }
    static getIdentificationInformation(userId, profile) {
        const idInfo = new IdentificationInformation_1.IdentificationInformation;
        idInfo.userId = userId;
        idInfo.birthdate = profile.birthDate;
        // The following parts of the profile object were removed to simplify the form.
        // idInfo.SSN = profile.identificationInfo.ssn;
        // idInfo.citizenshipStatus = profile.identificationInfo.citizenshipStatus;
        // idInfo.countryOfBirth = profile.identificationInfo.countryOfBirth;
        // idInfo.alienNumber = profile.identificationInfo.alienNumber
        return idInfo;
    }
    static getSexAndEthnicity(userId, profile) {
        const sexAndEthnicity = new SexAndEthnicity_1.SexAndEthnicity();
        sexAndEthnicity.userId = userId;
        sexAndEthnicity.biologicalSex = profile.sex;
        sexAndEthnicity.ethnicity = profile.ethnicity;
        return sexAndEthnicity;
    }
    static getLegalNames(profile, userId) {
        console.log(profile.legalNames);
        // looping through the profile array of legal names (in case the user has multiple), and adding them to array
        const legalNameArr = [];
        profile.legalNames.forEach(element => {
            const legalName = new LegalName_1.LegalName;
            legalName.userId = userId;
            legalName.firstName = element.firstName;
            legalName.middleName = element.middleName;
            legalName.lastName = element.lastName;
            legalName.suffix = element.suffix;
            legalName.isCurrentLegalName = element.currentName;
            legalNameArr.push(legalName);
        });
        return legalNameArr;
    }
    async getProfile(userId) {
        const profile = new affordable_shared_models_1.ProfileFields.Profile();
        // From each Dao, get the object, and map it to the corresponding field in the profile
        // We don't wrap the legal name in a try/catch because every user with a profile should have a legal name.
        // i.e. if they don't have a legal name, let the request fail.
        const legalNameORMArray = await this.legalNameDao.getAllLegalNamesWithUserId(userId);
        profile.legalNames = ProfileService.convertLegalNamesToDto(legalNameORMArray);
        const addressORM = await this.addressDAO.getAddressByUserId(userId);
        profile.address = ProfileService.convertAddressToDto(addressORM);
        const identificationORM = await this.identificationInformationDAO.getIdentificationInformationByUserId(userId);
        profile.birthDate = identificationORM.birthdate;
        // profile.identificationInfo = ProfileService.convertIdentificationInfoToDto(identificationORM);
        const phoneNumberORM = await this.phoneNumberDAO.getAllPhoneNumbersByUserId(userId);
        profile.phoneNumbers = ProfileService.convertPhoneNumbersToDto(phoneNumberORM);
        // profile.preferredLanguage = phoneNumberORM[0].preferredLanguage;
        // The following parts of the profile object were removed to simplify the form.
        // const financesORM = await this.financesDAO.getFinancesByUserId(userId);
        // profile.finances = ProfileService.convertFinancesToDto(financesORM);
        // const healthcareORM = await this.healthcareDAO.getHealthcareByUserId(userId);
        // profile.healthCare = ProfileService.convertHealthcareToDto(healthcareORM);
        // const informationProviderORM = await this.informationProviderDAO.getInformationProviderByUserId(userId);
        // profile.informationProvider = ProfileService.convertInformationProviderToDto(informationProviderORM);
        // const insuranceORM = await this.insuranceDAO.getInsuranceByUserId(userId);
        // profile.healthInsurance = ProfileService.convertHealthInsuranceToDto(insuranceORM);
        // const marriageInfoORM = await this.marriageDAO.getMarriageInformationByUserId(userId);
        // profile.maritalStatus = ProfileService.convertMaritalStatusToDto(marriageInfoORM.marriageStatus);
        // profile.numberOfProvidedChildren = marriageInfoORM.numberOfChildren;
        // const sexAndEthnicityORM = await this.sexAndEthnicityDao.getSexAndEthnicityByUserId(userId);
        // profile.sex = ProfileService.convertBiologicalSexToDto(sexAndEthnicityORM.biologicalSex);
        // profile.ethnicity = sexAndEthnicityORM.ethnicity;
        return profile;
    }
    static convertBiologicalSexToDto(sex) {
        switch (sex) {
            case "Male":
                return affordable_shared_models_1.ProfileFields.BiologicalSex.MALE;
            case "Female":
                return affordable_shared_models_1.ProfileFields.BiologicalSex.FEMALE;
            default:
                throw new IllegalStateError_1.IllegalStateError("Expected to find one of {" + Object.values(affordable_shared_models_1.ProfileFields.BiologicalSex).map(e => e.toString()).join(", ") + "} but found " + sex);
        }
    }
    static convertPhoneNumbersToDto(phoneNumberORM) {
        const phoneArr = [];
        phoneNumberORM.sort();
        phoneNumberORM.forEach(element => {
            phoneArr.push(element.phone);
        });
        return phoneArr;
    }
    static convertMaritalStatusToDto(status) {
        switch (status) {
            case affordable_shared_models_1.ProfileFields.MaritalStatus.MARRIED.toString():
                return affordable_shared_models_1.ProfileFields.MaritalStatus.MARRIED;
            case affordable_shared_models_1.ProfileFields.MaritalStatus.UNMARRIED.toString():
                return affordable_shared_models_1.ProfileFields.MaritalStatus.UNMARRIED;
            case affordable_shared_models_1.ProfileFields.MaritalStatus.DIVORCED.toString():
                return affordable_shared_models_1.ProfileFields.MaritalStatus.DIVORCED;
            default:
                throw new IllegalStateError_1.IllegalStateError("Expected to find one of {" + Object.values(affordable_shared_models_1.ProfileFields.MaritalStatus).map(e => e.toString()).join(", ") + "} but found " + status);
        }
    }
    static convertHealthInsuranceToDto(insuranceORM) {
        let hi;
        if (insuranceORM.hasInsurance) {
            hi = new affordable_shared_models_1.ProfileFields.HealthInsuranceInfo();
            hi.primaryCarrier = insuranceORM.primaryInsurance;
            hi.planType = affordable_shared_models_1.ProfileFields.HealthInsurancePlanType[insuranceORM.planType];
            hi.policyNumber = insuranceORM.policyId;
            if (insuranceORM.policyHolder == "self") {
                hi.policyHolderIsSelf = true;
            }
            else {
                hi.policyHolderIsSelf = false;
            }
            hi.policyHolderName = insuranceORM.policyHolder;
            hi.offeredByEmployer = insuranceORM.insuranceFromEmployer;
            hi.employerName = insuranceORM.companyName;
            hi.groupNumber = insuranceORM.groupNumberPlanCode;
            hi.deductiblesOrCopayments = insuranceORM.hasDeductiblesOrCoPayments;
        }
        else {
            hi = null;
        }
        return hi;
    }
    static convertInformationProviderToDto(informationProviderORM) {
        const infoProvider = new affordable_shared_models_1.ProfileFields.InformationProvider();
        if (informationProviderORM.informationProvider == "self") {
            infoProvider.self = true;
        }
        else {
            infoProvider.self = false;
        }
        infoProvider.providerName = informationProviderORM.informationProvider;
        infoProvider.providerRelationship = informationProviderORM.relationshipToPatient;
        infoProvider.providerEmployment = informationProviderORM.placeOfEmployment;
        return infoProvider;
    }
    static convertIdentificationInfoToDto(identificationORM) {
        const idInfo = new affordable_shared_models_1.ProfileFields.IdentificationInfo();
        idInfo.citizenshipStatus = affordable_shared_models_1.ProfileFields.CitizenshipStatus[identificationORM.citizenshipStatus];
        idInfo.countryOfBirth = identificationORM.countryOfBirth;
        idInfo.ssn = identificationORM.SSN;
        idInfo.alienNumber = identificationORM.alienNumber;
        return idInfo;
    }
    static convertHealthcareToDto(healthcareORM) {
        const hc = new affordable_shared_models_1.ProfileFields.PhysicianInfo();
        hc.firstName = healthcareORM.physicianFirstName;
        hc.lastName = healthcareORM.physicianLastName;
        hc.practiceLocation = healthcareORM.physicianLocation;
        return hc;
    }
    static convertFinancesToDto(financesORM) {
        let employedInfo = new affordable_shared_models_1.ProfileFields.EmployedInfo();
        let unemployedInfo = new affordable_shared_models_1.ProfileFields.UnemployedInfo();
        if (financesORM.employmentStatus == true) { // they are employed
            employedInfo.employerName = financesORM.currentEmployer;
            employedInfo.positionTitle = financesORM.positionTitle;
            employedInfo.grossAnnualIncome = financesORM.grossAnnualIncome;
            unemployedInfo = null;
        }
        else {
            unemployedInfo.lengthOfUnemployment = financesORM.unemploymentPeriod;
            //unemployedInfo.supportSource = financesORM.
            employedInfo = null;
        }
        const finances = new affordable_shared_models_1.ProfileFields.FinanceInfo();
        finances.currentlyEmployed = financesORM.employmentStatus;
        finances.employedInfo = employedInfo;
        finances.unemployedInfo = unemployedInfo;
        finances.receiveFinancialAssistance = financesORM.receivesFinancialAssistance;
        finances.assistanceText = financesORM.assistanceExplanation;
        finances.receiveSocialSecurity = financesORM.receivesSocialSecurity;
        finances.peopleInHouseHold = financesORM.numberOfPeopleInHousehold;
        return finances;
    }
    static convertAddressToDto(addressORM) {
        const address = new affordable_shared_models_1.ProfileFields.Address();
        address.city = addressORM.city;
        address.state = addressORM.state;
        address.street = addressORM.street;
        address.zip = addressORM.zipcode;
        return address;
    }
    static convertLegalNamesToDto(legalNameORMArray) {
        const legalNameArr = new Array();
        legalNameORMArray.forEach(element => {
            const legalName = new affordable_shared_models_1.ProfileFields.LegalName();
            legalName.firstName = element.firstName;
            legalName.middleName = element.middleName;
            legalName.lastName = element.lastName;
            legalName.suffix = affordable_shared_models_1.ProfileFields.Suffix[element.suffix];
            legalName.currentName = element.isCurrentLegalName;
            legalNameArr.push(legalName);
        });
        return legalNameArr;
    }
    async deleteProfile(userId) {
        this.addressDAO.deleteUserAddressById(userId);
        this.financesDAO.deleteUserFinancesById(userId);
        this.healthcareDAO.deleteUserHealthcareById(userId);
        this.identificationInformationDAO.deleteUserIdentificationInformationById(userId);
        this.informationProviderDAO.deleteUserInformationProviderById(userId);
        this.insuranceDAO.deleteUserInsuranceById(userId);
        this.legalNameDao.deleteUserLegalNamesById(userId);
        this.marriageDAO.deleteUserMarriageInformationById(userId);
        this.phoneNumberDAO.deleteUserPhoneNumbersById(userId);
        this.sexAndEthnicityDao.deleteUserSexAndEthnicityById(userId);
    } // end of deleteProfile()
}
exports.ProfileService = ProfileService;
