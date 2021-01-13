import React, { Component, Fragment } from "react";
import "../../../../styles/buttons.css";
import "./scss/verify-organization.scss";
import "react-table/react-table.css";
import swal from "sweetalert";
import {UserEmailContext, UserIDContext} from "../../MainPagesRoutingContainer";

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

let userID = 0;
//donor admin user email
let userEmail ="";

const UserIDVal = ID => {
  userID = ID.ID;
  return null;
};

//UserEmailContext
const UserEmailVal = ID => {
  userEmail = ID.Email;
  return null;
};


class VerifyOrganization extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  
  constructor(props) {
    super(props);
    this.state = {
      organizationName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      usstate: "",
      zip: "",
      ein: "",
      taxSection: "",
      irsActivityCode: "",
      isVerified: false,
      verificationCode: "",
      userID: this.props.userID,
      userEmail: this.props.email
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerifyOrgForm = this.handleVerifyOrgForm.bind(this);
    this.formatAddress = this.formatAddress.bind(this);
  }

  /*Helper Functions*/

  formatAddress = ({
    streetAddress1,
    streetAddress2,
    city,
    stateOrProvince,
    postalCode
  }) => {
    console.log(this.state.addressLine1);
    return `${this.state.addressLine1} ${
      this.state.addressLine2 ? this.state.addressLine2 : ""
    } ${this.state.city}, ${this.state.usstate} ${this.state.zip}`;
  };

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };
  handleAddressChange = address => {
    return event => {
      this.setState({
        currentAddress: event.target.value
      });
      if (event.target.value !== "InputAddress") {
        this.setState({
          shouldHide: true
        });
      } else {
        this.setState({
          shouldHide: false
        });
      }
    };
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

  handleVerifyOrgForm(ev) {
    if (
      this.state.organizationName !== "" &&
      this.state.addressLine1 !== "" &&
      this.state.city !== "" &&
      this.state.usstate !== "" &&
      this.state.zip !== "" &&
      this.state.ein !== "" &&
      this.state.irsActivityCode !== ""
    ) {
      const orgData = new FormData();

      const orgName = document.getElementById("Organization-Name").value;
      const addrLine1 = document.getElementById("Address-Line-1").value;
      const addrLine2 = document.getElementById("Address-Line-2").value;
      const city = document.getElementById("City").value;
      const state = document.getElementById("State").value;
      const zip = document.getElementById("Zip").value;
      const ein = document.getElementById("EIN").value;
      const taxSection = document.getElementById("Tax-Section").value;
      const activityCode = document.getElementById("IRS-Activity-Code").value;

      orgData.append("orgName", orgName);
      orgData.append("addressLine1", addrLine1);
      orgData.append("addressLine2", addrLine2);
      orgData.append("city", city);
      orgData.append("state", state);
      orgData.append("zip", zip);
      orgData.append("ein", ein);
      orgData.append("taxSection", taxSection);
      orgData.append("irsActivityCode", activityCode);

      let status = false;
      fetch(this.REACT_APP_AF_BACKEND_URL + "/verifyOrg/verifyOrganization", {
        method: "POST",
        body: orgData
      })
        .then(response => {
          status = response.ok;
          return response.json();
        })
        .then(data => {
          console.log(data);
          if (status) {
            // Organization info matches ProPublica
            if (data.status === "OK") {
              if (data.valid === "true") {
                console.log("SUCCESS");
                this.setState({ isVerified: true });
                swal(
                  "Thank you, your organization has been verified with Affordable!",
                  "Welcome",
                  "success"
                );

                  // AWS email notify for verify org
                  const email = userEmail;
                  if (email !== "") {
                      let data = new FormData();
                      data.append("email", email);
                      console.log("here", data);
                      fetch(this.REACT_APP_AF_BACKEND_URL + "/verifyOrg/email/notifyVerifyOrg", {
                          method: "POST",
                          body: data
                      })
                          .then(response => {
                              if (response.ok) return response.json();
                          })
                          .then(resData => {
                              console.log(resData);
                          });
                  }

              } else if (data.valid === "false") {
                console.log("SUCCESS");
                this.setState({ isVerified: true });
                swal(
                  "Thank you, your organization will soon be verified with Affordable!",
                  "Welcome",
                  "success"
                );

              }
            } else if (data.status === "NOT OK" && data.valid === "false") {
              swal(
                "Please add your organization before verification",
                "",
                "warning"
              );


            }
          } else {
            swal(
              "There was an issue registering your organization. Please check fields and resubmit.",
              "warning"
            )
          }

        });
    } else {
      if (this.state.organizationName === "") {
        swal(
          "Organization name error",
          "Please enter your organization's name",
          "warning"
        );
      } else if (this.state.addressLine1 === "") {
        swal(
          "Address error",
          "Please enter your organization's primary address",
          "warning"
        );
      } else if (this.state.city === "") {
        swal("City error", "Please enter a city", "warning");
      } else if (this.state.usstate === "") {
        swal("State error", "Please enter a state", "warning");
      } else if (this.state.zip === "") {
        swal("Zip code error", "Please enter a zip code", "warning");
      } else if (this.state.ein === "") {
        swal("EIN error", "Please enter an EIN", "warning");
      } else if (this.state.taxSection === "") {
        swal("Tax section error", "Please enter a Tax Section", "warning");
      } else if (this.state.irsActivityCode === "") {
        swal(
          "IRS Activity Code error",
          "Please enter an IRS Activity Code",
          "warning"
        );
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
    let verification = "";
    console.log(this.state.isVerified);
    if (this.state.isVerified) {
      console.log("VERIFIED");
      verification = (
        <Fragment>
          <div className="form-group row">
            <div className="col-1" />
            <label htmlFor="verification" className="col-2 col-form-label" />
            <div className="col-8">
              The information provided has been verified by the IRS. A
              confirmation code has been sent to:
              <h2>
                {" "}
                {this.formatAddress(
                  this.state.addressLine1,
                  this.state.addressLine2,
                  this.state.city,
                  this.state.usstate,
                  this.state.zip
                )}{" "}
              </h2>
              <p />
              <p>
                Please confirm the organization's identity by entering the code
                below:
              </p>
            </div>
            <div className="col-1" />
          </div>

          <FormGroup
            labelName="Verification Code"
            value={this.state.verificationCode}
            handleChange={this.handleChange("verificationCode")}
          />

          <div className="form-group row">
            <div className="col text-center">
              <input className="submit-button" type="submit" value="Submit" />
            </div>
          </div>
        </Fragment>
      );
    } else {
      verification = "";
    }
    return (
      <div className="col">
        <p>
          {" "}
          To be verified on AFFORDABLE, you must be registered as a nonprofit
          organization by the Internal Revenue Service (IRS).
        </p>
        <p> Please enter the following information as provided with the IRS.</p>

        <div className="row mt-5">
          <form className="col" onSubmit={this.handleSubmit}>
            <FormGroup
              labelName="Organization Name"
              value={this.state.organizationName}
              handleChange={this.handleChange("organizationName")}
            />

            <div className={this.state.shouldHide ? "hidden" : ""}>
              <FormGroup
                labelName="Address Line 1"
                value={this.state.addressLine1}
                handleChange={this.handleChange("addressLine1")}
              />

              <FormGroup
                labelName="Address Line 2"
                value={this.state.addressLine2}
                handleChange={this.handleChange("addressLine2")}
              />

              <div className="form-group row">
                <div className="col-1" />

                <label htmlFor="City" className="col-2 col-form-label">
                  City
                </label>
                <div className="col">
                  <input
                    id="City"
                    className="form-control"
                    type="city"
                    value={this.state.city}
                    onChange={this.handleChange("city")}
                  />
                </div>

                <label htmlFor="State" className="col-1 col-form-label">
                  State
                </label>
                <div className="col">
                  <select
                    id="State"
                    value={this.state.usstate}
                    className="form-control"
                    onChange={this.handleChange("usstate")}
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
                    value={this.state.zip}
                    onChange={this.handleChange("zip")}
                  />
                </div>
                <div className="col-1" />
              </div>
            </div>

            <UserIDContext.Consumer>
              {value => <UserIDVal ID={value} />}
            </UserIDContext.Consumer>
            <UserEmailContext.Consumer>
              {value => <UserEmailVal Email={value} />}
            </UserEmailContext.Consumer>

            <FormGroup
              labelName="EIN"
              value={this.state.ein}
              handleChange={this.handleChange("ein")}
            />

            <div className="form-group row">
              <div className="col-1" />

              <label htmlFor="Tax Section" className="col-2 col-form-label">
                Tax Section
              </label>
              <div className="col-8">
                <select
                  id="Tax-Section"
                  value={this.state.taxSection}
                  className="form-control"
                  onChange={this.handleChange("taxSection")}
                >
                  <option value="" disabled selected>
                    Select Tax Section...
                  </option>
                  <option value="2">501(c)(2)</option>
                  <option value="3">501(c)(3)</option>
                  <option value="4">501(c)(4)</option>
                  <option value="5">501(c)(5)</option>
                  <option value="6">501(c)(6)</option>
                  <option value="7">501(c)(7)</option>
                  <option value="8">501(c)(8)</option>
                  <option value="9">501(c)(9)</option>
                  <option value="10">501(c)(10)</option>
                  <option value="11">501(c)(11)</option>
                  <option value="12">501(c)(12)</option>
                  <option value="13">501(c)(13)</option>
                  <option value="14">501(c)(14)</option>
                  <option value="15">501(c)(15)</option>
                  <option value="16">501(c)(16)</option>
                  <option value="17">501(c)(17)</option>
                  <option value="18">501(c)(18)</option>
                  <option value="19">501(c)(19)</option>
                  <option value="21">501(c)(21)</option>
                  <option value="22">501(c)(22)</option>
                  <option value="23">501(c)(23)</option>
                  <option value="25">501(c)(25)</option>
                  <option value="26">501(c)(26)</option>
                  <option value="27">501(c)(27)</option>
                  <option value="28">501(c)(28)</option>
                  <option value="92">4947(a)(1)</option>
                </select>
              </div>
            </div>

            <FormGroup
              labelName="IRS Activity Code"
              value={this.state.irsActivityCode}
              handleChange={this.handleChange("irsActivityCode")}
            />

            <div className="form-group row">
              <div className="col text-center">
                <form
                  className="App-login text-center"
                  onSubmit={this.handleVerifyOrgForm}
                >
                  <input
                    className="submit-button"
                    type="submit"
                    value="Submit"
                  />
                </form>
              </div>
            </div>
          </form>
        </div>

        {verification}
      </div>
    );
  }
}
export default VerifyOrganization;
