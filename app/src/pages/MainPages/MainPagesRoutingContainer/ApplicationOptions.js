import React, {Component} from "react";
import Nav from "react-bootstrap/Nav";
import Collapse from "react-bootstrap/Collapse";
import {LinkContainer} from "react-router-bootstrap";
import "./scss/sidebar.scss";

class ApplicationOptions extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open_app: this.props.open_app
    };
  }

  render() {
    const { open_app } = this.state;
    const appCenterPaths = [
      /\/manager*/,
      /\/apply*/,
      /\/message*/,
      /\/search*/
    ];
    const appCenterIsActive = appCenterPaths.reduce((truth, curr) => {
      return curr.test(window.location.pathname) || truth;
    }, false);

    return (
      <div>
        {/* <LinkContainer to="/application">
          <Nav.Link
            onClick={() =>
              this.setState({
                open_app: !open_app
              })
            }
            aria-controls="app-center-navigation"
            aria-expanded={open_app}
            className={appCenterIsActive ? "active" : ""}
          >
            Application Center
          </Nav.Link>
        </LinkContainer> */}
        {/* <Collapse in={this.state.open_app} id="app-center-navigation">
          <div id="app-center-navigation">
            <div className="row">
              <div className="col-2"></div>
              <div className="col">
                <Nav
                  className="flex-column"
                  activeKey={window.location.pathname}
                > */}
                  <LinkContainer to="/apply">
                    <Nav.Link>Apply</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/search">
                    <Nav.Link>Search</Nav.Link>
                  </LinkContainer>
                {/* </Nav>
              </div>
            </div>
          </div>
        </Collapse> */}
      </div>
    );
  }
}

export default ApplicationOptions;
