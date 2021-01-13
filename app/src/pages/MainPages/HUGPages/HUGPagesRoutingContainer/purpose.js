import React, { Component, Fragment } from "react";
import DiagnosisAutosuggest from "./DiagnosisAutosuggest";
import PrescriptionAutosuggest from "./PrescriptionAutosuggest";
import "../../../../styles/buttons.css";
import "./scss/purpose.scss";
import "react-table/react-table.css";

const FormGroup = ({ labelName, value, handleChange }) => {
  return (
    <div className="form-group row">
      <div className="col-1" />
      <label
        htmlFor={labelName.replace(/\s+/g, "-")}
        className="col-2 col-form-label"
      >
        {labelName}
      </label>
      <div className="col-8">
        <input
          type="text"
          className="form-control"
          id={labelName.replace(/\s+/g, "-")}
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="col-1" />
    </div>
  );
};



class Purpose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diagnosisNeeded: [
        {
          name: ""
        }
      ],
      prescriptionNeeded: [
        {
          name: ""
        }
      ],
      hugName: "",            // name of the HUG
      hugCat: "",             // HUG Category
      medCat: "",             // medical category
      specialtyCare: "",      //specialty care, only filled out if specialty care was selected for med cat
      purpose: "",            // purpose of the HUG
      hasPrescriptions: "",   // are the prescriptions associated with this hug
      hasDiagnosis: ""        // are there certain diagnosises associated with this hug
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDiagnosisChange = this.handleDiagnosisChange.bind(this);
    this.handlePrescriptionChange = this.handlePrescriptionChange.bind(this);
    this.saveDiagnosis = this.saveDiagnosis.bind(this);
    this.savePrescription = this.savePrescription.bind(this);
  }

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };
  // called when the add diagnosis button is pressed, create  a new map entry
  addDiagnosis = e => {
    this.setState(prevState => ({
      diagnosisNeeded: [...prevState.diagnosisNeeded, { name: "" }]
    }));
    console.log("after add diagnosis", this.state.diagnosisNeeded);
  };

  // clear all of the Diagnoses if the delete button is pressed
  deleteDiagnosis = e => {
    this.setState({ diagnosisNeeded: [] });
  };
// clear all of the prescriptions if the delete button is pressed
  deletePrescription = e => {
    this.setState({ prescriptionNeeded: [] });
  };
  // each time a new character is added to a diagnosis field
  handleDiagnosisChange = index => key => {
    const { diagnosisNeeded } = this.state;
    console.log(this.state.diagnosisNeeded);

    return event => {
      diagnosisNeeded[index][key] = event.target.value;
      this.setState({ diagnosisNeeded });
    };
  };
  // call back function for the diagnosis autosuggest
  saveDiagnosis(index, diagnosisName) {
    const { diagnosisNeeded } = this.state;
    console.log("in function");
    diagnosisNeeded[index]["name"] = diagnosisName;
    this.setState({ diagnosisNeeded });
    console.log("after add diagnosis", this.state.diagnosisNeeded);
  }
 // callback function for the prescription autosuggest
  savePrescription(index, prescriptionName) {
    const { prescriptionNeeded } = this.state;
    console.log("in function");
    prescriptionNeeded[index]["name"] = prescriptionName;
    this.setState({ prescriptionNeeded });
    console.log("after add prescription", this.state.prescriptionNeeded);
  }
  // everytime add prescription is clicked, add a new map entry
  addPrescription = e => {
    this.setState(prevState => ({
      prescriptionNeeded: [...prevState.prescriptionNeeded, { name: "" }]
    }));
    console.log("after add prescription", this.state.prescriptionNeeded);
  };
  // when a new prescription character is entered
  handlePrescriptionChange = index => key => {
    const { prescriptionNeeded } = this.state;
    console.log(this.state.prescriptionNeeded);

    return event => {
      prescriptionNeeded[index][key] = event.target.value;
      this.setState({ prescriptionNeeded });
    };
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleReturnInfo = () => {
    return this.state;
  };
  componentDidMount() {
    if (!window.location.hash) {
      //setting window location
      window.location.assign(window.location + "#loaded");
      //using reload() method to reload web page
      // window.location.reload();
    }
  }

  render() {
    const { diagnosisNeeded } = this.state;
    const { prescriptionNeeded } = this.state;
    if (this.props.currentStep !== 1) {
      // Prop: The current step
      return null;
    }
    const medicalCatNames = [
      "Primary Care",
      "UrgentCare",
      "Geriatric/Nursing",
      "Mental/Psychiatric",
      "Dental Care",
      "Laboratory and Diagnostic Care",
      "Substance Abuse Rehabilitation",
      "Optometry",
      "Preventative Care",
      "Physical and Occupational Therapy",
      "Nutritionist",
      "Prenatal Care",
      "Specialty Care"
    ];
    const medicalList = medicalCatNames.map(function(medName) {
      return (
        <option id={medName} value={medName}>
          {medName}
        </option>
      );
    });
    const specialtyNames = [
      "Allergy & Asthma",
      "Anesthesiology",
      "Dermatology",
      "Endocrinology",
      "Gastroenterology",
      "General Surgery",
      "Hematology",
      "Immunology",
      "Infectious Disease",
      "Nephrology",
      "Neurology",
      "OB/GYN",
      "Oncology",
      "Ophthalmology",
      "Orthopedics",
      "Otorhinolaryngology",
      "Physical Therapy + Rehabilitiatice Medicine",
      "Psychiatry",
      "Pulmonary",
      "Radiology",
      "Rheumatology",
      "Urology",
      "Other"
    ];
    const specialtyList = specialtyNames.map(function(specName) {
      return <option value={specName}>{specName}</option>;
    });
    return (
      <div className="col">
        <div className="row mt-5">
          <div className="col">
            <FormGroup
              labelName="Name"
              value={this.state.hugName}
              handleChange={this.handleChange("hugName")}
            />

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="HUG Category" className="col-2 col-form-label">
                Hug Category
              </label>
              <div className="col">
                <select
                  id="hugCat"
                  value={this.state.hugCat}
                  className="form-control"
                  onChange={this.handleChange("hugCat")}
                >
                  <option value="" disabled selected>
                    Select category...
                  </option>
                  <option value="Medical Care">Medical Care</option>
                  <option value="Prescriptions">Prescriptions</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Transportation">Transportation</option>
                </select>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label
                htmlFor="Medical Category"
                className="col-2 col-form-label"
              >
                Medical Category
              </label>
              <div className="col">
                <select
                  id="medCat"
                  value={this.state.medCat}
                  className="form-control"
                  onChange={this.handleChange("medCat")}
                >
                  <option value="" disabled selected>
                    Select category...
                  </option>
                  {medicalList}
                </select>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Specialty Care" className="col-2 col-form-label">
                Specialty Care
              </label>
              <div className="col">
                <select
                  id="specialtyCare"
                  value={this.state.specialtyVare}
                  className="form-control"
                  onChange={this.handleChange("specialtyCare")}
                  disabled={this.state.medCat != "Specialty Care"}
                >
                  <option value="" disabled selected>
                    Select category...
                  </option>
                  {specialtyList}
                </select>
              </div>
              <div className="col-1" />
            </div>

            <FormGroup
              labelName="Purpose"
              value={this.state.purpose}
              handleChange={this.handleChange("purpose")}
            />

            <div className="form-group row">
              <div className="col-1" />

              <label htmlFor="Services" className="col-2 col-form-label" />
              <div className="col-8">
                Is HUG for a specific illness?
                <ul>
                  <li>
                    <label>
                      <input
                        type="radio"
                        id="yesDiagnosis"
                        value="1"
                        checked={this.state.hasDiagnosis === "1"}
                        onChange={this.handleChange("hasDiagnosis")}
                      />
                      Yes
                    </label>
                  </li>

                  <li>
                    <label>
                      <input
                        type="radio"
                        id="noDiagnosis"
                        value="0"
                        checked={this.state.hasDiagnosis === "0"}
                        onChange={this.handleChange("hasDiagnosis")}
                      />
                      No
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            {this.state.hasDiagnosis === "1" && [
              <div>
                {diagnosisNeeded.map((item, index) => {
                  return (
                    <div>
                      <div className="form-group row">
                        <div className="col-1" />
                        <label
                          htmlFor="Diagnosis"
                          className="col-2 col-form-label"
                        >
                          Diagnosis
                        </label>
                        <div key={index} value={this.state.diagnosisNeeded[index].name} className="col-8">
                          <DiagnosisAutosuggest
                            onChange={this.handleDiagnosisChange(index)}
                            value = {this.state.diagnosisNeeded[index].name}
                            index = {index}
                            saveFunction={this.saveDiagnosis.bind(this)}
                          />
                        </div>
                        <div className="col-1" />
                      </div>
                    </div>
                  );
                })}
                <div className="form-group row">
                  <div className="col-4" />
                  <input
                    type="submit"
                    onClick={this.addDiagnosis}
                    value="Add Diagnosis"
                    className="submit-button"
                  />
                  <input
                    type="submit"
                    onClick={this.deleteDiagnosis}
                    value="Delete Diagnoses"
                    className="submit-button"
                  />
                </div>
              </div>
            ]}

            <div className="form-group row">
              <div className="col-1" />

              <label
                htmlFor="hasPrescriptions"
                className="col-2 col-form-label"
              />
              <div className="col-8">
                Is HUG specific prescriptions?
                <ul>
                  <li>
                    <label>
                      <input
                        id="hugPrescript"
                        type="radio"
                        value="1"
                        checked={this.state.hasPrescriptions === "1"}
                        onChange={this.handleChange("hasPrescriptions")}
                      />
                      Yes
                    </label>
                  </li>

                  <li>
                    <label>
                      <input
                        id="noHugPrescript"
                        name="noPrescription"
                        type="radio"
                        value="0"
                        checked={this.state.hasPrescriptions === "0"}
                        onChange={this.handleChange("hasPrescriptions")}
                      />
                      No
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            {this.state.hasPrescriptions === "1" && [
              <div>
                {prescriptionNeeded.map((item, index) => {
                  return (
                    <div key={index}>
                    <div className="form-group row">
                      <div className="col-1" />
                      <label htmlFor="Prescription" className="col-2 col-form-label">
                        Prescription
                      </label>
                      <div value={this.state.prescriptionNeeded[index].name} className="col-8">
                        <PrescriptionAutosuggest
                        onChange={this.handlePrescriptionChange(index)}
                        value = {this.state.prescriptionNeeded[index].name}
                        index = {index}
                        saveFunction={this.savePrescription.bind(this)}/>
                      </div>
                      <div className="col-1" />
                    </div>
                    </div>
                  );
                })}
                <div className="form-group row">
                  <div className="col-6" />
                  <input
                    type="submit"
                    onClick={this.addPrescription}
                    value="Add Prescription"
                    className="submit-button"
                  />
                  <input
                    type="submit"
                    onClick={this.deletePrescription}
                    value="Delete Prescriptions"
                    className="submit-button"
                  />
                </div>
              </div>
            ]}
          </div>
        </div>
        <div className="form-group row">
          <div className="col-10" />
          <input
            type="submit"
            id="nextButton"
            onClick={() => {
              this.props.nextFunction(this.state);
            }}
            value="Next"
            className="submit-button"
          />
        </div>
      </div>
    );
  }
}
export default Purpose;
