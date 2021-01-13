import React, {Component} from "react";
import "../../../../styles/buttons.css";
import swal from "sweetalert";
import Purpose from "./purpose";
import Information from "./information";
import Eligibility from "./eligibility";
import Fundraising from "./fundraising";
import {RepresentingOrgIDContext, UserEmailContext} from "../../MainPagesRoutingContainer";
import {AffordableClient} from "affordable-client";
import {Grant} from "affordable-shared-models";

let orgID = 0;
let userEmail = "";

// get the organization that the user is representing who is filling out the form
const OrgIDVal = orgId => {
  orgID = orgId.id;
  return null;
};

//UserEmailContext - get the email for the user filling out the form
const UserEmailVal = ID => {
  userEmail = ID.Email;
  return null;
};

interface HugCreationProps {
  changeHeader: any;
  client: AffordableClient;
}

interface HugCreationState {
  purpose: any; // hold all the data for the purpose page
  eligibility: any; // hold all the data for the eligibility page
  information: any; // hold all the data for the information page
  fundraising: any; // hold all the data for the fundraising page
  titles: [
    "HUG Purpose",
    "HUG Eligibility",
    "HUG Information",
    "HUG Fundraising"
  ];
  purposeFields: {
    hugName: "HUG Name";
    hugCat: "HUG Category";
    medCat: "Medical Category";
    purpose: "Purpose";
    hasPrescriptions: "Prescription Required";
    hasDiagnosis: "Diagnosis Required";
  };
  eligibilityFields: {
    age: "Age";
    sex: "Sex";
    location: "Location";
    addressLine1: "Address Line 1";
    city: "City";
    state: "State";
    zip: "Zip";
    firstLanguage: "First Language";
    citizenship: "Citizenship";
    employment: "Employment";
    militaryService: "Military Service";
    insurance: "Insurance";
    marriageStatus: "Marriage Status";
    income: "Income";
    dependents: "Dependents";
  };
  informationFields: {
    documentationNeeded: "Documentation Needed";
    medicalInfoNeeded: "Medical Info Needed";
    candidateSelection: "Candidate Selection Preference";
  };
  fundraisingFields: {
    dateStart: "Date Start";
    dateEnd: "Date End";
    fundraisingOptions: "Fundraising Options";
    hugDistribution: "HUG Distribution";
    numberSupported: "Number Supported";
    fundingPerPerson: "Funding Per Person";
    hugDistributionTwo: "HUG Distribution";
    totalHugBudget: "Total HUG Budget";
    paymentMethod: "Payment Method";
  };
  currentStep: number; // what page the user is currently on
  newVal: "";
  orgID: number; //what organization the user is representng
}

class HugCreation extends Component<HugCreationProps, HugCreationState> {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || (window as any).REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);
    // Set the initial input values
    this.state = {
      eligibility: undefined,
      eligibilityFields: {
        addressLine1: "Address Line 1",
        age: "Age",
        citizenship: "Citizenship",
        city: "City",
        dependents: "Dependents",
        employment: "Employment",
        firstLanguage: "First Language",
        income: "Income",
        insurance: "Insurance",
        location: "Location",
        marriageStatus: "Marriage Status",
        militaryService: "Military Service",
        sex: "Sex",
        state: "State",
        zip: "Zip"
      },
      fundraising: undefined,
      fundraisingFields: {
        dateEnd: "Date End",
        dateStart: "Date Start",
        fundingPerPerson: "Funding Per Person",
        fundraisingOptions: "Fundraising Options",
        hugDistribution: "HUG Distribution",
        hugDistributionTwo: "HUG Distribution",
        numberSupported: "Number Supported",
        paymentMethod: "Payment Method",
        totalHugBudget: "Total HUG Budget"
      },
      information: undefined,
      informationFields: {
        candidateSelection: "Candidate Selection Preference",
        documentationNeeded: "Documentation Needed",
        medicalInfoNeeded: "Medical Info Needed"
      },
      newVal: "",
      purpose: undefined,
      purposeFields: {
        hasDiagnosis: "Diagnosis Required",
        hasPrescriptions: "Prescription Required",
        hugCat: "HUG Category",
        hugName: "HUG Name",
        medCat: "Medical Category",
        purpose: "Purpose"
      },
      titles: [
        "HUG Purpose",
        "HUG Eligibility",
        "HUG Information",
        "HUG Fundraising"
      ],
      currentStep: 1,
      orgID: 0
    };
    // Bind the submission to handleChange()
    this.handleChange = this.handleChange.bind(this);
    this.handleUploadHugRegistrationForm = this.handleUploadHugRegistrationForm.bind(
      this
    );
    // Bind the functions next and previous
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  // to handle going to the next page of the form
  next() {
    let currentStep = this.state.currentStep;
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 3 ? 4 : currentStep + 1;
    this.props.changeHeader(this.state.titles[currentStep - 1]);
    this.setState({
      currentStep: currentStep
    });
  }
  // to handle going to the past page of the form
  prev() {
    let currentStep = this.state.currentStep;
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.props.changeHeader(this.state.titles[currentStep - 1]);
    this.setState({
      currentStep: currentStep
    });
  }

  // when next is pressed on the purpose page
  // this is a callback function that is passed to the purpose component
  handlePurposeDataNext(hugPurpose) {
    console.log(hugPurpose);
    this.setState({ purpose: hugPurpose });
    this.next();
  }

  // when next is pressed on the eligibility page
  // this is a callback function that is passed to the eligibility component
  handleEligibilityDataNext(hugEligibility) {
    console.log(hugEligibility);
    this.setState({ eligibility: hugEligibility }); // set the purpose info equal to the values from the purpose page
    this.next();
  }

  // when next is pressed on the information page
  // this is a callback function that is passed to the information component
  handleInformationDataNext(hugInformation) {
    console.log("Before Next", hugInformation);
    this.setState({ information: hugInformation });
    console.log("Assignment", this.state.information);
    this.next();
  }

  // Use the submitted data to set the state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    } as Pick<HugCreationState, keyof HugCreationState>);
  }

  // Trigger an alert on form submission
  handleSubmit = event => {
    event.preventDefault();
    const { currentStep } = this.state;
  };

  //Transfer Org records to Backend server, this is a callback function on the fundraising page
  async handleUploadHugRegistrationForm(hugFundraising) {
    // fundraising data that is passed back needs to be saved to the state
    this.setState({ fundraising: hugFundraising });

    // Create a separate object for each backend call that will be made
    const grantData = new FormData(); // updating the Grants table
    const grantEligibilityData = new FormData(); // updating the GrantEligibility table
    const diagnosisData = new FormData(); // updating the GrantDiagnosis table
    const prescriptionData = new FormData(); // updating the GrantsPrescription table
    const documentationData = new FormData(); // updating the GrantRequiredDocumentation table
    const medicalInfoData = new FormData(); // updating the GrantRequiredMedicalInfo table
    const locationInfoData = new FormData(); // updating the GrantLocations table

    let validData = true; // was the data in the form valid
    let attributeVal;
    let foundAttribute;
    let errorTitle;

    //check that all the fields on the purpose page have been filled out
    for (attributeVal in this.state.purpose) {
      if (
        attributeVal != "specialtyCare" &&
        this.state.purpose[attributeVal] === "" &&
        validData
      ) {
        validData = false;
        foundAttribute =
          "Purpose Page: " +
          this.state.purposeFields[attributeVal] +
          " is empty";
        errorTitle = this.state.purposeFields[attributeVal] + " Error";
      }
    }
    // if the purpose page was filled out correctly
    if (validData) {
      //check that all the fields on the eligibility page have been filled out
      for (attributeVal in this.state.eligibility) {
        if (
          this.state.eligibility[attributeVal] === "" &&
          validData &&
          attributeVal != "ageLow" &&
          attributeVal != "ageHigh" &&
          attributeVal != "addressLine2" &&
          attributeVal != "ethnicityOther" &&
          attributeVal != "languageOther" &&
          attributeVal != "incomeLow" &&
          attributeVal != "incomeHigh" &&
          attributeVal != "distance" &&
          attributeVal != "dependentsLow" &&
          attributeVal != "dependentsHigh"
        ) {
          validData = false;
          foundAttribute =
            "Eligibility Page: " +
            this.state.eligibilityFields[attributeVal] +
            " is empty";
          errorTitle = this.state.eligibilityFields[attributeVal] + " Error";
        }
      }
    }
    // if the purpose page and eligibility page was filled out correctly
    if (validData) {
      //check that all the fields on the information page have been filled out
      for (attributeVal in this.state.information) {
        if (this.state.information[attributeVal] === "" && validData) {
          validData = false;
          foundAttribute =
            "Information Page: " +
            this.state.informationFields[attributeVal] +
            " is empty";
          errorTitle = this.state.informationFields[attributeVal] + " Error";
        }
      }
    }
    // if the purpose page, eligibility and information pages were filled out correctly
    if (validData) {
      //check that all the fields on the fundraising page have been filled out
      for (attributeVal in this.state.fundraising) {
        if (this.state.fundraising[attributeVal] === "" && validData) {
          validData = false;
          foundAttribute =
            "Fundraising Page: " +
            this.state.fundraisingFields[attributeVal] +
            " is empty";
          errorTitle = this.state.fundraisingFields[attributeVal] + " Error";
        }
      }
    }
    // If we found a field filled out incorrectly, alert the user
    if (!validData) {
      swal(errorTitle, foundAttribute, "warning");
    }
    // Only make the backend calls if all pages were valid
    if (validData) {
      const day = new Date().getDate();
      let month: string | number = new Date().getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      const year = new Date().getFullYear();
      const date = year + "-" + month + "-" + day;

      //add all the data from the purpose page
      const name = this.state.purpose.hugName;
      const hugCat = this.state.purpose.hugCat;
      const medCat = this.state.purpose.medCat;
      const specialtyCare = this.state.purpose.specialtyCare;
      const purpose = this.state.purpose.purpose;
      const hasPrescriptions = this.state.purpose.hasPrescriptions;
      const hasDiagnosis = this.state.purpose.hasDiagnosis;

      //Only append diagnosis fields if they are filled out
      if (this.state.purpose.hasDiagnosis === "1") {
        const diagnosis = this.state.purpose.diagnosisNeeded;
        console.log("Diagnosis");
        console.log(diagnosis);
        diagnosisData.append("diagnosis", JSON.stringify(diagnosis));
      }

      //Only append prescription fields if they are filled out
      if (this.state.purpose.hasPrescriptions === "1") {
        const prescription = this.state.purpose.prescriptionNeeded;
        prescriptionData.append("prescription", JSON.stringify(prescription));
      }

      //add all the data from the eligibility page
      console.log("Age Value");
      const age = this.state.eligibility.ageLow;
      console.log(age);
      const sex = this.state.eligibility.sex;
      const location = this.state.eligibility.location;
      const distance = this.state.eligibility.distance;
      const addressLine1 = this.state.eligibility.addressLine1;
      const addressLine2 = this.state.eligibility.addressLine2;
      const city = this.state.eligibility.city;
      const state = this.state.eligibility.state;
      const zip = this.state.eligibility.zip;
      let ethnicity = this.state.eligibility.ethnicity;
      let firstLanguage = this.state.eligibility.firstLanguage;
      const citizenship = this.state.eligibility.citizenship;
      const employment = this.state.eligibility.employment;
      const militaryService = this.state.eligibility.militaryService;
      const insurance = this.state.eligibility.insurance;
      const marraigeStatus = this.state.eligibility.marraigeStatus;
      const income = this.state.eligibility.income;
      const dependents = this.state.eligibility.dependents;

      //check for other fields
      if (ethnicity == "Other") {
        ethnicity = this.state.eligibility.ethnicityOther;
      }

      if (firstLanguage == "Other") {
        firstLanguage = this.state.eligibility.languageOther;
      }

      //add all the data from the information page
      const candidateSelection = this.state.information.candidateSelection;
      const documentationNeeded = this.state.information.documentationNeeded;
      const medicalInfoNeeded = this.state.information.medicalInfoNeeded;

      //Only append document fields if they are filled out
      if (this.state.information.documentationNeeded === "1") {
        const documents = this.state.information.documentsNeeded;
        console.log("Documentation");
        console.log(documents);
        documentationData.append("documentation", JSON.stringify(documents));
      }

      //Only append medical info fields if they are filled out
      if (this.state.information.medicalInfoNeeded === "1") {
        const medicalInfo = this.state.information.informationNeeded;
        medicalInfoData.append("medicalInfo", JSON.stringify(medicalInfo));
      }

      // add all info from the fundraising page
      const dateStart = this.state.fundraising.dateStart;
      const dateEnd = this.state.fundraising.dateEnd;
      const fundraisingOptions = this.state.fundraising.fundraisingOptions;
      const hugDistribution = this.state.fundraising.hugDistribution;
      const fundraisingLocation = this.state.fundraising.location;
      const hugDistributionTwo = this.state.fundraising.hugDistributionTwo;
      const fundingPerPerson = this.state.fundraising.fundingPerPerson;
      const numberSupported = this.state.fundraising.numberSupported;
      const grantBudget = this.state.fundraising.totalHugBudget;

      // Put the data in the object passed to the Grant Data Object
      grantData.append("hugName", name);
      grantData.append("hugCat", hugCat);
      grantData.append("medCat", medCat);
      grantData.append("specialtyCare", specialtyCare);
      grantData.append("purpose", purpose);
      grantData.append("hasPrescriptions", hasPrescriptions);
      grantData.append("hasDiagnosis", hasDiagnosis);
      grantData.append("dateStart", dateStart);
      grantData.append("dateEnd", dateStart);
      grantData.append("grantDistribution", hugDistribution);
      grantData.append("fundingPerPerson", fundingPerPerson);
      grantData.append("grantBudget", grantBudget);
      grantData.append("numberSupported", numberSupported);
      grantData.append("orgID", this.state.orgID.toString());

      // Put the data in the objet passed to the GrantEligibility Data Object
      grantEligibilityData.append("age", age);
      grantEligibilityData.append("sex", sex);
      grantEligibilityData.append("location", location);
      grantEligibilityData.append("distance", distance);

      //Put the data in the object passed to the Location Info Data Object
      locationInfoData.append("locationFilter", location);
      locationInfoData.append("distanceFromLocation", distance);
      locationInfoData.append("addressLine1", addressLine1);
      locationInfoData.append("addressLine2", addressLine2);
      locationInfoData.append("city", city);
      locationInfoData.append("state", state);
      locationInfoData.append("zip", zip);

      console.log("Hug name");
      console.log(name);

      console.log("Inserting HUG");
      console.log(name);
      let grantID = "";

      //Add the grant

      const grant = new Grant();
      grant.grantName = name;
      grant.category = hugCat;
      grant.description = purpose;

      await this.props.client.createGrant(grant).catch(error => {
        console.log(error);
        swal(
          "Step 1: There was an issue registering your hug. Please check fields and resubmit.",
          "warning"
        );
      });

      //Get the orgID
      await fetch(this.REACT_APP_AF_BACKEND_URL + "/info/grantID", {
        method: "POST",
        body: grantData
      })
        .then(response => response.json())
        .then(response => {
          if (response.status === "OK") {
            grantID = response.grantID;
          } else {
            swal(
              "Step 2: Sorry There was an issue registering your hug. Please check fields and resubmit.",
              "warning"
            );
          }
        });
      grantEligibilityData.append("grantID", grantID);
      diagnosisData.append("grantID", grantID);
      prescriptionData.append("grantID", grantID);
      documentationData.append("grantID", grantID);
      medicalInfoData.append("grantID", grantID);
      locationInfoData.append("grantID", grantID);

      if (this.state.purpose.hasDiagnosis === "1") {
        console.log("In diagnosis");
        await fetch(this.REACT_APP_AF_BACKEND_URL + "/addHug/addDiagnosis/", {
          method: "POST",
          body: diagnosisData
        })
          .then(response => response.json())
          .then(response => {
            if (response.status != "OK") {
              swal(
                "Adding Diagnosis: Sorry There was an issue registering your hug. Please check diagnosis fields and resubmit.",
                "warning"
              );
            }
          });
      }

      // console.log("Entering Prescription")
      //
      // if (this.state.purpose.hasPrescriptions === "1")
      // {
      //   console.log("in precription")
      //   await fetch("http://localhost:4000/addHug/addPrescription/", {
      //       method: "POST",
      //       body: prescriptionData
      //   }).then(response => response.json())
      //   .then ((response) => {
      //       if (response.status != 'OK') {
      //           swal(
      //               "Adding Prescription: Sorry There was an issue registering your hug. Please check prescription fields and resubmit.",
      //               "warning"
      //           );
      //       }
      //   });
      // }

      console.log("Entering Documentation");

      if (this.state.information.documentationNeeded === "1") {
        console.log("in documentation");
        await fetch(this.REACT_APP_AF_BACKEND_URL + "/addHug/addDocumentation/", {
          method: "POST",
          body: documentationData
        })
          .then(response => response.json())
          .then(response => {
            if (response.status != "OK") {
              swal(
                "Adding Documentation: Sorry There was an issue registering your hug. Please check information documentation fields and resubmit.",
                "warning"
              );
            }
          });
      }

      console.log("Entering Medical Info");

      if (this.state.information.medicalInfoNeeded === "1") {
        console.log("in medical info");
        await fetch(this.REACT_APP_AF_BACKEND_URL + "/addHug/addMedicalInfo/", {
          method: "POST",
          body: medicalInfoData
        })
          .then(response => response.json())
          .then(response => {
            if (response.status != "OK") {
              swal(
                "Adding Medical Info: Sorry There was an issue registering your hug. Please check information medical info fields and resubmit.",
                "warning"
              );
            }
          });
      }

      await fetch(this.REACT_APP_AF_BACKEND_URL + "/addHug/addLocationInfo/", {
        method: "POST",
        body: locationInfoData
      })
        .then(response => response.json())
        .then(response => {
          if (response.status != "OK") {
            swal(
              "Adding Location: Sorry There was an issue registering your hug. Please check location fields and resubmit.",
              "warning"
            );
          }
        });

      await fetch(this.REACT_APP_AF_BACKEND_URL + "/addHug/addEligibility/", {
        method: "POST",
        body: grantEligibilityData
      }).then(response => {
        if (response.ok) {
          swal(
            "Thank you for creating your HUG with Affordable!",
            "Welcome",
            "success"
          );
          this.sendHUGCreationEmail();
        } else {
          swal(
            "Eligibility: There was an issue creating your HUG. Please check fields and resubmit.",
            "warning"
          );
        }
      });
    }
  }
  // gets called if all backend calls were successful for hug creation
  async sendHUGCreationEmail() {
    const data = new FormData();
    data.append("email", userEmail);
    const name = this.state.purpose.hugName;
    data.append("grantName", name);

    await fetch(this.REACT_APP_AF_BACKEND_URL + "/addHug/email/notifyHugCreation/", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok) return response.json();
    });
  }

  render() {
    return (
      <div className="col">
        <form onSubmit={this.handleSubmit}>
          <Purpose
            currentStep={this.state.currentStep}
            nextFunction={this.handlePurposeDataNext.bind(this)}
            handleChange={this.handleChange}
          />
          <Eligibility
            currentStep={this.state.currentStep}
            nextFunction={this.handleEligibilityDataNext.bind(this)}
            previousFunction={this.prev}
            handleChange={this.handleChange}
          />
          <Fundraising
            currentStep={this.state.currentStep}
            previousFunction={this.prev}
            submitFunction={this.handleUploadHugRegistrationForm}
            handleChange={this.handleChange}
          />
          <Information
            currentStep={this.state.currentStep}
            nextFunction={this.handleInformationDataNext.bind(this)}
            previousFunction={this.prev}
            handleChange={this.handleChange}
          />
        </form>
        <RepresentingOrgIDContext.Consumer>
          {value => <OrgIDVal id={value} />}
        </RepresentingOrgIDContext.Consumer>
        <UserEmailContext.Consumer>
          {value => <UserEmailVal Email={value} />}
        </UserEmailContext.Consumer>
      </div>
    );
  }
}
export default HugCreation;
