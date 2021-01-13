import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect, Route } from "react-router-dom";
import JoinGroup from "../JoinGroup";
import AddOrganization from "../AddOrganization";
import VerifyOrganization from "../VerifyOrganization";
import Nav from 'react-bootstrap/Nav';
import "./scss/organization-pages-routing-container.scss";



const AffiliationNavBar = (props) => {
  return (
    <Nav className="row text-center mt-3">
      <Nav.Item className="col">
        <LinkContainer to="/affiliation/joingroup">
          <Nav.Link>Join Group</Nav.Link>
        </LinkContainer>
      </Nav.Item>

       <Nav.Item className="col">
        <LinkContainer to="/affiliation/addorganization">
          <Nav.Link>Add Organization</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item className="col">
        <LinkContainer to="/affiliation/verifyorganization">
          <Nav.Link>Verify Organization</Nav.Link>
        </LinkContainer>
      </Nav.Item>

    </Nav>
  );
};

const Affiliation = ({ match }) => {
  return (
    <div className="col">
      {/*for social media buttons on congratulations page*/}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      {/* Apply Header*/}
      <div className="row mt-3 pl-4">
        <h1>Apply</h1>
      </div>

      {/* Affiliation Navbar */}
      <AffiliationNavBar />
      <hr className="nav" />

      {/* Main Content */}
      <div className="row">

        <Route path={`${match.url}/joingroup`} component={JoinGroup} />
        <Route path={`${match.url}/addorganization`} component={AddOrganization} />
        <Route path={`${match.url}/verifyorganization`} component={VerifyOrganization} />
        <Route exact path={match.url} render={props => <Redirect to={`${match.url}/joingroup`} />} />
      </div>
    </div>
  );
};

export default Affiliation;
