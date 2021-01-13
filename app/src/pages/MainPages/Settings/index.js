import React, { Component } from "react";
import CollapseWithHeader from "../../../components/CollapseWithHeader";
import QRCode from "qrcode";
import swal from "sweetalert";
import "./scss/settings.scss";
import { AffordableClient, AffordableHttpError } from "affordable-client";
import BankingInfoTab from "./BankingInfoTab";
import { AddTwoFactorComponent, ValidateTwoFactorComponent } from "../../../components/TwoFactor/TwoFactor";
const speakeasy = require("speakeasy");
const randomstring = require("randomstring");
const utils = require("../../../utils");

/*
 ***************************************************************************
 * Components that make up AccountTab start here
 ***************************************************************************
 */ 

class EmailsTableEntry extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

  
    // An entry can be in three states:
    // IDLE
    // CHANGING_EMAIL
    // DELETING
    this.state = {
      entryState: "IDLE",
      email: this.props.email,
      isPrimary: this.props.isPrimary,
      username: this.props.user,
      verified: this.props.verified,
      city: "",
      state: "",
      ipAddr: "",
      ipKey: "4a51eca5db4bb71dc9fa9cf08dd6294a"
    };
  }

  componentDidMount() {
    this.getIPAddr();
  }

  getIPAddr = () => {
    fetch("http://api.ipstack.com/check?access_key=" + this.state.ipKey, {
      method: "GET"
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(resData => {
        this.setState({
          ipAddr: resData.ip,
          state: resData.region_name,
          city: resData.city
        });
      });
  };

  setLastActivity = (name, act) => {
    let date = new Date();
    date = date.toString();
    const data = {
      state: this.state.state,
      city: this.state.city,
      IPAddr: this.state.ipAddr,
      Timestamp: date,
      username: name
    }  
    this.props.AffordableClient.addActivity(data).then(response => {
      if(response.statusText === "OK") {
        console.log("activity update success on login");
      } else {
        console.log("unable to change activity");
      }
    })
  };

  showAlertOnValidateEmail = () => {
    if (
      window.confirm(
        "Verify email: " + document.getElementById("new-email").value + "?"
      )
    ) {
        const email = document.getElementById("new-email").value;
        if (email.length > 0) {
          const oldEmail = this.state.email;
          const data = new FormData();
          data.append("email", email);
          this.props.client.updatePrimaryEmail(email)
          .then(resData => {
            window.location.reload(true);
            
          });
        } else{
          swal("Error", "No Email Entered. Please try again", "error");
        }
    }
  };

  deleteEmail = () => {
    this.setLastActivity(this.state.username, "Deleted email");

    const data = {
      email: this.state.email
    }  
    this.props.AffordableClient.deleteEmail(data).then(response => {
      if(response.statusText === "OK") {
        window.location.reload(true);
      } else {
        swal("Error", "unable to delete email", "error");
      }
    })
  };

  makePrimary = () => {
    this.setLastActivity(this.state.username, "Changed primary email");
    const data = new FormData();
    data.append("email", this.state.email);

    fetch(this.REACT_APP_AF_BACKEND_URL + "/profile/make-primary", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok)
        return response.json().then(resData => {
          alert(resData.success);
          window.location.reload(true);
        });
      else {
        swal("Error", "unable to make primary email", "error");
      }
    });
  };

  handleEntryStateChange = element => {
    this.setState({
      entryState: element.target.value
    });
  };

  handleBackToIdle = () => {
    this.setState({
      entryState: "IDLE"
    });
  };

  showAlertOnValidateSecondaryEmail = () => {
    if (window.confirm("Verify email: " + this.state.email + "?")) {
      const email = this.state.email;
      const data = {
        email: email
      }  
      this.props.AffordableClient.checkEmail(data).then(response => {
        if(response.statusText === "OK") {
          const data2 = new FormData();
          const randomstring = require("randomstring");
          data2.append("username", this.state.username);
          data2.append("newEmail", email); //additional email
          data2.append("oldEmail", ""); //primary email for account
          data2.append("randomString", randomstring.generate());
          data2.append("timestamp", Date.now());
          return fetch(
            this.REACT_APP_AF_BACKEND_URL + "/profile/add-secondary-email-verify",
            {
              method: "POST",
              body: data2
            }
          ).then(response => {
            if (response.ok) {
              this.setState({ name2: "", validateEmail: true });
              swal("", "Please Check Your Email", "warning");
            } else {
              swal("Error", "Please Try Again", "error");
            }
          });
        } 
      })
    }
  };

  render() {
    let dropdown = null;

    switch (this.state.entryState) {
      case "IDLE":
        dropdown = <div></div>;
        break;
      case "CHANGING_EMAIL":
        dropdown = (
          <div className="row bottomMarginSmall">
            {/*This div serves as left padding*/}
            <div className="col-2"></div>

            <div className="col">
              <button
                className="btn btn-info bottomMarginSmall"
                onClick={this.handleBackToIdle}
              >
                Close Dropdown
              </button>
              <input
                type="email"
                id="new-email"
                placeholder="Enter a new email"
                className="form-control bottomMarginSmall"
              />
              <button
                value="confirmChange"
                className="btn btn-warning"
                onClick={this.showAlertOnValidateEmail}
              >
                Confirm Change Email
              </button>
            </div>
          </div>
        );
        break;

      case "DELETING":
        dropdown = (
          <div className=" row bottomMarginSmall">
            {/*This div serves as left padding*/}
            <div className="col-2"></div>

            <div className="col">
              <button
                className="btn btn-info bottomMarginSmall"
                onClick={this.handleBackToIdle}
              >
                Close Dropdown
              </button>
              <h3>
                Are you sure you would like to delete {this.state.email} from
                your account?
              </h3>
              <button
                value="confirmDelete"
                className="btn btn-warning"
                onClick={this.deleteEmail}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        );
        break;

      default:
        console.log("ERROR");
    }

    return (
      <div>
        <div className="row bottomMarginSmall">
          {/*PRIMARY COLUMN*/}
          <div className="col-1">
            {this.state.isPrimary ? (
              <div
                className="customRadioButtonBorder marker markerTrue"
                onClick={this.makePrimary}
              ></div>
            ) : (
              <div
                className="customRadioButtonBorder marker markerFalse"
                id="secondaryEmail"
                onClick={this.makePrimary}
              ></div>
            )}
          </div>

          {/*VERIFIED COLUMN*/}
          <div className="col-1">
            <h1>{this.props.verified ? "✔" : "x"}</h1>
          </div>

          {/*EMAIL COLUMN*/}
          <div className="col">
            <h2 className="headingPaddingRightSmall">{this.props.email}</h2>
          </div>

          {/*OPTIONS COLUMN*/}
          <div className="col">
            <button
              value="CHANGING_EMAIL"
              className="btn btn-primary"
              onClick={this.handleEntryStateChange}
            >
              Change Email
            </button>
            {this.state.isPrimary ? null : (
              <button
                value="DELETING"
                className="btn btn-danger"
                onClick={this.handleEntryStateChange}
              >
                Delete
              </button>
            )}

            {!this.props.verified ? (
              <button
                value="VERIFYING"
                className="btn btn-info"
                onClick={this.showAlertOnValidateSecondaryEmail}
              >
                Resend Verification Email
              </button>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* THIS PART DEPENDS ON THE CURRENT STATE OF THE ENTRY*/}
        {dropdown}
      </div>
    );
  }
}

class EmailsTablePanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

    this.state = {
      emails: [],
      username: this.props.user
    };

    // handlers will go here
  }

  componentDidMount() {
    this.props.client.getEmails(this.props.user).then(resData => {
      console.log(resData.emails)
      this.setState({
        emails: resData.emails
      });
      console.log("Emails returned" + this.state.emails)
      console.log(this.state.emails.length)
    });

      // TODO: maybe alert of failure to fetch emails later
  }

  render() {
    const username = this.state.username;
    const client = this.props.client;
    const entries = this.state.emails.map(function(element, idx) {
      return (
        <EmailsTableEntry
          key={idx}
          user={username}
          email={element.email}
          isPrimary={element.isPrimary}
          verified={element.verified}
          client={client}
        />
      );
    });

    return (
      <CollapseWithHeader title="Email Management" open={true}>
        <div className="dropdownWrapper">
          <div className="row">
            <div className="col-1">Primary</div>
            <div className="col-1">Verified</div>
            <div className="col">Email</div>
            <div className="col">Options</div>
          </div>

          {entries}
        </div>
      </CollapseWithHeader>
    );
  }
}

class ResetPasswordPanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

    this.state = {
      changingPassword: false,
      passwordsMatching: false,
      username: this.props.user,
      email: this.props.email,
      passwordFeedback: [],
      ipKey: "4a51eca5db4bb71dc9fa9cf08dd6294a",
      city: "",
      state: "",
      ipAddr: "",
      QRState: false
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.showAlertPasswordChange = this.showAlertPasswordChange.bind(this);
    this.checkPasswordsMatching = this.checkPasswordsMatching.bind(this);
    this.getIPAddr = this.getIPAddr.bind(this);
    this.setLastActivity = this.setLastActivity.bind(this);
    // this.requireTwoFactorChangePassword = this.requireTwoFactorChangePassword.bind(
    //   this
    // );
    // this.handleValidateTwoFactor = this.handleValidateTwoFactor.bind(this);
  }

  setLastActivity(name) {
    const data = new FormData();
    let date = new Date();
    date = date.toString();
    data.append("state", this.state.state);
    data.append("city", this.state.city);
    data.append("IPAddr", this.state.IPAddr);
    data.append("Timestamp", date);
    data.append("Last_Act", "Password reset");
    data.append("username", name);
    fetch(this.REACT_APP_AF_BACKEND_URL + "/activity/add-activity", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok)
        return response.json().then(() => {
          console.log("activity update success on login");
        });
      else {
        console.log("unable to change activity");
      }
    });
  }

  getIPAddr() {
    fetch("http://api.ipstack.com/check?access_key=" + this.state.ipKey, {
      method: "GET"
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(resData => {
        this.setState({
          ipAddr: resData.ip,
          state: resData.region_name,
          city: resData.city
        });
      });
  }
  handlePasswordChange() {
    this.setState({
      changingPassword: !this.state.changingPassword
    });
  }
  componentDidMount() {
    this.getIPAddr();
    // this.requireTwoFactorChangePassword();
  }
  showAlertPasswordChange() {
    this.setLastActivity(this.state.username);
    if (this.state.passwordsMatching) {
      const currentPw = document.getElementById("current-pw").value.toString();
      const newPw = document.getElementById("new-pw-1").value.toString();

      this.props.client.changePassword(
        currentPw, newPw
      )
        .then(() => {
          swal(
            "Password Updated",
            "Your password has now changed",
            "success"
          );
        })
        .catch(error => {
          console.log(error);
          swal(
            "There was an error changing your password",
            error.message,
            "error"
          );
        });
      this.handlePasswordChange();
    }
  }

  // requireTwoFactorChangePassword() {
  //   const data = new FormData();
  //   data.append("username", this.state.username);
  //   fetch("http://localhost:4000/profile/get-devices", {
  //     method: "POST",
  //     body: data
  //   }).then(response => {
  //     if (response.ok)
  //       return response.json().then(resData => {
  //         if (resData.devices) {
  //           this.setState({
  //             QRState: true
  //           });
  //         }
  //       });
  //   });
  // }

  // handleValidateTwoFactor(event) {
  //   console.log("validating two-factor for change password");

  //   event.preventDefault();
  //   const data = new FormData();
  //   const name = this.state.username;
  //   const token = document.getElementById("token").value;
  //   const GoogleAuthOpt = this.state.QRState;
  //   data.append("token", token);
  //   data.append("username", name);
  //   data.append("GoogleAuth", GoogleAuthOpt);
  //   fetch("http://localhost:4000/authentication/two-factor/username", {
  //     method: "POST",
  //     body: data
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       response.verified ? this.showAlertSucc2() : this.showAlertFail();
  //     });
  // }

  // showAlertSucc2() {
  //   swal("Success!", "Two factor code validated", "success");
  //   this.showAlertPasswordChange();
  // }

  // upon failure
  showAlertFail() {
    swal("Error", "Please Try Again", "error");
  }

  checkPasswordsMatching() {
    // TODO: can be improved but works for now
    const pw1 = document.getElementById("new-pw-1").value;
    const pw2 = document.getElementById("new-pw-2").value;

    if (pw1 === pw2 && utils.passwordMeetsCriteria(pw1)) {
      this.setState({
        passwordsMatching: true,
        passwordFeedback: [] // No feedback to give if the password criteria is met
      });
    } else {
      const feedback = utils.getPasswordFeedback(pw1);

      if (pw1 !== pw2) {
        feedback.unshift("Passwords are not matching");
      }

      this.setState({
        passwordsMatching: false,
        passwordFeedback: feedback
      });
    }
  }

  render() {
    const QRAuthenticationForm = () => {
      return (
        <div className="row mt-5">
          <div className="col" align="center">
            <input
              type="text"
              id="token"
              placeholder="Enter 6-digit token from Google Authenticator App"
              className="form-control bottomMarginSmall"
            />
            <br />
            <button
              // onClick={this.handleValidateTwoFactor}
              id="authenticate"
              className="App-login-button2 bottomMarginSmall"
            >
              Authenticate and Change Password
            </button>
          </div>
        </div>
      );
    };

    return (
      <div>
        {this.state.changingPassword ? (
          <div>
            <div className="d-flex bottomMarginSmall">
              <h2 className="headingPaddingRightSmall">Password Management</h2>
              <button
                className="btn btn-warning"
                onClick={this.handlePasswordChange}
              >
                Discard Changes
              </button>
            </div>

            <input
              type="password"
              id="current-pw"
              placeholder="Enter Current Password"
              className="form-control bottomMarginSmall"
            />
            <input
              type="password"
              id="new-pw-1"
              placeholder="Enter New Password"
              className="form-control bottomMarginSmall"
              onChange={this.checkPasswordsMatching}
            />
            <input
              type="password"
              id="new-pw-2"
              placeholder="Enter New Password Again"
              className="form-control bottomMarginSmall"
              onChange={this.checkPasswordsMatching}
            />

            {this.state.passwordsMatching ? (
              <h3 className="bottomMarginSmall">Passwords are matching</h3>
            ) : (
              <div>
                <ul>
                  {this.state.passwordFeedback.map(function(entry, idx) {
                    return <li key={idx}>{entry}</li>;
                  })}
                </ul>
              </div>
            )}
            {/* QR AUTHENTICATION */}
            {this.state.QRState ? (
              <QRAuthenticationForm />
            ) : (
              <button
                className="btn btn-primary btnText bottomMarginSmall"
                id="resetPasswordBtn"
                onClick={this.showAlertPasswordChange}
              >
                Reset Password
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex">
            <h2 className="headingPaddingRightSmall">Password Management</h2>
            <button
              className="btn btn-info"
              id="changePasswordBtn"
              onClick={this.handlePasswordChange}
            >
              Change
            </button>
          </div>
        )}
      </div>
    );
  }
}

class PrimaryEmailChangePanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

    this.state = {
      changingEmail: false,
      email: this.props.email,
      username: this.props.user,
      setup: false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailChangeSubmission = this.handleEmailChangeSubmission.bind(
      this
    );
    this.showAlertOnValidateEmail = this.showAlertOnValidateEmail.bind(this);

    // TODO: maybe handle some way of getting feedback for if the email submission went through
  }

  showAlertOnValidateEmail() {
    if (
      window.confirm(
        "Verify email: " +
          document.getElementById("change-primary-email").value +
          "?"
      )
    ) {
      const email = document.getElementById("change-primary-email").value;
      const oldEmail = this.state.email; //gets old email from call to get-primary-email
      const data = new FormData();
      data.append("email", email);

      fetch(this.REACT_APP_AF_BACKEND_URL + "/authentication/email", {
        method: "POST",
        body: data
      })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(resData => {
          if (resData.emailIsUnique) {
            const data2 = new FormData();
            const randomstring = require("randomstring");

            data2.append("username", this.state.username);
            data2.append("newEmail", email);
            data2.append("oldEmail", oldEmail);
            data2.append("randomString", randomstring.generate());
            data2.append("timestamp", Date.now());
            return fetch(
              this.REACT_APP_AF_BACKEND_URL + "/profile/primary-email-change-verify",
              {
                method: "POST",
                body: data2
              }
            ).then(response => {
              if (response.ok) {
                this.setState({ name2: "", validateEmail: true });
                swal("Error", "Please Check Your Email", "error");
              }
            });
          } else {
            window.confirm(
              "Email: " +
                document.getElementById("change-primary-email").value +
                " is already in the database"
            );
            document.getElementById("change-primary-email").value = "";
          }
        });
    } else {
      swal("Error", "Please Try Again", "error");
    }
  }

  handleEmailChange() {
    this.setState({
      changingEmail: !this.state.changingEmail
    });
  }

  handleEmailChangeSubmission(event) {
    console.log(event);
  }

  render() {
    return (
      <div className="emailChangeWrapper">
        {this.state.changingEmail ? (
          <div>
            <div className="d-flex bottomMarginSmall">
              <h2 className="headingPaddingRightSmall">
                Email(primary): {this.state.email}
              </h2>
              <button
                className="btn btn-warning"
                onClick={this.handleEmailChange}
              >
                Discard Changes
              </button>
            </div>

            <input
              placeholder="Enter New Email"
              className="form-control bottomMarginSmall"
              id="change-primary-email"
            />
            <button
              className="btn btn-primary btnText"
              onClick={this.showAlertOnValidateEmail}
            >
              Validate
            </button>
          </div>
        ) : (
          <div className="d-flex">
            <h2 className="headingPaddingRightSmall">
              Email(primary): {this.state.email}
            </h2>
            <button className="btn btn-info" onClick={this.handleEmailChange}>
              Change
            </button>
          </div>
        )}
      </div>
    );
  }
}

class SecondaryEmailChangePanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

    this.state = {
      changingEmail: false,
      email: this.props.email,
      username: this.props.user
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailChangeSubmission = this.handleEmailChangeSubmission.bind(
      this
    );
    this.showAlertOnValidateSecondaryEmail = this.showAlertOnValidateSecondaryEmail.bind(
      this
    );

    // TODO: maybe handle some way of getting feedback for if the email submission went through
  }
  showAlertOnValidateSecondaryEmail() {
    if (
      window.confirm(
        "Verify email: " +
          document.getElementById("change-secondary-email").value +
          "?"
      )
    ) {
      const email = document.getElementById("change-secondary-email").value;
      const data = new FormData();
      data.append("email", email);
      fetch(this.REACT_APP_AF_BACKEND_URL + "/authentication/email", {
        method: "POST",
        body: data
      })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(resData => {
          if (resData.emailIsUnique) {
            const data2 = new FormData();
            const randomstring = require("randomstring");
            data2.append("username", this.state.username);
            data2.append("newEmail", email); //additional email
            data2.append("oldEmail", this.state.email); //primary email for account
            data2.append("randomString", randomstring.generate());
            data2.append("timestamp", Date.now());
            return fetch(
              this.REACT_APP_AF_BACKEND_URL + "/profile/add-secondary-email-verify",
              {
                method: "POST",
                body: data2
              }
            ).then(response => {
              if (response.ok) {
                const data3 = new FormData();
                data3.append("username", this.state.username);
                data3.append("email", email);
                return fetch(
                  this.REACT_APP_AF_BACKEND_URL + "/profile/add-unverified-email",
                  {
                    method: "POST",
                    body: data3
                  }
                ).then(response => {
                  if (response.ok) {
                    this.setState({ name2: "", validateEmail: true });
                    swal("", "Please Check Your Email", "warning");
                  }
                });
              }
            });
          } else {
            window.confirm(
              "Email: " +
                document.getElementById("change-secondary-email").value +
                " is already in the database"
            );
            document.getElementById("change-secondary-email").value = "";
          }
        });
    } else {
      swal("Error", "Please Try Again", "error");
    }
  }

  handleEmailChange() {
    this.setState({
      changingEmail: !this.state.changingEmail
    });
  }

  handleEmailChangeSubmission(event) {
    console.log(event);
  }

  render() {
    return (
      <div className="emailChangeWrapper">
        {this.state.changingEmail ? (
          <div>
            <div className="d-flex bottomMarginSmall">
              <h2 className="headingPaddingRightSmall">Add an Email</h2>
              <button className="addEmail" onClick={this.handleEmailChange}>
                Discard Changes
              </button>
            </div>

            <input
              placeholder="Enter New Email"
              className="form-control bottomMarginSmall"
              id="change-secondary-email"
            />
            <button
              className="btn btn-primary btnText"
              onClick={this.showAlertOnValidateSecondaryEmail}
            >
              Validate
            </button>
          </div>
        ) : (
          <div className="d-flex">
            <h2 className="headingPaddingRightSmall" id="addEmailButton">
              Add an Email
            </h2>
            <button
              className="btn btn-info"
              id="addEmailBtn"
              onClick={this.handleEmailChange}
            >
              Change
            </button>
          </div>
        )}
      </div>
    );
  }
}

class AccountActivityPanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

    this.state = {
      time1: "N/A",
      time2: "N/A",
      time3: "N/A",
      change1: "N/A",
      change2: "N/A",
      change3: "N/A",
      username: this.props.user,
      email: this.props.email,
      times: [],
      acts: []
    };

    this.handleActivityChange = this.handleActivityChange.bind(this);
  }

  handleActivityChange() {
    const data = new FormData();
    data.append("username", this.state.username);

    fetch(this.REACT_APP_AF_BACKEND_URL + "/activity/get-activity", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok)
        return response.json().then(resData => {
          const size = resData.activities.length - 1;
          this.setState({ acts: resData.activities });
          if (this.state.acts[size]) {
            this.setState({ change1: this.state.acts[size].Last_Act });
          }
          if (this.state.acts[size - 1]) {
            this.setState({ change2: this.state.acts[size - 1].Last_Act });
          }
          if (this.state.acts[size - 2]) {
            this.setState({ change3: this.state.acts[size - 2].Last_Act });
          }
        });
      else {
        swal("Error", "unable to see last activity", "error");
      }
    });
    const data2 = new FormData();
    data2.append("username", this.state.username);

    fetch(this.REACT_APP_AF_BACKEND_URL + "/activity/get-timestamp", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok)
        return response.json().then(resData => {
          const size = resData.Timelog.length - 1;
          this.setState({ times: resData.Timelog });
          if (this.state.times[size]) {
            this.setState({ time1: this.state.times[size].Timestamp });
          }
          if (this.state.times[size - 1]) {
            this.setState({ time2: this.state.times[size - 1].Timestamp });
          }
          if (this.state.times[size - 2]) {
            this.setState({ time3: this.state.times[size - 2].Timestamp });
          }
        });
      else {
        swal("Error", "unable to see last activity time", "error");
      }
    });
  }

  render() {
    return (
      <CollapseWithHeader title="Account Activity" open={true}>
        <div className="dropdownWrapper">
          <button
            className="btn btn-primary activityButton"
            onClick={this.handleActivityChange}
          >
            Update Account Activity
          </button>
          <h2>Latest Login Times</h2>
          <ol>
            <li>{this.state.time1}</li>
            <li>{this.state.time2}</li>
            <li>{this.state.time3}</li>
          </ol>

          <h2>Latest Profile Changes</h2>
          <ol>
            <li>{this.state.change1}</li>
            <li>{this.state.change2}</li>
            <li>{this.state.change3}</li>
          </ol>
        </div>
      </CollapseWithHeader>
    );
  }
}

class AccountTab extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  // TODO: Finish Account Panel
  render() {
    return (
      <div>
        <ResetPasswordPanel user={this.props.user} email={this.props.email} client={this.props.client}/>
        {/* <PrimaryEmailChangePanel
          user={this.props.user}
          email={this.props.email}
        />
        <SecondaryEmailChangePanel
          user={this.props.user}
          email={this.props.email}
        /> */}
        <EmailsTablePanel 
          user={this.props.user}
          client={this.props.client} 
        />
        {/* <AccountActivityPanel user={this.props.user} email={this.props.email} />
        {/* <AccountClosurePanel
          user={this.props.user}
          email={this.props.email}
          props={this.props.childProps}
        /> */}
      </div>
    );
  }
}

/*
 ***************************************************************************
 * Components that make up SecurityTab start here
 ***************************************************************************
 */
class SecurityRecommendationsPanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  render() {
    return (
      <CollapseWithHeader title="Security recommendations" open={true}>
        <div className="dropdownWrapper">
          <ul className="securityRecommendationsList">
            <li>Two-factor authentication for login</li>
            <li>Add a back-up email address</li>
            <li>
              Use caution when accessing your account through public Wi-Fi
            </li>
            <li>
              Enable timed log-off, especially when using public computers
            </li>
          </ul>
        </div>
      </CollapseWithHeader>
    );
  }
}

class TwoFactorAuthenticationPanel extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);

    // TODO: Get initial state from server, and re-render if state changes
    this.state = {
      login: true,
      passwordUpdates: false,
      securitySettingChanges: true,
      bankAccountWithdraw: false,
      secret: speakeasy.generateSecret({ length: 20 }),
      username: this.props.user,
      email: this.props.email,
      deviceList: [],
      isAddingDevice: false
    };

    this.handleTwoFactorCodeValidation = this.handleTwoFactorCodeValidation.bind(
      this
    );
    this.handleStoreTwoFactorDatabase = this.handleStoreTwoFactorDatabase.bind(
      this
    );
    this.handleRemoveTwoFactorDevice = this.handleRemoveTwoFactorDevice.bind(
      this
    );
    this.handleAddDeviceClick = this.handleAddDeviceClick.bind(this);
  }

  //when the page loads, a request is sent to the server to retrieve all two-factor devices for the user, and the results are populated into this.state.devices
  componentDidMount() {
    const data = new FormData();
    data.append("username", this.props.user);
    fetch(this.REACT_APP_AF_BACKEND_URL + "/profile/get-devices", {
      method: "POST",
      body: data
    }).then(response => {
      if (response.ok)
        return response.json().then(resData => {
          this.setState({
            deviceList: resData.devices
          });
        });
    });
  }

  handleAddDeviceClick() {
    this.setState({
      isAddingDevice: true
    });
  }

  //call then when user clicks Authenticate after inputting 6 digit token from google authenticator app
  handleTwoFactorCodeValidation(ev) {
    ev.preventDefault();

    const data = new FormData();

    const token = document.getElementById("token").value;
    data.append("token", token);
    // var x = this.state.tempvar; //Math.floor((Math.random() * 1000) + 1);
    data.append("imageid", this.state.imageURL);
    data.append("secret", this.state.secret.base32);

    fetch(this.REACT_APP_AF_BACKEND_URL + "/authentication/two-factor", {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(response => {
        if (response.verified) {
          this.showAlertSucc();
          this.handleStoreTwoFactorDatabase();
        } else {
          this.showAlertFail();
        }
      });
  }

  showAlertSucc() {
    swal(
      "Success!",
      "your device now has 2 factor authentication! \n We also recommend securing your device with a password to prevent fraud",
      "success"
    );
    this.forceUpdate();
  }
  showAlertFail() {
    swal("Error", "Please Try Again", "error");
  }

  handleStoreTwoFactorDatabase() {
    const data = new FormData();
    data.append("DeviceName", document.getElementById("device-name").value);
    data.append("Username", this.state.username);
    data.append("Email", this.state.email);
    data.append("RandomString", randomstring.generate());
    data.append("Timestamp", Date.now());
    data.append("Secret", this.state.secret.base32);

    console.log(data);
    fetch(this.REACT_APP_AF_BACKEND_URL + "/profile/add-two-factor", {
      method: "POST",
      body: data
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(() => {});
  }

  handleRemoveTwoFactorDevice() {
    const data = new FormData();
    data.append(
      "DeviceName",
      document.getElementById("remove-device-name").value
    );
    data.append("Username", this.state.username);
    data.append("Email", this.state.email);

    console.log(data);
    fetch(this.REACT_APP_AF_BACKEND_URL + "/profile/remove-two-factor", {
      method: "POST",
      body: data
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(resData => {
        if (resData.changed) {
          swal("Your Two Factor Device has been Removed!", "success");
        } else {
          swal("Error!", "No device found with this name", "error");
        }
      });
  }

  render() {
    let devices = <p>None at the moment</p>;

    if (
      this.state.deviceList !== undefined &&
      this.state.deviceList.length > 0
    ) {
      devices = this.state.deviceList.map(function(element, idx) {
        return <li key={idx}>{element.deviceName}</li>;
      });
    }

    // TODO: this is how you use qrcode dependency
    let qrcodeUrl = "";

    QRCode.toDataURL(this.state.secret.otpauth_url, function(err, url) {
      qrcodeUrl = url;
    });

    return (
      <CollapseWithHeader title="Two-Factor Authentication" open={true}>
        <div className="dropdownWrapper">
          <h2>Protected Actions</h2>
          <br />

          <div className="markerContainer">
            {this.state.login ? (
              <div className="marker markerTrue"></div>
            ) : (
              <div className="marker markerFalse"></div>
            )}
            <p>Login</p>
          </div>

          <div className="markerContainer">
            {this.state.passwordUpdates ? (
              <div className="marker markerTrue"></div>
            ) : (
              <div className="marker markerFalse"></div>
            )}
            <p>Password updates</p>
          </div>

          <div className="markerContainer">
            {this.state.securitySettingChanges ? (
              <div className="marker markerTrue"></div>
            ) : (
              <div className="marker markerFalse"></div>
            )}
            <p>Security setting changes</p>
          </div>

          <div className="markerContainer">
            {this.state.bankAccountWithdraw ? (
              <div className="marker markerTrue"></div>
            ) : (
              <div className="marker markerFalse"></div>
            )}
            <p>Bank Account Withdraw</p>
          </div>

          {/*Probably replace this image and or style differently*/}
          <img
            alt="google authentication"
            className="twoFactorImg"
            src="https://lh3.googleusercontent.com/HPc5gptPzRw3wFhJE1ZCnTqlvEvuVFBAsV9etfouOhdRbkp-zNtYTzKUmUVPERSZ_lAL=s180-rw"
          />

          <p>
            Use Google&apos;s Android or iPhone app for adding two token based
            two factor authentication.
          </p>

          <div>
            {/* The Device validation button is inside of the dropdown */}
            {/* Set this.state.isAddingDevice to false after adding the device */}
            <button
              onClick={this.handleAddDeviceClick}
              className="btn btn-warning twoFactorButton"
            >
              Add Device
            </button>
            {this.state.isAddingDevice ? (
              <div>
                <img alt="QR Code" src={qrcodeUrl} />
                <input
                  className="form-control bottomMarginSmall"
                  type="text"
                  id="device-name"
                  placeholder="Enter the name of your device"
                />
                <input
                  className="form-control bottomMarginSmall"
                  type="text"
                  id="token"
                  placeholder="Enter 6-digit code from Google Authenticator App"
                />

                <button onClick={this.handleTwoFactorCodeValidation}>
                  Validate
                </button>
              </div>
            ) : (
              <div className="bottomMarginSmall"></div>
            )}
          </div>

          <button
            onClick={this.handleRemoveTwoFactorDevice}
            className="btn btn-warning twoFactorButton"
          >
            Remove Device
          </button>
          {/* Input textbox for remove device*/}
          <input
            type="text"
            className="removeDeviceInput"
            id="remove-device-name"
            placeholder="Enter Device To Remove"
          />

          <h2>Registered Devices:</h2>
          {/*Registered devices*/}
          {devices}

          <br />
          {/*Placeholder QRCode*/}
        </div>
      </CollapseWithHeader>
    );
  }
}

class SecurityTab extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  // TODO: Finish Security Panel
  render() {
    return (
      <div>
        <SecurityRecommendationsPanel
          user={this.props.user}
          email={this.props.email}
        />
        <TwoFactorAuthenticationPanel
          user={this.props.user}
          email={this.props.email}
        />
      </div>
    );
  }
}


/*
 ***************************************************************************
 * The main Settings component starts here
 ***************************************************************************
 */
class Settings extends Component {

  client = '';
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

  constructor(props) {
    super(props);

    console.log(JSON.stringify(props));
    this.client = props.client;

    let name = `${props.user} @ Affordable Admin`

    this.state = {
      currentSection: "Account",
      twoFactor: this.props.twoFactor,
      username: this.props.user,
      email: this.props.email,
      imageURL: '',
      secret: speakeasy.generateSecret({ length: 20, issuer: 'Affordable Admin', name: name })
    };

    // Whenever the a section is clicked, switch to it
    this.changeSection = this.changeSection.bind(this);
    this.handleTwoFactorAdd = this.handleTwoFactorAdd.bind(this);
    this.handleTwoFactorRemove = this.handleTwoFactorRemove.bind(this);
  }

  componentDidMount() {
    this.createTwoFactorURL();
  }

  changeSection(e) {
    const selectedSection = e.target.innerHTML;

    // If a different section is chosen, we want to go to it
    if (selectedSection !== this.state.currentSection) {
      this.setState({
        currentSection: selectedSection
      });
    }
  }

  showAlertFail() {
    alert("Please Try Again");
  }

  handleTwoFactorAdd(ev) {
    ev.preventDefault();

    const token = document.getElementById("token").value;
    const device = document.getElementById("add-device-input").value;
    const timeStamp = Date.now().toString();
    const randomString = randomstring.generate();
    const secret = this.state.secret.base32;

    const data = new FormData();
    data.append("token", token);
    // var x = this.state.tempvar; //Math.floor((Math.random() * 1000) + 1);
    data.append("imageid", this.state.imageURL);
    data.append("secret", this.state.secret.base32);
    console.log("secret:", this.state.secret);

    // var x = this.state.tempvar; //Math.floor((Math.random() * 1000) + 1);
    console.log("secret:", this.state.secret);
    console.log(this.state.imageURL)

    this.client
      .twoFactor(token, this.state.imageURL, this.state.secret.base32)
      .then(response => {
        console.log(response);
        if (response.verified) {
          this.client.addTwoFactor(device, this.state.username, this.state.email, randomString, timeStamp, secret).then(resp => {
            swal("You have registered your device for Two Factor Authentication!")
            this.setState({twoFactor: true})
          }, resp => {
            console.log(resp);
            swal("Error setting up device for Two Factor Authentication, please try again later.")
          })
        } else {
          this.showAlertFail();
        }
      });
  }

  handleTwoFactorRemove() {
    
    // const data = new FormData();
    const token = document.getElementById("token").value;

    this.props.client
      .checkTwoFactorByAgainstUsername(this.state.username, token, "true")
      .then(res => {
        if (res.verified == true) {
          this.client.removeTwoFactor(this.state.username, this.state.email).then(resp => {
            swal("You have removed Two Factor Authentication from your account.")
            this.setState({twoFactor: false})
          }, resp => {
            console.log(resp);
            swal("Error setting up device for Two Factor Authentication, please try again later.")
          });
        }else {
          this.showAlertFail();
        }
      });
  }

  createTwoFactorURL() {
    QRCode.toDataURL(this.state.secret.otpauth_url, (err, imageData) => {
      this.setState({
        imageURL: imageData
      });
    });
  }

  render() {
    let accountSection = (
      <li onClick={this.changeSection} className="notSelectedStyle">
        Account
      </li>
    );
    let bankingInfoSection = (
      <li onClick={this.changeSection} id="bankingInfoTab" className="notSelectedStyle">
        Banking Information
      </li>
    );
    let MFAInfoSection = (
      <li onClick={this.changeSection} id="modifyMFATab" className="notSelectedStyle">
        Modify MFA
      </li>
    );

    // let securitySection = (
    //   <li
    //     onClick={this.changeSection}
    //     id="securityTab"
    //     className="notSelectedStyle"
    //   >
    //     Security
    //   </li>
    // );
    let sectionContent = null;
    if (this.state.currentSection === "Account") {
      accountSection = (
        <li onClick={this.changeSection} className="selectedStyle">
          Account
        </li>
      );
      sectionContent = (
        <div className="tabPadding">
          <AccountTab 
            user={this.state.username} 
            email={this.state.email} 
            client={this.props.client}
          />
        </div>
      );
       } else if (this.state.currentSection === "Banking Information") { /* INSERTED */
        bankingInfoSection = (
          <li onClick={this.changeSection} className="selectedStyle">
            Banking Information
          </li>
        );
        sectionContent = (
          <div className="tabPadding">
            <BankingInfoTab user={this.state.username}
                              usertype={this.state.usertype}
                              email={this.state.email}/>
          </div>
        );
      } else if (this.state.currentSection === "Modify MFA") {
        MFAInfoSection = (
          <li onClick={this.changeSection} className="selectedStyle">
            Modify MFA
          </li>
        );
        if (this.state.twoFactor) {
          sectionContent = (
            <div>
              <h3>Enter Code to Remove two Factor Authentication</h3>
              <ValidateTwoFactorComponent handleValidateTwoFactor={this.handleTwoFactorRemove} buttonText={'Remove Two Factor'} />
            </div>
          );
        } else {
          console.log(this.state.imageURL)
          sectionContent = (
            <div>
              <h3>Add Two Factor Authentication Here</h3>
              <AddTwoFactorComponent handleTwoFactorCodeValidation={this.handleTwoFactorAdd} imageURL={this.state.imageURL}/>
            </div>
          );
        }
        
      }
    
    
    // } else if (this.state.currentSection === "Security") {
    //   securitySection = (
    //     <li onClick={this.changeSection} className="selectedStyle">
    //       Security
    //     </li>
    //   );
      // sectionContent = (
      //   <div className="tabPadding">
      //     <SecurityTab user={this.state.username} email={this.state.email} />
      //   </div>
      // );
      // }

    return (
      <div className="col">
        <div>
          {/* Settings Menu Sections */}
          <div>
            <h1 className="headingStyle">{this.state.currentSection}</h1>
            <ul className="sectionBarStyle">
              {accountSection}
              {bankingInfoSection}
              {MFAInfoSection}
              {/* {securitySection} */}
            </ul>
          </div>
        </div>

        {/* The section content depends on the state of the component */}
        {sectionContent}
      </div>
    );
  }
}

export default Settings;
