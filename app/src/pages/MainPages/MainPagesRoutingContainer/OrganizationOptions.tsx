import React, {Component} from "react";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import {LinkContainer} from "react-router-bootstrap";

import "./scss/sidebar.scss";

class OrganizationOptionsProps {
  userId: number;
  openApp?: any;
  openOrg?: any;
}

class OrganizationOptionsState {
  openApp?: any;
  openOrg?: any;
}

class OrganizationOptions extends Component<
  OrganizationOptionsProps,
  OrganizationOptionsState
> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      openApp: this.props.openApp,
      openOrg: this.props.openOrg
    };
  }

  render() {
    const { openOrg } = this.state;
    const organizationPaths = [
      /\/affiliation*/,
      /\/manager*/,
      /\/services*/,
      /\/analytics*/
    ];
    const organizationIsActive = organizationPaths.reduce((truth, curr) => {
      return curr.test(window.location.pathname) || truth;
    }, false);

    return (
      <div>
        <LinkContainer to="/affiliation">
          <Nav.Link
            onClick={() =>
              this.setState({
                openOrg: !openOrg
              })
            }
            aria-controls="organization-navigation"
            aria-expanded={openOrg}
            className={organizationIsActive ? "active" : ""}
          >
            Organizations
          </Nav.Link>
        </LinkContainer>
        <Collapse in={this.state.openOrg} key="organization-navigation">
          <div id="organization-navigation">
            <div className="row">
              <div className="col-2"></div>
              <div className="col">
                <Nav
                  className="flex-column"
                  activeKey={window.location.pathname}
                >
                  <LinkContainer to="/affiliation">
                    <Nav.Link>Affiliation</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/manager">
                    <Nav.Link>Manager</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/services">
                    <Nav.Link>Services</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/analytics">
                    <Nav.Link>Analytics</Nav.Link>
                  </LinkContainer>
                </Nav>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

export default OrganizationOptions;
