"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileFields = void 0;
var ProfileFields;
(function (ProfileFields) {
    let Suffix;
    (function (Suffix) {
        Suffix["JR"] = "Jr";
        Suffix["SR"] = "Sr";
        Suffix["THIRD"] = "III";
        Suffix["FOURTH"] = "IV";
    })(Suffix = ProfileFields.Suffix || (ProfileFields.Suffix = {}));
    let Ethnicity;
    (function (Ethnicity) {
        Ethnicity["CAUCASIAN"] = "Caucasian";
        Ethnicity["HISPANIC_OR_LATINO"] = "Hispanic or Latino";
        Ethnicity["BLACK_OR_AF_AM"] = "Black or African American";
        Ethnicity["ASIAN"] = "Asian";
        Ethnicity["AM_INDIAN_OR_AK"] = "American Indian or Alaska Native";
        Ethnicity["OTHER"] = "Other";
    })(Ethnicity = ProfileFields.Ethnicity || (ProfileFields.Ethnicity = {}));
    let BiologicalSex;
    (function (BiologicalSex) {
        BiologicalSex["FEMALE"] = "Female";
        BiologicalSex["MALE"] = "Male";
    })(BiologicalSex = ProfileFields.BiologicalSex || (ProfileFields.BiologicalSex = {}));
    let CitizenshipStatus;
    (function (CitizenshipStatus) {
        CitizenshipStatus["CITIZEN"] = "Citizen";
        CitizenshipStatus["LEGAL_RESIDENT"] = "Legal Resident";
        CitizenshipStatus["UNDOCUMENTED"] = "Undocumented";
    })(CitizenshipStatus = ProfileFields.CitizenshipStatus || (ProfileFields.CitizenshipStatus = {}));
    let MaritalStatus;
    (function (MaritalStatus) {
        MaritalStatus["MARRIED"] = "Married";
        MaritalStatus["UNMARRIED"] = "Unmarried";
        MaritalStatus["DIVORCED"] = "Divorced";
    })(MaritalStatus = ProfileFields.MaritalStatus || (ProfileFields.MaritalStatus = {}));
    class LegalName {
    }
    ProfileFields.LegalName = LegalName;
    class IdentificationInfo {
    }
    ProfileFields.IdentificationInfo = IdentificationInfo;
    class Address {
    }
    ProfileFields.Address = Address;
    class InformationProvider {
    }
    ProfileFields.InformationProvider = InformationProvider;
    let HealthInsurancePlanType;
    (function (HealthInsurancePlanType) {
        HealthInsurancePlanType["EPO"] = "Exclusive Provider Network (EPO)";
        HealthInsurancePlanType["HMO"] = "Health Maintenance Organization (HMO)";
        HealthInsurancePlanType["POS"] = "Point of Service (POS)";
        HealthInsurancePlanType["PPO"] = "Preferred Provider Organization (PPO)";
        HealthInsurancePlanType["HDHP_HSA"] = "High-Deductible Health Plan (HDHP) or Health Savings Account (HSA)";
    })(HealthInsurancePlanType = ProfileFields.HealthInsurancePlanType || (ProfileFields.HealthInsurancePlanType = {}));
    class HealthInsuranceInfo {
    }
    ProfileFields.HealthInsuranceInfo = HealthInsuranceInfo;
    class EmployedInfo {
    }
    ProfileFields.EmployedInfo = EmployedInfo;
    class UnemployedInfo {
    }
    ProfileFields.UnemployedInfo = UnemployedInfo;
    class FinanceInfo {
    }
    ProfileFields.FinanceInfo = FinanceInfo;
    class PhysicianInfo {
    }
    ProfileFields.PhysicianInfo = PhysicianInfo;
    class Profile {
    }
    ProfileFields.Profile = Profile;
})(ProfileFields = exports.ProfileFields || (exports.ProfileFields = {}));
