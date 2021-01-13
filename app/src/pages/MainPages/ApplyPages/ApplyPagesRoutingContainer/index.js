import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect, Route } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Selection from "../Selection";
import Supplemental from "../Supplemental";
import Terms from "../Terms";
import Finalize from "../Finalize";
import Congratulations from "../Congratulations";
import "./scss/apply-pages-routing-container.scss";

const ApplyNavBar = () => {
  return (
    <Nav className="row text-center mt-3">
      <Nav.Item className="col">
        <LinkContainer to="/apply/selection">
          <Nav.Link>Selection</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item className="col">
        <LinkContainer to="/apply/supplemental">
          <Nav.Link>Supplemental</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item className="col">
        <LinkContainer to="/apply/terms">
          <Nav.Link>Terms</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item className="col">
        <LinkContainer to="/apply/finalize">
          <Nav.Link>Finalize</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
};

const ApplyPagesRoutingContainer = ({ match }) => {
  return (
    <div className="col">
      {/*for social media buttons on congratulations page*/}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      {/* Apply Header*/}
      <div className="row mt-3 pl-4">
        <h1>Apply</h1>
      </div>

      {/* Apply Navbar */}
      <ApplyNavBar />
      <hr className="nav" />

      {/* Main Content */}
      <div className="row">
        <Route path={`${match.url}/supplemental`} component={Supplemental} />
        <Route path={`${match.url}/terms`} component={Terms} />
        <Route path={`${match.url}/finalize`} component={Finalize} />
        <Route path={`${match.url}/selection`} component={Selection} />
        <Route
          path={`${match.url}/congratulations`}
          component={Congratulations}
        />
        <Route
          exact
          path={match.url}
          render={() => <Redirect to={`${match.url}/selection`} />}
        />
      </div>
    </div>
  );
};

export default ApplyPagesRoutingContainer;
