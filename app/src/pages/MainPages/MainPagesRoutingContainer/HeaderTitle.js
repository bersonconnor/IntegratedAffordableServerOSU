import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// Create your own sass file :D

class HeaderTitle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let pageName = "";
    const location = window.location.pathname;
    if (
      location.includes("affiliation") ||
      location.includes("organization") ||
      location.includes("manager")
    ) {
      pageName = "Organization Center";
    } else if (location.includes("application")) {
      pageName = "Application Center";
    } else if (location.includes("hug")) {
      pageName = "HUG Center";
    } else if (location.includes("search")) {
      pageName = "HUG Search";
    } else if (location.includes("manage")) {
      pageName = "HUG Manager";
    } else if (location.includes("dashboard")) {
      pageName = "Dashboard";
    } else if (location.includes("settings")) {
      pageName = "Settings";
    } else if (location.includes("profile")) {
      pageName = "Profile";
    } else if (location.includes("support")) {
      pageName = "Support";
    } else if (location.includes("mdm")) {
      pageName = "Medical Debt Marketplace";
    }
    return (
      <div className="col">
        <h1 className="main-header">{pageName}</h1>
      </div>
    );
  }
}

export default HeaderTitle;
