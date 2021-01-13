import React, { Component, Fragment } from "react";
import "../../../../styles/buttons.css";
import './scss/information.scss';
import 'react-table/react-table.css';
import { UserIDContext } from "../../MainPagesRoutingContainer/index.tsx";
import swal from "sweetalert";

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
// To dynamically create the input fields for adding identifiable documents
const DocumentFormGroup = ({
                               name,
                               handleChange,
                               key
                           }) => {
    console.log({ key });
    return (
        <Fragment>
            <FormGroup
                labelName="Document"
                value={name}
                handleChange={handleChange("name")}
            />
        </Fragment>
    );
};

// To dynamically create the input fields for adding medical documents
const InformationFormGroup = ({
                                  name,
                                  handleChange,
                                  key
                              }) => {
    console.log({ key });
    return (
        <Fragment>
            <FormGroup
                labelName="Document"
                value={name}
                handleChange={handleChange("name")}
            />
        </Fragment>
    );
};


class Information extends Component {

    constructor(props) {
        super(props);
        this.state = {
            documentsNeeded: [],     //holds the user input fields for documents
            informationNeeded: [],   //holds the user input fields for information
            documentsSelected:[],    //to hold the radio buttons that are selected for the documents
            informationSelected:[],  //to hold the radio buttons that are selected for the information
            candidateSelection: '',  //boolean of whether they want to select the candidate
            documentationNeeded: '', //boolean of whether they require documentation
            medicalInfoNeeded:'',    //boolean of whether they require medical info
            shouldHide: true,
            documents: ['Social Security Card', 'Birth Certiciate', 'Passport', 'Tax Return', 'Residency Card',
                'Drivers License','Health Insurance Card', 'Veterans ID Card', 'DD Form 214', 'DD Form 256', 'Other'], //these can be changed (radio button options)
            information: ['Primary Physician Information', 'Medical History', 'Medications/Perscriptions', 'Other'] //these can be changed (radio button options)
        };
        this.handleChange = this.handleChange.bind(this);
    }

    /*Helper Functions*/

    /*Handle Event Functions*/
    /*Handle Event Functions*/
    handleChange = key => {

        return event => {
            this.setState({ [key]: event.target.value });
        };
    };
    handleSubmit = e => {
        e.preventDefault();
    };

    // function gets called when a radio button for documents is selected
    addDocumentSelected = index => key => {
      const { documentsSelected } = this.state;
      console.log(documentsSelected)
      this.setState(prevState => ({
                  documentsSelected: [
                      ...prevState.documentsSelected,
                      this.state.documents[index]
                  ]
              }));
    };

      // function gets called when a radio button for medical information is selected
    addInformationSelected = index => key => {
      const { informationSelected } = this.state;
      console.log(informationSelected)
      this.setState(prevState => ({
                  informationSelected: [
                      ...prevState.informationSelected,
                      this.state.information[index]
                  ]
              }));



    };

    // when someone clicks on clear documents (Radio buttons)
    clearDocumentChoices = e =>{
        this.setState({documentsSelected: []});
    }
    // when someone clicks on clear medical documents (input fields)
    clearInformationEntries = e=> {
        this.setState({informationNeeded: []});
    }
    // when someone clicks on clear idenifiable documents (input fields)
    clearDocumentEntries = e=> {
        this.setState({documentsNeeded: []});
    }
    // when someone clicks on clear medical documents (radio buttons)
    clearInformationChoices = e =>{
        this.setState({informationSelected: []});
    }

    // saves input field identifiable documents to map (this just a new slot)
    //- actual value is added in a separate function (handleDocumentChange)
    addDocument = e => {
        this.setState(prevState => ({
            documentsNeeded: [
                ...prevState.documentsNeeded,
                { name: "" }
            ]
        }));
        console.log("after add doc", this.state.documentsNeeded);
    };

    // each time the user enters a new character, update the name value for the document
    handleDocumentChange = index => key => {
        const { documentsNeeded } = this.state;
        console.log(this.state.documentsNeeded);

        return event => {
            documentsNeeded[index][key] = event.target.value;
            this.setState({ documentsNeeded });
        };
    };

    // saves input field medical documents to map (this just a new slot)
    //- actual value is added in a separate function (handleInformationChange)
    addInformation = e => {
        this.setState(prevState => ({
            informationNeeded: [
                ...prevState.informationNeeded,
                { name: "" }
            ]
        }));
        console.log("after add info", this.state.informationNeeded);
    };

    // each time the user enters a new character, update the name value for the medical document
    handleInformationChange = index => key => {
        const { informationNeeded } = this.state;
        console.log(this.state.informationNeeded);

        return event => {
            informationNeeded[index][key] = event.target.value;
            this.setState({ informationNeeded });
        };
    };

    componentDidMount() {
        if (!window.location.hash) {
            //setting window location
            window.location = window.location + "#loaded";
            //using reload() method to reload web page
            // window.location.reload();
        }
    }

    render() {
        if (this.props.currentStep !== 3) { // Prop: The current step
            return null
        }
        //get all the documentsNeeded that are input fields (add Document)
        const { documentsNeeded} = this.state;
        //get all of the informationNeeded that are input fields(add Document)
        const { informationNeeded} = this.state;
        //Get the array list of predefined documents that will be radio options
        let {documents} = this.state;
        let {information} = this.state;

        return (
            <div className="col">

                <div className="form-group row">

                    <label htmlFor="candidateSelection" className="col-2 col-form-label" />
                    <div className="col-8" >
                        Do you wish to select the eligible candidate?
                        <ul>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        id="yesSelect"
                                        value="1"
                                        checked={this.state.candidateSelection === "1"}
                                        onChange={this.handleChange('candidateSelection')}
                                    />
                                    Yes
                                </label>
                            </li>

                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        id="noSelect"
                                        value="0"
                                        checked={this.state.candidateSelection === "0"}
                                        onChange={this.handleChange('candidateSelection')}
                                    />
                                    No
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="form-group row">

                    <label htmlFor="documentationNeeded" className="col-2 col-form-label" />
                    <div className="col-8" >
                        Do you need documentation from applicants?
                        <ul>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        id= "yesDocApp"
                                        value="1"
                                        checked={this.state.documentationNeeded === "1"}
                                        onChange={this.handleChange('documentationNeeded')}
                                    />
                                    Yes
                                </label>
                            </li>

                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        id= "noDocApp"
                                        value="0"
                                        checked={this.state.documentationNeeded === "0"}
                                        onChange={this.handleChange('documentationNeeded')}
                                    />
                                    No
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.state.documentationNeeded === "1" && [
                    <div className="form-group row">
                        <div className="col-2" />
                        <label htmlFor="requiredDoc" className="col-2 col-form-label" />
                        <div className="col-6" >
                            Select Required Documentation
                            <ul id="doclist">
                            {documents.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            name={documents[index]}
                                            id={documents[index]}
                                            checked = {this.state.documentsSelected.includes(documents[index])===true}
                                            onChange={this.addDocumentSelected(index)}
                                            key={index}
                                        />{documents[index]}
                                    </div>
                                );
                            })}
                            </ul>
                            <div className="form-group row">
                                <div className="col-4" />
                                  <input type="submit" onClick={this.clearDocumentChoices} value="Clear Documents" className="submit-button" />
                              </div>
                            {documentsNeeded.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <DocumentFormGroup
                                            name={this.state.documentsNeeded[index].name}
                                            handleChange={this.handleDocumentChange(index)}
                                            key={index}
                                        />
                                    </div>
                                );
                            })}

                            <div className="form-group row">
                                <div className="col-4" />
                                <input type="submit" onClick={this.clearDocumentEntries} value="Delete Documents" className="submit-button"/>
                                <input type="submit" onClick={this.addDocument} value="Add Document" className="submit-button" />
                            </div>
                        </div>

                    </div>
                ]}


                <div className="form-group row">

                    <label htmlFor="medicalInfoNeeded" className="col-2 col-form-label" />
                    <div className="col-8" >
                        Do you need to collect medical information?
                        <ul>
                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        id= "yesMedInfo"
                                        value="1"
                                        checked={this.state.medicalInfoNeeded === "1"}
                                        onChange={this.handleChange('medicalInfoNeeded')}
                                    />
                                    Yes
                                </label>
                            </li>

                            <li>
                                <label>
                                    <input
                                        type="radio"
                                        id= "noMedInfo"
                                        value="0"
                                        checked={this.state.medicalInfoNeeded === "0"}
                                        onChange={this.handleChange('medicalInfoNeeded')}
                                    />
                                    No
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.state.medicalInfoNeeded === "1" && [
                    <div className="form-group row">
                        <div className="col-2" />
                        <label htmlFor="requiredInfo" className="col-2 col-form-label" />
                        <div className="col-6" >
                            Select Required Information
                            <ul id="medicalList">
                            {information.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            name={information[index]}
                                            id={information[index]}
                                            checked = {this.state.informationSelected.includes(information[index])===true}
                                            onChange={this.addInformationSelected(index)}
                                            key={index}
                                        />{information[index]}
                                    </div>
                                );
                            })}
                            </ul>
                            <div className="form-group row">
                                <div className="col-4" />
                                  <input type="submit" onClick={this.clearInformationChoices} value="Clear Selections" className="submit-button"/>
                            </div>
                            {informationNeeded.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <InformationFormGroup
                                            name={this.state.informationNeeded[index].name}
                                            handleChange={this.handleInformationChange(index)}
                                            key={index}
                                        />
                                    </div>
                                );
                            })}
                            <div className="form-group row">
                                <div className="col-4" />
                                <input type="submit" id="addMedicalInfo" onClick={this.addInformation} value="Add Document" className="submit-button"/>
                                <input type="submit" onClick={this.clearInformationEntries} value="Delete Documents" className="submit-button"/>
                            </div>
                        </div>

                    </div>
                ]}


                <div className="form-group row">
                    <div className="col-2" />
                    <input type="submit" onClick={this.props.previousFunction} value="Previous" className="submit-button"/>
                    <div className="col-8" />
                    <input type="submit" id="nextButton" onClick={()=>{this.props.nextFunction(this.state);}} value="Next" className="submit-button"/>
                </div>
            </div>
        );
    }

}
export default Information;
