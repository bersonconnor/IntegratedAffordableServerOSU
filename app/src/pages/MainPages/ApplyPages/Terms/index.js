import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import PDFViewer from "../../../../components/PDFViewer/PDFViewer";
import PDFJSBackend from "../../../../components/PDFViewer/back-ends/pdfjs";
import CollapseWithHeader from "../../../../components/CollapseWithHeader";
import "../../../../styles/buttons.css";
import "./scss/terms.scss";

const TandCRow = ({ terms, agree }) => {
  return (
    <tr>
      <td className="p-3" width="80%">
        {terms}
      </td>
      <td className="text-center align-middle" width="20%">
        {agree ? "Agree" : <input type="radio" />}
      </td>
    </tr>
  );
};

class Terms extends Component {
  render() {
    return (
      <div className="col">
        {/* AFFORDABLE terms and documentations component */}
        <CollapseWithHeader title="AFFORDABLE Terms and Conditions" open={true}>
          <table className="table table-bordered terms-and-conditions-row">
            <tbody>
              <TandCRow
                agree={true}
                terms="Please read the following closely and agree to the terms and conditions for use of the AFFORDABLE system listed below:"
              />
              <TandCRow terms="I verify that all of my information is current and has not been falsified. Evidence of fraud will lead to disqualification of all applications and temporary ban on AFFORDABLE" />
              <TandCRow terms="I understand that the submission of these applications does not guarantee that any funds or support will be awarded to you by any organization in AFFORDABLE" />
              <TandCRow terms="I understand and accept that I will be held to the standards listed in the terms and conditions of the affiliated organizations which you are applying" />
            </tbody>
          </table>
        </CollapseWithHeader>

        {/* organization agreements */}
        <CollapseWithHeader title="Organization Agreements" open={true}>
          <table className="table table-bordered terms-and-conditions-row">
            <tbody>
              <TandCRow
                agree={true}
                terms="Please read the following closely and agree to the terms and conditions for use of the AFFORDABLE system listed below:"
              />
              <TandCRow
                terms={
                  <PDFViewer
                    backend={PDFJSBackend}
                    src="/AFFORDABLE-USER-CONTRACT.pdf"
                  />
                }
              />
            </tbody>
          </table>
        </CollapseWithHeader>

        {/* previous and next buttons */}
        <div className="row">
          <div className="col text-left">
            <LinkContainer to="/apply/supplemental">
              <a href="/apply/supplemental" className="prev_next">
                previous
              </a>
            </LinkContainer>
          </div>
          <div className="col text-right">
            <LinkContainer to="/apply/finalize">
              <a href="/apply/finalize" className="prev_next">
                next
              </a>
            </LinkContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
