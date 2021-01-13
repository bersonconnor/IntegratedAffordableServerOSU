import React, {Component} from "react";
import HugCreation from "./HugCreation";
import "./scss/donorHUG-pages-routing-container.scss";

class HUGPagesRoutingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "main",
      usertype: "unknown",
      headerTitle: "HUG Purpose"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /*Handle Event Functions*/
  handleChange = (key) => {
      return (event) => {
          this.setState({ [key]: event.target.value });
      };
  };
  // this is for the different pages of the form: Purpose, eligibility, information, fundraising
  changeHeader(headerTitleGiven){
    console.log(headerTitleGiven);
    this.setState({ headerTitle: headerTitleGiven});
  }

render() {
  return (
    <div className="col">
      {/*for social media buttons on congratulations page*/}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      {/* Apply Header*/}
      <div className="row mt-3 pl-4">
        <h1>{this.state.headerTitle}</h1>
      </div>

      <hr className="nav" />

      {/* Main Content */}
      <div className="row">
        <HugCreation changeHeader= {this.changeHeader.bind(this)}/>
      </div>
    </div>
  );
}
}
export default HUGPagesRoutingContainer;
