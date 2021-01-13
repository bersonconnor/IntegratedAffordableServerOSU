import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import { LinkContainer } from "react-router-bootstrap";
import "./scss/sidebar.scss";

class HUGOptions extends Component<{}, {}> {
  constructor(props, context) {
    super(props, context);

    // Note: I don't think this component actually does much yet.
    // The state was stored within itself before I got here, so I'm just confused.
    // Only one prop was accessed, but no component actually used the prop.
  }

  render() {
    const HUGPaths = [/\/search*/, /\/hug*/, /\/manage*/, /\/analytics*/];
    const HUGIsActive = HUGPaths.reduce((truth, curr) => {
      return curr.test(window.location.pathname) || truth;
    }, false);

    return (
      <div>
        <LinkContainer to="/hug">
          <Nav.Link
            onClick={() => console.log("HUGOptions navlink clicked")}
            aria-controls="HUG-navigation"
            // aria-expanded={open_HUG}
            className={HUGIsActive ? "active" : ""}
          >
            {">"} Health Utilizing Grants
          </Nav.Link>
        </LinkContainer>
        {/*<Collapse in={this.state.open_HUG} id="HUG-navigation">*/}
        <div id="HUG-navigation">
          <div className="row">
            <div className="col-2"></div>
            <div className="col">
              <Nav className="flex-column" activeKey={window.location.pathname}>
                <LinkContainer to="/search">
                  <Nav.Link>Search</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/hug">
                  <Nav.Link>Create</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/manage">
                  <Nav.Link>Manage</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/analytics">
                  <Nav.Link>Analytics</Nav.Link>
                </LinkContainer>
              </Nav>
            </div>
          </div>
        </div>
        {/*</Collapse>*/}
      </div>
    );
  }
}

export default HUGOptions;
