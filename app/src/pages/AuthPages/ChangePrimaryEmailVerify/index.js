import React, { Component } from "react";
import queryString from "query-string";

class ChangePrimaryEmailVerify extends Component {

  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      newEmail: "",
      oldEmail: "",
      randomString: "",
      timestamp: ""
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange() {
    const tenMinutes = 1000000;
    if (Date.now() - this.state.timestamp < tenMinutes) {
      const newEmail = this.state.newEmail;
      const oldEmail = this.state.oldEmail;

      const data = new FormData();
      data.append("newEmail", newEmail);
      data.append("oldEmail", oldEmail);

      fetch(this.REACT_APP_AF_BACKEND_URL +"/profile/update-email", {
        method: "POST",
        body: data
      }).then(response => {
        if (response.ok)
          return response.json().then(resData => {
            alert(resData.success);
          });
        else {
          alert("unable to change email");
        }
      });
    } else {
      const data2 = new FormData();
      data2.append("randomstring", this.state.randomString);
      fetch(this.REACT_APP_AF_BACKEND_URL + "/profile/remove-request", {
        method: "POST",
        body: data2
      }).then(response => {
        if (response.ok)
          return response.json().then(() => {
            alert("Secret string expired");
          });
      });
    }
  }

  componentDidMount() {
    const decodedURL = decodeURIComponent(this.props.location.search);
    const values = queryString.parse(decodedURL);
    const randomString = values.temp;
    console.log("string: " + randomString);

    const rdata = new FormData();
    rdata.append("randomString", randomString);

    const that = this;
    fetch(this.REACT_APP_AF_BACKEND_URL + "/profile/get-request", {
      method: "POST",
      body: rdata
    }).then(response => {
      console.log(response);
      if (response.ok)
        return response.json().then(resData => {
          if (resData.RandomString === randomString) {
            that.setState({
              username: resData.Username,
              newEmail: resData.NewEmail,
              oldEmail: resData.OldEmail,
              randomString: resData.RandomString,
              timestamp: resData.Timestamp
            });
            that.handleEmailChange();
          }
        });
      else {
        alert("unable to change email");
      }
    });
  }

  render() {
    return (
      <div className="row mt-5">
        <div className="col">
          <div className="row">
            <div className="col text-center">
              <h1>Your New Email has been Verified!</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePrimaryEmailVerify;
