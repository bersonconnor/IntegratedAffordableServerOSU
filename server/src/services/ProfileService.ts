import { ProfileFields, UserInfo, UserType } from "affordable-shared-models";
import { DBOEmailRecordDAOImpl } from "../database/dao/email/DBOEmailRecordDAOImpl";
import { EmailDAO } from "../database/dao/email/EmailDAO";
import { AddressDAO } from "../database/dao/profile/AddressDAO";
import { DBOLegalNameDAOImpl } from "../database/dao/profile/DBOLegalNameDAOImpl";
import { FinancesDAO } from "../database/dao/profile/FinancesDAO";
import { HealthcareDAO } from "../database/dao/profile/HealthcareDAO";
import { IdentificationInformationDAO } from "../database/dao/profile/IdentificationInformationDAO";
import { InformationProviderDAO } from "../database/dao/profile/InformationProviderDAO";
import { InsuranceDAO } from "../database/dao/profile/InsuranceDAO";
import { LegalNameDAO } from "../database/dao/profile/LegalNameDAO";
import { MarriageInformationDAO } from "../database/dao/profile/MarriageInformationDAO";
import { PhoneNumberDAO } from "../database/dao/profile/PhoneNumberDAO";
import { SexAndEthnicityDAO } from "../database/dao/profile/SexAndEthnicityDAO";
import db from "../database/DatabaseConnection";
import * as storedProcedure from "../database/storedProcedure";
import { IllegalStateError } from "../models/IllegalStateError";
import { EmailRecordDBO } from "../models/orm/EmailRecordDBO";
import { Address } from "../models/orm/profile/Address";
import { Finances } from "../models/orm/profile/Finances";
import { Healthcare } from "../models/orm/profile/Healthcare";
import { IdentificationInformation } from "../models/orm/profile/IdentificationInformation";
import { InformationProvider } from "../models/orm/profile/InformationProvider";
import { Insurance } from "../models/orm/profile/Insurance";
// Imports for ORMs and DAO objects
import { LegalName } from "../models/orm/profile/LegalName";
import { MarriageInformation } from "../models/orm/profile/MarriageInformation";
import { PhoneNumber } from "../models/orm/profile/PhoneNumber";
import { SexAndEthnicity } from "../models/orm/profile/SexAndEthnicity";
import * as utils from "../utils";
import { Validation } from "../utils/Validation";
import { AuthorizationUtils } from "./AuthorizationUtils";
import { AffordableSESClient } from "./email/AffordableSESClient";
import { DBOAuthenticationInformationDAOImpl } from "../database/dao/authentication/DBOAuthenticationInformationDAOImpl"

const connectionPool = db.getInstance();
const emailService = AffordableSESClient.getInstance();

export class ProfileService {

    private emailDao: EmailDAO;
    private legalNameDao: LegalNameDAO;
    private sexAndEthnicityDao: SexAndEthnicityDAO;
    private identificationInformationDAO: IdentificationInformationDAO;
    private addressDAO: AddressDAO;
    private marriageDAO: MarriageInformationDAO;
    private phoneNumberDAO: PhoneNumberDAO;
    private informationProviderDAO: InformationProviderDAO;
    private insuranceDAO: InsuranceDAO;
    private financesDAO: FinancesDAO;
    private healthcareDAO: HealthcareDAO;
    private authenticationInformationDAO: DBOAuthenticationInformationDAOImpl;

    public constructor(emailDao?: EmailDAO,
                       legalNameDao?: LegalNameDAO) {
        this.emailDao = emailDao ?? new DBOEmailRecordDAOImpl();
        this.legalNameDao = legalNameDao ?? new DBOLegalNameDAOImpl();
        this.sexAndEthnicityDao = new SexAndEthnicityDAO();
        this.identificationInformationDAO = new IdentificationInformationDAO();
        this.addressDAO = new AddressDAO();
        this.marriageDAO = new MarriageInformationDAO();
        this.phoneNumberDAO = new PhoneNumberDAO();
        this.informationProviderDAO = new InformationProviderDAO();
        this.insuranceDAO = new InsuranceDAO();
        this.financesDAO = new FinancesDAO();
        this.healthcareDAO = new HealthcareDAO();
        this.authenticationInformationDAO = new DBOAuthenticationInformationDAOImpl();
    }

    /**
     * Save a profile into the database
     * @param profile A Profile model object
     * @param userId The AuthenticationInformation.id of the current user, 
     *                  it will be used as a foreign key for profile tables
     */
    public async createProfile(profile: ProfileFields.Profile, userInfo: UserInfo): Promise<void> {
        AuthorizationUtils.checkAuthorization(userInfo, false, UserType.RECIPIENT);
        Validation.requireArray(profile.legalNames, "legalNames");
        // Validation.requireParam(profile.sex, "sex");
        // Validation.requireParam(profile.ethnicity, "ethnicity");
        Validation.requireParam(profile.birthDate, "birthDate");
        // Validation.requireParam(profile.identificationInfo, "identificationInfo");
        Validation.requireParam(profile.address, "address");
        // Validation.requireParam(profile.maritalStatus, "maritalStatus");
        // Validation.requireParam(profile.numberOfProvidedChildren, "numberOfProvidedChildren");
        Validation.requireArray(profile.phoneNumbers, "phoneNumbers");
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

    private static getHealthCare(userId: number, profile: ProfileFields.Profile): Healthcare {
        const hc = new Healthcare();
        hc.userId = userId;
        if (profile.healthCare != null) { // then the user has a physician
            hc.hasPhysician = true;
            hc.physicianFirstName = profile.healthCare.firstName;
            hc.physicianLastName = profile.healthCare.lastName;
            hc.physicianLocation = profile.healthCare.practiceLocation;
        } else { // the user does not have a physician
            hc.hasPhysician = false;
        }
        return hc;
    }

    private static getFinances(userId: number, profile: ProfileFields.Profile): Finances {
        const finances = new Finances;
        finances.userId = userId;
        finances.employmentStatus = profile.finances.currentlyEmployed;
        if (profile.finances.currentlyEmployed == true) { // then the user is employed
            finances.currentEmployer = profile.finances.employedInfo.employerName;
            finances.positionTitle = profile.finances.employedInfo.positionTitle;
            finances.grossAnnualIncome = profile.finances.employedInfo.grossAnnualIncome;
        } else { // then the user is unemployed
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

    private static getHealthInsurance(userId: number, profile: ProfileFields.Profile): Insurance {
        const insurance = new Insurance;
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
            } else { // the policy holder is someone else
                insurance.policyHolder = profile.healthInsurance.policyHolderName;
            }
            insurance.insuranceFromEmployer = profile.healthInsurance.offeredByEmployer;
            insurance.companyName = profile.healthInsurance.employerName;
            insurance.groupNumberPlanCode = profile.healthInsurance.groupNumber;
            insurance.hasDeductiblesOrCoPayments = profile.healthInsurance.deductiblesOrCopayments;
            // TODO: add insurance.deductibleAmount and insurance.copayment

        } else { // the user does not have insurance
            insurance.hasInsurance = false;
        }
        return insurance;
    }

    private static getInformationProvider(userId: number, profile: ProfileFields.Profile): InformationProvider {
        const infoProvider = new InformationProvider();
        infoProvider.userId = userId;
        if (profile.informationProvider.self == true) { // then the info provider is the user
            infoProvider.informationProvider = "self";
        } else { // the info provider is someone else
            // Check to see that the provider name was given
            if (profile.informationProvider.providerName != null) {
                infoProvider.informationProvider = profile.informationProvider.providerName;
            } else {
                console.log("ERROR: The information provider's name must be provided.");
            }
        }
        infoProvider.relationshipToPatient = profile.informationProvider.providerRelationship;
        infoProvider.placeOfEmployment = profile.informationProvider.providerEmployment;
        return infoProvider;
    }

    private static getPhoneNumbers(profile: ProfileFields.Profile, userId: number): Array<PhoneNumber> {
        const preferredLanguage = profile.preferredLanguage;
        const phoneNumArr: PhoneNumber[] = [];
        for (let i = 0; i < profile.phoneNumbers.length; i++) {
            const phoneNum = new PhoneNumber;
            phoneNum.userId = userId;
            phoneNum.phone = profile.phoneNumbers[i];
            phoneNum.preference = i
            phoneNum.preferredLanguage = preferredLanguage;
            phoneNumArr.push(phoneNum);
        }
        return phoneNumArr;
    }

    private static getMarriageInformation(userId: number, profile: ProfileFields.Profile): MarriageInformation {
        const marriageInfo = new MarriageInformation;
        marriageInfo.userId = userId;
        marriageInfo.marriageStatus = profile.maritalStatus;
        marriageInfo.numberOfChildren = profile.numberOfProvidedChildren;
        return marriageInfo;
    }

    private static getAddress(userId: number, profile: ProfileFields.Profile): Address {
        const address = new Address;
        address.userId = userId;
        address.street = profile.address.street;
        address.city = profile.address.city;
        address.state = profile.address.state;
        address.zipcode = profile.address.zip;
        return address;
    }

    private static getIdentificationInformation(userId: number, profile: ProfileFields.Profile): IdentificationInformation {
        const idInfo = new IdentificationInformation;
        idInfo.userId = userId;
        idInfo.birthdate = profile.birthDate;
        // The following parts of the profile object were removed to simplify the form.

        // idInfo.SSN = profile.identificationInfo.ssn;
        // idInfo.citizenshipStatus = profile.identificationInfo.citizenshipStatus;
        // idInfo.countryOfBirth = profile.identificationInfo.countryOfBirth;
        // idInfo.alienNumber = profile.identificationInfo.alienNumber
        return idInfo;
    }

    private static getSexAndEthnicity(userId: number, profile: ProfileFields.Profile): SexAndEthnicity {
        const sexAndEthnicity = new SexAndEthnicity();
        sexAndEthnicity.userId = userId;
        sexAndEthnicity.biologicalSex = profile.sex;
        sexAndEthnicity.ethnicity = profile.ethnicity;
        return sexAndEthnicity;
    }

    private static getLegalNames(profile: ProfileFields.Profile, userId: number): Array<LegalName> {
        console.log(profile.legalNames);
        // looping through the profile array of legal names (in case the user has multiple), and adding them to array
        const legalNameArr: LegalName[] = [];
        profile.legalNames.forEach(element => {
            const legalName = new LegalName;
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

    public async getProfile(userId: number): Promise<ProfileFields.Profile> {
        const profile: ProfileFields.Profile = new ProfileFields.Profile();

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

    private static convertBiologicalSexToDto(sex: string): ProfileFields.BiologicalSex {
        switch (sex) {
            case "Male":
                return  ProfileFields.BiologicalSex.MALE;
            case "Female":
                return ProfileFields.BiologicalSex.FEMALE;
            default:
                throw new IllegalStateError("Expected to find one of {" + Object.values(ProfileFields.BiologicalSex).map(e => e.toString()).join(", ") + "} but found " + sex);
        }

    }

    private static convertPhoneNumbersToDto(phoneNumberORM: Array<PhoneNumber>): Array<string> {
        const phoneArr: Array<string> = [];
        phoneNumberORM.sort();
        phoneNumberORM.forEach(element => {
            phoneArr.push(element.phone);
        });
        return phoneArr;
    }

    private static convertMaritalStatusToDto(status: string): ProfileFields.MaritalStatus {
        switch (status) {
            case ProfileFields.MaritalStatus.MARRIED.toString():
                return ProfileFields.MaritalStatus.MARRIED;
            case ProfileFields.MaritalStatus.UNMARRIED.toString():
                return ProfileFields.MaritalStatus.UNMARRIED;
            case ProfileFields.MaritalStatus.DIVORCED.toString():
                return ProfileFields.MaritalStatus.DIVORCED;
            default:
                throw new IllegalStateError("Expected to find one of {" + Object.values(ProfileFields.MaritalStatus).map(e => e.toString()).join(", ") + "} but found " + status);
        }
    }


    private static convertHealthInsuranceToDto(insuranceORM: Insurance): ProfileFields.HealthInsuranceInfo {
        let hi;
        if (insuranceORM.hasInsurance) {
            hi = new ProfileFields.HealthInsuranceInfo();
            hi.primaryCarrier = insuranceORM.primaryInsurance;
            hi.planType = ProfileFields.HealthInsurancePlanType[insuranceORM.planType];
            hi.policyNumber = insuranceORM.policyId;
            if (insuranceORM.policyHolder == "self") {
                hi.policyHolderIsSelf = true;
            } else {
                hi.policyHolderIsSelf = false;
            }
            hi.policyHolderName = insuranceORM.policyHolder;
            hi.offeredByEmployer = insuranceORM.insuranceFromEmployer;
            hi.employerName = insuranceORM.companyName;
            hi.groupNumber = insuranceORM.groupNumberPlanCode;
            hi.deductiblesOrCopayments = insuranceORM.hasDeductiblesOrCoPayments;
        } else {
            hi = null;
        }
        return hi;
    }

    private static convertInformationProviderToDto(informationProviderORM: InformationProvider): ProfileFields.InformationProvider {
        const infoProvider = new ProfileFields.InformationProvider();
        if (informationProviderORM.informationProvider == "self") {
            infoProvider.self = true;
        } else {
            infoProvider.self = false;
        }
        infoProvider.providerName = informationProviderORM.informationProvider;
        infoProvider.providerRelationship = informationProviderORM.relationshipToPatient;
        infoProvider.providerEmployment = informationProviderORM.placeOfEmployment;
        return infoProvider;
    }

    private static convertIdentificationInfoToDto(identificationORM: IdentificationInformation): ProfileFields.IdentificationInfo {
        const idInfo = new ProfileFields.IdentificationInfo();
        idInfo.citizenshipStatus = ProfileFields.CitizenshipStatus[identificationORM.citizenshipStatus];
        idInfo.countryOfBirth = identificationORM.countryOfBirth;
        idInfo.ssn = identificationORM.SSN;
        idInfo.alienNumber = identificationORM.alienNumber;
        return idInfo;
    }

    private static convertHealthcareToDto(healthcareORM: Healthcare): ProfileFields.PhysicianInfo {
        const hc = new ProfileFields.PhysicianInfo();
        hc.firstName = healthcareORM.physicianFirstName;
        hc.lastName = healthcareORM.physicianLastName;
        hc.practiceLocation = healthcareORM.physicianLocation;
        return hc;
    }

    private static convertFinancesToDto(financesORM: Finances): ProfileFields.FinanceInfo {
        let employedInfo = new ProfileFields.EmployedInfo();
        let unemployedInfo = new ProfileFields.UnemployedInfo();
        if (financesORM.employmentStatus == true) { // they are employed
            employedInfo.employerName = financesORM.currentEmployer;
            employedInfo.positionTitle = financesORM.positionTitle;
            employedInfo.grossAnnualIncome = financesORM.grossAnnualIncome;
            unemployedInfo = null;
        } else {
            unemployedInfo.lengthOfUnemployment = financesORM.unemploymentPeriod;
            //unemployedInfo.supportSource = financesORM.
            employedInfo = null;
        }
        const finances = new ProfileFields.FinanceInfo();
        finances.currentlyEmployed = financesORM.employmentStatus;
        finances.employedInfo = employedInfo;
        finances.unemployedInfo = unemployedInfo;
        finances.receiveFinancialAssistance = financesORM.receivesFinancialAssistance;
        finances.assistanceText = financesORM.assistanceExplanation;
        finances.receiveSocialSecurity = financesORM.receivesSocialSecurity;
        finances.peopleInHouseHold = financesORM.numberOfPeopleInHousehold;
        return finances;
    }

    private static convertAddressToDto(addressORM: Address): ProfileFields.Address {
        const address = new ProfileFields.Address();
        address.city = addressORM.city;
        address.state = addressORM.state;
        address.street = addressORM.street;
        address.zip = addressORM.zipcode;
        return address;
    }

    private static convertLegalNamesToDto(legalNameORMArray: Array<LegalName>): Array<ProfileFields.LegalName> {
        const legalNameArr = new Array<ProfileFields.LegalName>();
        legalNameORMArray.forEach(element => {
            const legalName = new ProfileFields.LegalName();
            legalName.firstName = element.firstName;
            legalName.middleName = element.middleName;
            legalName.lastName = element.lastName;
            legalName.suffix = ProfileFields.Suffix[element.suffix];
            legalName.currentName = element.isCurrentLegalName;
            legalNameArr.push(legalName);
        });
        return legalNameArr;
    }

    public async deleteProfile(userId: number): Promise<void> {

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










    public getPrimaryEmail = async (username): Promise<string> => {
        Validation.requireParam(username, "username");
        return (await this.emailDao.getPrimaryEmail(username)).email;
    };

    //requires req.body.username, req.body.email
    public addEmail = (req, res) => {

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
            } else {
                console.log('Email Records inserted');
            }
        });

        res.status(200).json({ success: 'email inserted' });
    };

    //requires req.body.username, req.body.email
    public addUnverifiedEmail = (req, res) => {

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
            } else {
                // console.log('Email Records inserted');
            }
        });

        res.status(200).json({ success: 'email inserted' });
    };

    //requires username
    public verifyEmail = (req, res) => {

        const sql = 'UPDATE emails SET verified = 1 WHERE Email = ?';

        connectionPool.query(sql, [req.body.email], (error, results, fields) => {
            if (error) {
                // console.log(error);
                res.status(502).json({ error });
            } else {
                // console.log('Email Verified');
            }
        });

        res.status(200).json({ success: 'email inserted' });
    };

    //requires req.body.username
    public getEmails = async (req, res) => {
        console.log(req.body.username);
        this.emailDao.getAllEmails(req.body.username)
            .then((results: Array<EmailRecordDBO>) => {
                if (results) {
                    if (results.length > 0) {
                        // Return emails
                        const emailList = results.map(record => {
                            return {
                                email: record.email,
                                isPrimary: record.isPrimary,
                                verified: record.verified
                            }
                        })
                        res.status(200).json({
                            success: 'Emails Found',
                            emails: emailList
                        });
                    } else {
                        // User must not exist
                        res.status(404).json({ error: 'Username does not exist' });
                    }
                }
            }).catch(error => {
                // Error
                console.log(error);
                res.status(502).json({ error });
            })
    };

    //requires req.body.username
    public getDevices = (req, res) => {
        console.log('Getting Devices for ' + req.body.username + '...');
        const sql = 'SELECT * FROM twofactor WHERE username = ? ';
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                const deviceList = [];

                for (let i = 0; i < results.length; ++i) {
                    deviceList.push(
                        {
                            deviceName: results[i].DeviceName,
                            username: results[i].Username
                        }
                    );
                    console.log('Device ' + (i + 1) + ': ' + results[i].DeviceName);
                }
                if (results.length > 0) {
                    res.status(200).json({
                        success: 'Devices Found',
                        devices: deviceList
                    });

                } else {
                    res.status(200).json({ success: 'User does not have any two factor devices' });
                }

            }
        });

    };

    //requires req.body.randomString
    public getRequest = (req, res) => {
        console.log('IN REQUEST');
        const sql = 'SELECT * FROM requests WHERE RandomString = ? ';
        connectionPool.query(sql, [req.body.randomString], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                if (results[0]) {
                    res.status(200).json({
                        success: 'request found',
                        Username: results[0].Username,
                        NewEmail: results[0].NewEmail,
                        OldEmail: results[0].OldEmail,
                        RandomString: results[0].RandomString,
                        Timestamp: results[0].Timestamp,

                    });
                } else {
                    res.status(502).json({ failure: 'Cannot find request' });
                }
            }
        });

    };

    //requires req.body.randomString
    public removeRequest = (req, res) => {
        console.log('deleting!: ' + req.body);

        console.log('deleting!: ' + req.body.randomstring);
        const sql = 'DELETE FROM requests WHERE RandomString = ? ';
        connectionPool.query(sql, [req.body.randomstring], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                res.status(200).json({
                    success: 'request removed'
                });

            }
        });

    };

    public getUserType = (req, res) => {
        console.log('user: ' + req.body.username);
        const sql = 'SELECT * FROM AuthenticationInformation WHERE username = ?';
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                if (results[0]) {
                    res.status(200).json({
                        success: 'User Type Found',
                        usertype: results[0].isDonor
                    });
                } else {
                    res.status(502).json({ error: 'Username does not exist' });
                }
            }
        });

    };

    //requires req.body.email
    public deleteEmail = (req, res) => {
        // TODO: Don't let the user delete an email that is primary? otherwise the app crashes?
        const sql = 'DELETE FROM emails WHERE email = ?';

        connectionPool.query(sql, req.body.email, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                res.status(200).json({ success: 'Email Deleted' });
            }
        });

    };


    //requires req.body.newEmail, req.body.oldEmail
    public updateEmail = (req, res) => {
        let sql = 'UPDATE emails SET email = ? WHERE email = ?';

        connectionPool.query(sql, [req.body.newEmail, req.body.oldEmail], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                sql = 'UPDATE AuthenticationInformation SET email = ? WHERE email = ?';

                connectionPool.query(sql, [req.body.newEmail, req.body.oldEmail], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.status(502).json({ error });
                    } else {
                        res.status(200).json({ success: 'Email Updated' });
                    }
                });
            }
        });



    };

    //rewquires username, current password and new password
    public changePassword = (req, res) => {
        const new_password = req.body.newPw;
        const email = req.body.email;
        let requireTwoFactor = false;
        const sql = 'SELECT * FROM AuthenticationInformation WHERE Username = ? AND Password = ?';
        connectionPool.query(sql, [req.body.username, req.body.currentPw], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
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
                        } else {
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

                } else {
                    res.status(200).json({ success: 'Incorrect Current Password' });

                }
            }
        });

    };

    public changePrimaryEmailVerify = (req, res) => {
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
            } else {
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

    public addSecondaryEmailVerify = (req, res) => {
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
            } else {
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
    public makePrimary = (req, res) => {
        let sql = 'UPDATE emails SET primary_ind = 0 WHERE username = ?';
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                // console.log(error);
                res.status(502).json({ error });
            } else {
                sql = 'UPDATE AuthenticationInformation SET email = ? WHERE username = ?';
                connectionPool.query(sql, [req.body.email, req.body.username], (error, results, fields) => {
                    if (error) {
                        // console.log(error);
                        res.status(502).json({ error });
                    } else {
                        sql = 'UPDATE emails SET primary_ind = 1 WHERE email = ?';
                        connectionPool.query(sql, [req.body.email], (error, results, fields) => {
                            if (error) {
                                // console.log(error);
                                res.status(502).json({ error });
                            } else {
                                res.status(200).json({ success: 'Email Updated' });
                            }
                        });
                    }
                });
            }
        });
    };

    
    // TODO - fix bug when phone is added with an apostrophe.
    public addTwoFactor = (req, res) => {

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
            } else {
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

    public removeTwoFactor = (req, res) => {
        console.log('Removing Device: ' + req.body.DeviceName);
        console.log('From Account with Username: ' + req.body.Username);

        var sql = '';
        var params = [];
        if (req.body.DeviceName != null) {
            sql = 'DELETE FROM twofactor WHERE DeviceName = ? AND Username = ?';
            params = [req.body.DeviceName, req.body.Username]
        } else {
            sql = 'DELETE FROM twofactor WHERE Username = ?';
            params = [req.body.Username];

            // TODO separate out to separate endpoint when multiple devices can be added.
            this.authenticationInformationDAO.setUserRequiresTwoFactorAuthentication(req.body.Username, false)
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
            } else {
                changedRows = results.affectedRows;
                if (changedRows == 0) {
                    console.log('No two factor device with name ' + req.body.DeviceName + ' in database');
                    res.status(200).json({
                        success: 'No two factor device with name ' + req.body.DeviceName + ' in database',
                        changed: 0
                    });
                } else {
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
}