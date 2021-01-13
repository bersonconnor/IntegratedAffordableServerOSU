export namespace ProfileFields {
    export enum Suffix {
        JR = 'Jr',
        SR = 'Sr',
        THIRD = 'III',
        FOURTH = 'IV',
    }

    export enum Ethnicity {
        CAUCASIAN = 'Caucasian',
        HISPANIC_OR_LATINO = 'Hispanic or Latino',
        BLACK_OR_AF_AM = 'Black or African American',
        ASIAN = 'Asian',
        AM_INDIAN_OR_AK = 'American Indian or Alaska Native',
        OTHER = 'Other' // 
    }

    export enum BiologicalSex {
        FEMALE = 'Female',
        MALE = 'Male'
    }

    export enum CitizenshipStatus {
        CITIZEN = 'Citizen',
        LEGAL_RESIDENT = 'Legal Resident',
        UNDOCUMENTED = 'Undocumented'
    }

    export enum MaritalStatus {
        MARRIED = 'Married',
        UNMARRIED = 'Unmarried',
        DIVORCED = 'Divorced'
    }

    export class LegalName {
        firstName: string;
        middleName?: string;
        lastName: string;
        suffix?: Suffix;
        currentName: boolean;
    }

    export class IdentificationInfo {
        countryOfBirth: string;
        citizenshipStatus: CitizenshipStatus;
        ssn?: string;
        alienNumber?: string;
    }

    export class Address {
        street: string;
        city: string;
        state: string;
        zip: string;
    }

    export class InformationProvider {
        self: boolean;
        providerName?: string;
        providerRelationship?: string;
        providerEmployment?: string;
    }

    export enum HealthInsurancePlanType {
        EPO = 'Exclusive Provider Network (EPO)',
        HMO = 'Health Maintenance Organization (HMO)',
        POS = 'Point of Service (POS)',
        PPO = 'Preferred Provider Organization (PPO)',
        HDHP_HSA = 'High-Deductible Health Plan (HDHP) or Health Savings Account (HSA)'
    }

    export class HealthInsuranceInfo {
        primaryCarrier: string;
        planType: HealthInsurancePlanType;
        policyNumber: string;
        policyHolderIsSelf: boolean;
        policyHolderName?: string;
        offeredByEmployer: boolean;
        employerName?: string;
        groupNumber?: string;
        deductiblesOrCopayments?: boolean;
    }

    export class EmployedInfo {
        employerName: string;
        positionTitle: string;
        grossAnnualIncome: string;
    }

    export class UnemployedInfo {
        lengthOfUnemployment: string;
        supportSource?: string;
    }

    export class FinanceInfo {
        currentlyEmployed: boolean;
        employedInfo?: EmployedInfo;
        unemployedInfo?: UnemployedInfo;
        receiveFinancialAssistance?: boolean;
        assistanceText?: string;
        receiveSocialSecurity?: boolean;
        peopleInHouseHold: number;
    }

    export class PhysicianInfo {
        firstName: string;
        lastName: string;
        practiceLocation: string;
    }

    export class Profile {
        legalNames: Array<LegalName>;
        sex?: BiologicalSex;
        ethnicity?: string;
        birthDate: string;
        identificationInfo?: IdentificationInfo;
        address: Address;
        maritalStatus?: MaritalStatus;
        numberOfProvidedChildren?: number;
        phoneNumbers: Array<string>; // Ordered. Primary is first.
        preferredLanguage?: string;
        informationProvider?: InformationProvider;
        healthInsurance?: HealthInsuranceInfo;
        finances?: FinanceInfo;
        healthCare?: PhysicianInfo;
    }
}