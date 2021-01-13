import React, { Component } from "react";
import swal from "sweetalert";
import Dropdown from "react-bootstrap/Dropdown";
import { LinkContainer } from "react-router-bootstrap";
import { AffordableClient, AffordableHttpError } from "affordable-client";
import { withRouter } from "react-router-dom";
import Banner from 'react-js-banner';
import HeaderTitle from "./HeaderTitle";
import "./scss/main-header.scss";

class MainHeader extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;

  constructor(props) {
    super(props);
    
    this.state = {
      // Ex: 15 (mins) * 60 (seconds) * 1 (second) = 900 seconds
      MAX_TIME_INACTIVE: 15 * 60 * 1,
      verified: true,
      timerId: null,
      // In seconds
      timeInactive: 0,
      prevMouseX: 0,
      prevMouseY: 0,
      mouseTrackerCallback: function(event) {
        window.mouseX = event.clientX;
        window.mouseY = event.clientY;
      }
    };

    this.timer = this.timer.bind(this);
    this.deleteFakeHugs = this.deleteFakeHugs.bind(this);
    this.deleteFakeOrganizations = this.deleteFakeOrganizations.bind(this);
  }

  //function for DEVELOPMENT PURPOSES only
  deleteFakeHugs = async () => {
    await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/deleteFakeHugs", {
      method: "POST"
    }).then(response => {
      if (response.ok) console.log("Deleted fake hugs");
    });
  };

  deleteFakeOrganizations = async() => {
    await fetch(this.REACT_APP_AF_BACKEND_URL + '/joinGroup/deleteFakeOrgs', {
        method: "POST"
    }).then(response => {
        if(response.ok)
            console.log('Deleted from representOrganization')
    })
};

  componentDidMount() {
    this.props.client.getEmailVer()
      .then(
        (response) => {
          // response comes back as undefined occasionally with undefined 'id'. Temp fix
          if(response != undefined) {
            this.setState({verified: response.isVerified}) 
            if(!this.state.verified){
              swal(
                "Unverified Email",
                "Please check your inbox for a confirmation email. Please click the provided link to verify your email address.",
                "warning"
              );
            }
          }
        }

      )
    // When the component mounts we want to start a timer that keeps track of user activity
    this.setState({
      // The timer will check for changes each second
      timerId: setInterval(this.timer, 1000)
    });

    // Attach a listener to the root of the app so that we can keep track of the mouse position
    document
      .getElementById("root")
      .addEventListener("mousemove", this.state.mouseTrackerCallback, true);
  }

  componentWillUnmount() {
    this.deleteFakeHugs();
    this.deleteFakeOrganizations();
    // Clean up timer thread
    clearInterval(this.state.timerId);

    // Clean up event listener on root of app
    document
      .getElementById("root")
      .removeEventListener("mousemove", this.mouseTrackerCallback, true);
  }

  timer() {
    if (window.mouseX === undefined || window.mouseY === undefined) {
      window.mouseX = 0;
      window.mouseY = 0;
    }

    // This gets called each second
    const curMouseX = window.mouseX;
    const curMouseY = window.mouseY;

    if (
      this.state.prevMouseX === curMouseX &&
      this.state.prevMouseY === curMouseY
    ) {
      // The user has not moved, we should increment the time Inactive
      // And if the max time limit has been reached we should log the user out, and redirect to the login page
      // Maybe show an alert as well when the user has been automatically logged out
      if (this.state.timeInactive >= this.state.MAX_TIME_INACTIVE) {
        this.deleteFakeHugs();
        this.deleteFakeOrganizations();
        // Logout the account
        this.props.userHasAuthenticated(null);

        // Redirect to the login page
        this.props.history.push("/login");

        // Alert
        swal("Logged out", "You have been automatically logged out due to inactivity.", "error");
        //alert("You have been automatically logged out due to inactivity.");
      }

      this.setState({
        timeInactive: this.state.timeInactive + 1
      });
    } else {
      // The user moved, we should reset the timeInactive
      // We should also update the previous mouse X and Y positions because they changed
      this.setState({
        timeInactive: 0,
        prevMouseX: curMouseX,
        prevMouseY: curMouseY
      });
    }
  }

  render() {
    return (
      <div className="row py-3 main-header">
        <div className="col text-right">
          {!this.state.verified? <Banner title={"Please click the link in your confirmation email to confirm your email address."}/>:""}
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {this.props.user}
            </Dropdown.Toggle>
            <HeaderTitle />
            <Dropdown.Menu>
              <LinkContainer to="/login">
                <Dropdown.Item
                  onClick={() => this.props.userHasAuthenticated(null)}
                >
                  Sign Out
                </Dropdown.Item>
              </LinkContainer>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default withRouter(MainHeader);
