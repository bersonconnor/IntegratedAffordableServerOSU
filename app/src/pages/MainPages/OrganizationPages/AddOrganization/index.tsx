import React, {Component, Fragment} from "react";
import "../../../../styles/buttons.css";
import "react-table/react-table.css";
import "./scss/add-organization.scss";
import {UserEmailContext, UserIDContext} from "../../MainPagesRoutingContainer";

import swal from "sweetalert";
import {AddMemberRequest, Organization, UserInfo} from "affordable-shared-models";
import {AffordableClient} from "affordable-client";

const initialState: AddOrganizationState = {
  addresses: [
    {
      addressLine1: "",
      addressLine2: "",
      city: "",
      zip: "",
      state: ""
    }
  ],
  organizationName: "",
  email: "",
  phoneNumber: "",
  faxNumber: "",
  websiteURL: "",
  providesServices: "",
  serviceType: "",
  specialty: "",
  mission: "",
  bankInfo: "",
  nickname: "",
  nameOnAccount: "",
  routingNumber: "",
  accountNumber: "",
  verifyAccountNumber: "",
  agreement: "",
  affordablePlacement: ""
};

const FormGroup = ({ labelName, value, handleChange }) => {
  return (
    <div className="form-group row">
      <div className="col-1" />
      <label
        htmlFor={labelName.replace(/\s+/g, "-")}
        className="col-2 col-form-label"
      >
        {labelName}
      </label>
      <div className="col-8">
        <input
          type="text"
          className="form-control"
          id={labelName.replace(/\s+/g, "-")}
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="col-1" />
    </div>
  );
};

let addressCounter = 0;
let userID = 0;

//donor admin user email
let userEmail = "";

const AddressFormGroup = ({
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  handleChange
}) => {
  return (
    <Fragment>
      <FormGroup
        labelName="Address Line 1"
        value={addressLine1}
        handleChange={handleChange("addressLine1")}
      />
      <FormGroup
        labelName="Address Line 2"
        value={addressLine2}
        handleChange={handleChange("addressLine2")}
      />

      <FormGroup
        labelName="City"
        value={city}
        handleChange={handleChange("city")}
      />

      <div className="form-group row">
        <div className="col-1" />

        <label htmlFor="State" className="col-2 col-form-label">
          State
        </label>
        <div className="col">
          <select
            id="State"
            placeholder="Select State..."
            value={state}
            className="form-control"
            onChange={handleChange("state")}
          >
            <option value="" disabled selected>
              Select State...
            </option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
        </div>

        <label htmlFor="Zip" className="col-1 col-form-label">
          Zip
        </label>
        <div className="col">
          <input
            id="Zip"
            className="form-control"
            type="zip"
            value={zip}
            onChange={handleChange("zip")}
          />
        </div>
        <div className="col-1" />
      </div>
    </Fragment>
  );
};

const UserIDVal = ID => {
  userID = ID.ID;
  return null;
};

//UserEmailContext
const UserEmailVal = ID => {
  userEmail = ID.Email;
  return null;
};

interface AddOrganizationProps {
  userInfo: UserInfo;
  client: AffordableClient;
}

interface AddOrganizationState {
  addresses: [
    {
      addressLine1: string;
      addressLine2: string;
      city: string;
      zip: string;
      state: string;
    }
  ];
  organizationName: string;
  email: string;
  phoneNumber: string;
  faxNumber: string;
  websiteURL: string;
  providesServices: string;
  serviceType: string;
  specialty: string;
  mission: string;
  bankInfo: string;
  nickname: string;
  nameOnAccount: string;
  routingNumber: string;
  accountNumber: string;
  verifyAccountNumber: string;
  agreement: string;
  affordablePlacement: string;
}

class AddOrganization extends Component<
  AddOrganizationProps,
  AddOrganizationState
> {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || (window as any).REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);
    this.state = {
      addresses: [
        {
          addressLine1: "",
          addressLine2: "",
          city: "",
          zip: "",
          state: ""
        }
      ],
      organizationName: "",
      email: "",
      phoneNumber: "",
      faxNumber: "",
      websiteURL: "",
      providesServices: "",
      serviceType: "",
      specialty: "",
      mission: "",
      bankInfo: "",
      nickname: "",
      nameOnAccount: "",
      routingNumber: "",
      accountNumber: "",
      verifyAccountNumber: "",
      agreement: "",
      affordablePlacement: ""
    };

    this.addLocation = this.addLocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUploadOrgRegistrationForm = this.handleUploadOrgRegistrationForm.bind(
      this
    );
  }

  /*Helper Functions*/
  formatAddress = ({
    streetAddress1,
    streetAddress2,
    city,
    stateOrProvince,
    postalCode
  }) => {
    return `${streetAddress1} ${
      streetAddress2 ? streetAddress2 : ""
    } ${city}, ${stateOrProvince} ${postalCode}`;
  };

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value } as Pick<
        AddOrganizationState,
        keyof AddOrganizationState
      >);
    };
  };

  handleAddressChange = index => key => {
    const { addresses } = this.state;
    return event => {
      addresses[index][key] = event.target.value;
      this.setState({ addresses });
    };
  };

  addLocation = e => {
    // this.setState(
    //   (prevState: AddOrganizationState) =>
    //     ({
    //       addresses: [
    //         ...prevState.addresses,
    //         { addressLine1: "", addressLine2: "", city: "", zip: "", state: "" }
    //       ]
    //     } as Pick<AddOrganizationState, keyof AddOrganizationState>)
    // );
    addressCounter++;
    console.log("after add loc", this.state.addresses);
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  componentDidMount() {
    if (!window.location.hash) {
      //setting window location
      window.location.assign(window.location + "#loaded");
      //using reload() method to reload web page
      // window.location.reload();
    }
  }

  //Transfer Org records to Backend server
  async handleUploadOrgRegistrationForm(ev) {
    ev.preventDefault();
    //Check to see if all address fields that were populated were filled out
    let checkAllAddresses = true;
    for (let i = 0; i <= addressCounter; i++) {
      if (
        this.state.addresses[i]["addressLine1"] === "" ||
        this.state.addresses[i]["city"] === "" ||
        this.state.addresses[i]["state"] === "" ||
        this.state.addresses[i]["zip"] === ""
      )
        checkAllAddresses = false;
    }

    if (this.state.organizationName !== "" && checkAllAddresses !== false) {
      const orgData = new Organization();
      const infoData = new FormData();

      const day = new Date().getDate();
      let month: string | number = new Date().getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      const year = new Date().getFullYear();
      const date = year + "-" + month + "-" + day;

      const name = (document.getElementById(
        "Organization-Name"
      )! as HTMLInputElement).value;
      const email = (document.getElementById("Email")! as HTMLInputElement)
        .value;
      const phoneNumber = (document.getElementById(
        "Phone-Number"
      )! as HTMLInputElement).value;
      const fax = (document.getElementById("Fax-Number")! as HTMLInputElement)
        .value;
      const url = (document.getElementById("Website-URL")! as HTMLInputElement)
        .value;

      orgData.name = name;
      orgData.email = email;
      orgData.phone = phoneNumber;
      orgData.fax = fax;
      orgData.url = url;

      infoData.append("orgName", name);
      infoData.append("userID", userID.toString());
      infoData.append("locations", JSON.stringify(this.state.addresses));
      infoData.append("numOfLocations", addressCounter.toString());
      infoData.append("date", date);

      //Only append services fields if they are filled out
      if (this.state.providesServices === "yes") {
        const mission = (document.getElementById(
          "Mission"
        )! as HTMLInputElement).value;
        const service = (document.getElementById(
          "Service"
        )! as HTMLInputElement).value;
        const specialty = (document.getElementById(
          "Specialty"
        )! as HTMLInputElement).value;
        orgData.missionStatement = mission;
        orgData.providesService = true;
        infoData.append("service", service);
        infoData.append("specialtyService", specialty);
        infoData.append("ProvideService", "1");
      }

      //Only append bank info fields if they are filled out
      if (
        this.state.bankInfo === "yes" &&
        this.state.accountNumber === this.state.verifyAccountNumber
      ) {
        const accNick = (document.getElementById(
          "Account-Nickname"
        )! as HTMLInputElement).value;
        const accName = (document.getElementById(
          "Name-on-Account"
        )! as HTMLInputElement).value;
        const accRoute = (document.getElementById(
          "Routing-Number"
        )! as HTMLInputElement).value;
        const accNum = (document.getElementById(
          "Account-Number"
        )! as HTMLInputElement).value;
        infoData.append("accountType", "");
        infoData.append("accountName", accName);
        infoData.append("accountNickname", accNick);
        // Note: the account information was previously hashed...for unknown reasons
        infoData.append("accountRouting", accRoute);
        infoData.append("accountNumber", accNum);
        infoData.append("bankInfo", "1");
      } else if (this.state.accountNumber !== this.state.verifyAccountNumber) {
        swal("Validation error", "Account numbers do not match", "warning");
      }

      //Add the organization
      await this.props.client.createOrganization(orgData)
        .then((org: Organization) => {
          const addMemberRequest = new AddMemberRequest();
          addMemberRequest.userId = this.props.userInfo.id;
          addMemberRequest.organizationId = org.id!;
          addMemberRequest.isAdmin = true;
          this.props.client.addUserToOrganization(addMemberRequest).then(() =>
            swal(
              "Thank you for registering your organization with Affordable!",
              "Welcome",
              "success"
            )
          );
        })
        .catch(() => {
          swal(
            "There was an issue registering your organization. Please check fields and resubmit.",
            "warning"
          );
        });

      //Add the organization information
      await fetch(this.REACT_APP_AF_BACKEND_URL + "/addOrg/addInfo", {
        method: "POST",
        body: infoData
      })
        .then(response => response.json())
        .then(response => {
          if (response.status === "OK") {
            swal("Organization Information added", "Thank You!", "success");
          } else {
            swal(
              "Sorry There was an issue registering your organization. Please check fields and resubmit.",
              "warning"
            );
          }
        });
      this.setState(initialState);
      this.setState({
        addresses: initialState.addresses
      });
    }
    //Error handling
    else {
      if (this.state.organizationName === "") {
        swal("Organization name error", "Please enter a name", "warning");
        console.log(this.state.agreement);
      } else if (this.state.addresses[0].state === "") {
        swal("State error", "Please enter a state", "warning");
      } else if (this.state.addresses[0].city === "") {
        swal("City error", "Please enter a city", "warning");
      } else if (this.state.addresses[0].zip === "") {
        swal("Zip code error", "Please enter a zip code", "warning");
      } else if (this.state.agreement === " ") {
        swal("Agreement error", "Please agree to terms ", "warning");
      } else if (this.state.affordablePlacement === " ") {
        swal("All set error", "Please confirm the all set button ", "warning");
      } else {
        swal(
          "General error",
          "Please verify all your inputs are filled out correctly",
          "warning"
        );
      }
    }
  }

  render() {
    const { addresses } = this.state;

    return (
      <div className="col">
        <div className="row mt-5">
          <form className="col" onSubmit={this.handleSubmit}>
            <FormGroup
              labelName="Organization Name"
              value={this.state.organizationName}
              handleChange={this.handleChange("organizationName")}
            />

            {addresses.map((item, index) => {
              const a = this.state.addresses[index];
              return (
                <div key={index}>
                  <AddressFormGroup
                    addressLine1={this.state.addresses[index].addressLine1}
                    addressLine2={this.state.addresses[index].addressLine2}
                    city={this.state.addresses[index].city}
                    state={this.state.addresses[index].state}
                    zip={this.state.addresses[index].zip}
                    handleChange={this.handleAddressChange(index)}
                    key={index}
                  />
                </div>
              );
            })}

            <div className="form-group row">
              <div className="col-6" />
              <button onClick={this.addLocation}> Add Location </button>
            </div>

            <FormGroup
              labelName="Email"
              value={this.state.email}
              handleChange={this.handleChange("email")}
            />
            <FormGroup
              labelName="Phone Number"
              value={this.state.phoneNumber}
              handleChange={this.handleChange("phoneNumber")}
            />

            <FormGroup
              labelName="Fax Number"
              value={this.state.faxNumber}
              handleChange={this.handleChange("faxNumber")}
            />

            <FormGroup
              labelName="Website URL"
              value={this.state.websiteURL}
              handleChange={this.handleChange("websiteURL")}
            />
            <UserIDContext.Consumer>
              {value => <UserIDVal ID={value} />}
            </UserIDContext.Consumer>
            <UserEmailContext.Consumer>
              {value => <UserEmailVal Email={value} />}
            </UserEmailContext.Consumer>
            <div className="form-group row">
              <div className="col-1" />

              <label htmlFor="Services" className="col-2 col-form-label" />
              <div className="col-8">
                Do you provide healthcare services?
                <ul>
                  <li>
                    <label>
                      <input
                        id="provider-yes"
                        type="radio"
                        value="yes"
                        checked={this.state.providesServices === "yes"}
                        onChange={this.handleChange("providesServices")}
                      />
                      Yes
                    </label>
                  </li>

                  <li>
                    <label>
                      <input
                        id="provider-no"
                        type="radio"
                        value="no"
                        checked={this.state.providesServices === "no"}
                        onChange={this.handleChange("providesServices")}
                      />
                      No
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.providesServices === "yes" && [
              <div className="form-group row">
                <div className="col-1" />

                <label
                  htmlFor="Type of Service"
                  className="col-2 col-form-label"
                >
                  Type of Service
                </label>
                <div className="col-8">
                  <select
                    id="Service"
                    value={this.state.serviceType}
                    className="form-control"
                    onChange={this.handleChange("serviceType")}
                  >
                    <option value="" disabled selected>
                      Select Type of Service...
                    </option>
                    <option value="PC">Primary Care</option>
                    <option value="UC">Urgent Care</option>
                    <option value="GC">Geriatric Care</option>
                    <option value="MC">Mental Health Care</option>
                    <option value="DeC">Dental Care</option>
                    <option value="LDC">Laboratory and Diagnostic Care</option>
                    <option value="SAT">Substance Abuse Treatment</option>
                    <option value="OC">Optometry</option>
                    <option value="PrevC">Preventive Care</option>
                    <option value="POT">
                      Physical and Occupational Therapy
                    </option>
                    <option value="NS">Nutritional Support</option>
                    <option value="PhC">Pharmaceutical Care</option>
                    <option value="PrenC">Prenatal Care</option>
                  </select>
                </div>
              </div>,

              <div className="form-group row">
                <div className="col-1" />

                <label htmlFor="Specialty" className="col-2 col-form-label">
                  Specialty Care
                </label>
                <div className="col-8">
                  <select
                    id="Specialty"
                    value={this.state.specialty}
                    className="form-control"
                    onChange={this.handleChange("specialty")}
                  >
                    <option value="" disabled selected>
                      Select Specialty...
                    </option>
                    <option value="AA">Allergy & Asthma</option>
                    <option value="AN">Anesthesiology</option>
                    <option value="DERM">Dermatology</option>
                    <option value="ENDO">Endocrinology</option>
                    <option value="GASTRO">Gastroenterology</option>
                    <option value="GENSURGERY">General Surgery</option>
                    <option value="HEM">Hematology</option>
                    <option value="IMMUN">Immunology</option>
                    <option value="NEPHR">Nephrology</option>
                    <option value="NEURO">Neurology</option>
                    <option value="OBGYN">OB/GYN</option>
                    <option value="ONCO">Oncology</option>
                    <option value="OPHTHA">Ophthalmology</option>
                    <option value="ORTHO">Orthopedics</option>
                    <option value="OTORHINO">Otorhinolaryngology</option>
                    <option value="PTRM">
                      Physical Therapy + Rehabilitative Medicine
                    </option>
                    <option value="PSYCH">Psychiatry</option>
                    <option value="PULM">Pulmonary</option>
                    <option value="RADIO">Radiology</option>
                    <option value="RHEUM">Rheumatology</option>
                    <option value="URO">Urology</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            ]}

            <FormGroup
              labelName="Mission"
              value={this.state.mission}
              handleChange={this.handleChange("mission")}
            />

            <div className="form-group row">
              <div className="col-1" />

              <label htmlFor="banking" className="col-2 col-form-label" />
              <div className="col-8">
                Do you wish to add banking information for grant services now?
                <ul>
                  <li>
                    <label>
                      <input
                        id="banking-yes"
                        type="radio"
                        value="yes"
                        checked={this.state.bankInfo === "yes"}
                        onChange={this.handleChange("bankInfo")}
                      />
                      Yes
                    </label>
                  </li>

                  <li>
                    <label>
                      <input
                        id="banking-no"
                        type="radio"
                        value="no"
                        checked={this.state.bankInfo === "no"}
                        onChange={this.handleChange("bankInfo")}
                      />
                      No
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            {this.state.bankInfo === "yes" && [
              <FormGroup
                labelName="Account Nickname"
                value={this.state.nickname}
                handleChange={this.handleChange("nickname")}
              />,

              <FormGroup
                labelName="Name on Account"
                value={this.state.nameOnAccount}
                handleChange={this.handleChange("nameOnAccount")}
              />,

              <FormGroup
                labelName="Routing Number"
                value={this.state.routingNumber}
                handleChange={this.handleChange("routingNumber")}
              />,

              <FormGroup
                labelName="Account Number"
                value={this.state.accountNumber}
                handleChange={this.handleChange("accountNumber")}
              />,

              <FormGroup
                labelName="Verify Account Number"
                value={this.state.verifyAccountNumber}
                handleChange={this.handleChange("verifyAccountNumber")}
              />
            ]}

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="agreement" className="col-2 col-form-label" />
              <div className="col-8">
                Notice: Without verification, members of this organization will
                be unable to access personal information of individual
                applicants through AFFORDABLE.
                <ul>
                  <li>
                    <label>
                      <input
                        id="agreement-confirm"
                        type="radio"
                        value="agree"
                        checked={this.state.agreement === "agree"}
                        onChange={this.handleChange("agreement")}
                      />
                      Agree
                    </label>
                  </li>
                </ul>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label
                htmlFor="affordablePlacement"
                className="col-2 col-form-label"
              />
              <div className="col-8">
                Our application hosting and management portal is free, but
                before you can continue and use the service, please place our
                link on your website.
                <p>
                  <a href="https://www.affordhealth.org" target="_blank">
                    www.affordhealth.org
                  </a>
                </p>
                <ul>
                  <li>
                    <label>
                      <input
                        id="allset"
                        type="radio"
                        value="allSet"
                        checked={this.state.affordablePlacement === "allSet"}
                        onChange={this.handleChange("affordablePlacement")}
                      />
                      All Set!
                    </label>
                  </li>
                </ul>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col text-center">
                <form
                  className="App-login text-center"
                  onSubmit={this.handleUploadOrgRegistrationForm}
                >
                  <input
                    id="submit-button"
                    className="submit-button"
                    type="submit"
                    value="Add"
                  />
                </form>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default AddOrganization;
