import React, { Component } from "react";
import Collapse from "react-bootstrap/Collapse";
import "../styles/collapse-with-header.css";
class CollapseWithHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open
    };
  }

  render() {
    const { title, children } = this.props;
    const { open } = this.state;
    const arrowDirection = open ? "arrow down" : "arrow right";

    return (
      <div className="row mt-5">
        <div className="col mx-5">
          {/* Heading */}
          <div
            className="row collapse-header py-3"
            onClick={() =>
              this.setState({
                open: !open
              })
            }
            aria-controls={title}
            aria-expanded={open}
          >
            <div className="col-1 text-center">
              <i className={arrowDirection} />
            </div>
            <div className="col px-0">
              <h2 className="mb-0">
                <b>{title}</b>
              </h2>
            </div>
          </div>

          {/* Content */}
          <Collapse in={open}>
            <div id={title} className="row">
              <div id={title} className="col">
                {children}
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default CollapseWithHeader;
