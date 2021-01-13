import React, { Component } from "react";
import Popup from "reactjs-popup";
import { LinkContainer } from "react-router-bootstrap";
import ApplyTable from "../../../../components/ApplyTable";
import CollapseWithHeader from "../../../../components/CollapseWithHeader";
import "../../../../styles/buttons.css";
import "./scss/finalize.scss";

const Modal = () => {
  return (
    <Popup
      trigger={<button className="submit-button"> submit</button>}
      modal={true}
    >
      {/* modal needs to be centered and smaller */}
      <div className="row">
        <div className="col text-center">
          <h2>Finalize Submissions?</h2>
          <LinkContainer to="/apply/congratulations">
            <button className="submit-button">submit</button>
          </LinkContainer>
          {/* this needs to submit applications */}
          <button className="cancel">cancel</button>
          {/* this needs to close the modal window */}
        </div>
      </div>
    </Popup>
  );
};

class Finalize extends Component {
  render() {
    const applicationListHeaderRow = [
      "Remove",
      "Program",
      "Description",
      "Charity",
      "Deadline",
      "Aid/Service",
      "Supplemental"
    ];

    return (
      <div className="col">
        {/* application list here */}
        <CollapseWithHeader title="Application List" open={true}>
          <ApplyTable headerRow={applicationListHeaderRow} />
        </CollapseWithHeader>

        {/* submit button */}
        <div className="row">
          <div className="col text-center">
            <Modal />
          </div>
        </div>

        {/* submit warning */}
        <div className="row">
          <div className="col text-center">
            <h2 className="submit-warning">you will not be able to edit</h2>
            <h2 className="submit-warning">
              your application after submission
            </h2>
          </div>
        </div>

        {/* previous button */}
        <div className="row">
          <div className="col text-left">
            <LinkContainer to="/apply/terms">
              <a className="prev_next">previous</a>
            </LinkContainer>
          </div>
        </div>
      </div>
    );
  }
}
export default Finalize;
