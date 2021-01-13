import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import ApplyTable from "../../../../components/ApplyTable";
import CollapseWithHeader from "../../../../components/CollapseWithHeader";
import "../../../../styles/buttons.css";
import "./scss/supplemental.scss";

const SupplementalQuestion = ({ charityName, question }) => {
  return (
    <div className="row">
      <div className="col">
        <div className="row p-3 question-header">
          <h3>{charityName}</h3>
        </div>

        <div className="row px-3 py-2 question">
          <h4>{question}</h4>
        </div>

        <div className="row">
          <textarea className="form-control" rows="3" />
        </div>
      </div>
    </div>
  );
};

class Supplemental extends Component {
  render() {
    const requiredDocumentationHeaderRow = [
      "Upload",
      "Status",
      "Document",
      "File Name",
      "Upload Date"
    ];
    return (
      <div className="col">
        <CollapseWithHeader title="Required Documentation" open={true}>
          <ApplyTable headerRow={requiredDocumentationHeaderRow} />
        </CollapseWithHeader>

        <CollapseWithHeader title="Supplemental Questions" open={true}>
          {[...Array(5).keys()].map(curr => {
            return (
              <SupplementalQuestion
                key={`sup-question-${curr}`}
                charityName={`Test-${curr}`}
                question={`Test-${curr}`}
              />
            );
          })}
        </CollapseWithHeader>

        {/* previous, save, and next buttons */}
        <div className="row">
          <div className="col text-left">
            <LinkContainer to="/apply/selection">
              <a className="prev_next">previous</a>
            </LinkContainer>
          </div>
          <div className="col text-center">
            <a className="save-button">save</a>
            {/* this needs to save supplemental info */}
          </div>
          <div className="col text-right">
            <LinkContainer to="/apply/terms">
              <a href="/apply/terms" className="prev_next">
                next
              </a>
            </LinkContainer>
          </div>
        </div>
      </div>
    );
  }
}
export default Supplemental;
