import React, {Component} from "react";
import "../../../../styles/buttons.css";
import "./scss/eligibility.scss";
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

class Eligibility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "", // the comparison operator for age
      ageLow: "", //lowerbound for age, can be blank
      ageHigh: "", //upperbound for age, can be blank
      sex: "", // male, female or both
      location: "", // want to use distance, state, etc
      distance: "", // distance in miles if option is selected in location
      addressLine1: "", // the first address line, required
      addressLine2: "", // second address line, optional
      city: "", // city for address
      searchusstate: "", //state for address
      zip: "", // zip for address
      ethnicity: ["white", "black"], //ethnicity has more values below
      ethnicityOther: "", // if they selected other for ethnicity, this is the value the user then enters
      languageOther: "", // if they selected other for language, this is the value the user then enters
      firstLanguage: "", // first language spoken by applicant
      citizenship: "", // type of citizenship required for applicant
      employment: "", // whether the applicant must be employed
      militaryService: "", // applicants military status
      insurance: "", // does the applicant need to have insurance
      marriageStatus: "", // does the applicant need to be marri
      income: "", // the income operator
      incomeLow: "", //lowerbound for income
      incomeHigh: "", //upperbound for income
      dependents: "", //dependents operator
      dependentsLow: "", //lowerbound for dependents
      dependentsHigh: "" //upperbound for dependants
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };

  handleSubmit = e => {
    e.preventDefault();
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
    if (this.props.currentStep !== 2) {
      // Prop: The current step
      return null;
    }
    return (
      <div className="col">
        <div className="col-8">Includes criteria for HUG recipients</div>
        <div className="row mt-5">
          <div className="col">
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Age" className="col-2 col-form-label">
                Age
              </label>
              <div className="col">
                <select
                  id="Age"
                  value={this.state.age}
                  className="form-control"
                  onChange={this.handleChange("age")}
                >
                  <option value="" disabled selected>
                    Select filter...
                  </option>
                  <option value="Less than">Less than</option>
                  <option value="Greater than">Greater than</option>
                  <option value="Range">Range</option>
                </select>
              </div>
              <div className="col-2">
                <input
                  id="AgeLow"
                  className="form-control"
                  value={this.state.ageLow}
                  onChange={this.handleChange("ageLow")}
                  disabled={this.state.age === "Less than"}
                />
              </div>
              -
              <div className="col-2">
                <input
                  id="AgeHigh"
                  className="form-control"
                  value={this.state.ageHigh}
                  onChange={this.handleChange("ageHigh")}
                  disabled={this.state.age === "Greater than"}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Sex" className="col-2 col-form-label">
                Sex
              </label>
              <div className="col">
                <select
                  id="Sex"
                  value={this.state.sex}
                  className="form-control"
                  onChange={this.handleChange("sex")}
                >
                  <option value="" disabled selected>
                    Select sex...
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="MaleFemale">Male or Female</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Location" className="col-2 col-form-label">
                Location
              </label>
              <div className="col">
                <select
                  id="Location"
                  value={this.state.location}
                  className="form-control"
                  onChange={this.handleChange("location")}
                >
                  <option value="" disabled selected>
                    Select filter...
                  </option>
                  <option value="State">State</option>
                  <option value="City">City</option>
                  <option value="Distance From Location">
                    Distance from Location
                  </option>
                </select>
              </div>
              <label htmlFor="Distance" className="col-1.5 col-form-label">
                Distance (mi)
              </label>
              <div className="col-2">
                <input
                  id="Distance"
                  className="form-control"
                  value={this.state.distance}
                  onChange={this.handleChange("distance")}
                  disabled={this.state.location !== "Distance From Location"}
                />
              </div>
            </div>

            <div className={this.state.shouldHide ? "hidden" : ""}>
              <FormGroup
                labelName="Address Line 1"
                value={this.state.addressLine1}
                handleChange={this.handleChange("addressLine1")}
              />

              <FormGroup
                labelName="Address Line 2"
                value={this.state.addressLine2}
                handleChange={this.handleChange("addressLine2")}
              />

              <div className="form-group row">
                <div className="col-1" />

                <label htmlFor="City" className="col-2 col-form-label">
                  City
                </label>
                <div className="col">
                  <input
                    id="city"
                    className="form-control"
                    type="searchcity"
                    value={this.state.city}
                    onChange={this.handleChange("city")}
                  />
                </div>

                <label htmlFor="State" className="col-1 col-form-label">
                  State
                </label>
                <div className="col">
                  <select
                    id="state"
                    value={this.state.searchusstate}
                    className="form-control"
                    onChange={this.handleChange("searchusstate")}
                  >
                    <option value="" disabled selected>
                      Select State...
                    </option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>

                <label htmlFor="Zip" className="col-1 col-form-label">
                  Zip
                </label>
                <div className="col">
                  <input
                    id="zip"
                    className="form-control"
                    type="zip"
                    value={this.state.zip}
                    onChange={this.handleChange("zip")}
                  />
                </div>
                <div className="col-1" />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Ethnicity" className="col-1 col-form-label">
                Ethnicity
              </label>
              <div className="col-1" />
              <div className="col">
                <select
                  id="ethnicity"
                  value={this.state.ethnicity}
                  className="form-control"
                  onChange={this.handleChange("ethnicity")}
                >
                  <option value="" disabled selected>
                    Select Ethnicity...
                  </option>
                  <option value="Caucasian">Caucasian</option>
                  <option value="Hispanic or Latino">Hispanic or Latino</option>
                  <option value="Black or African American">
                    Black or African American
                  </option>
                  <option value="Asian">Asian</option>
                  <option value="American Indian or Alaska Native">
                    American Indian or Alaska Native
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-1" />`
            </div>

            {this.state.ethnicity === "Other" && [
              <div className="form-group row">
                <div className="col-3" />
                <div className="col-6">
                  <input
                    id="ethnicityOther"
                    className="form-control"
                    value={this.state.ethnicityOther}
                    onChange={this.handleChange("ethnicityOther")}
                  />
                </div>
              </div>
            ]}

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="First Language" className="col-2 col-form-label">
                First Language
              </label>
              <div className="col">
                <select
                  id="firstLanguage"
                  value={this.state.firstLanguage}
                  className="form-control"
                  onChange={this.handleChange("firstLanguage")}
                >
                  <option value="" disabled selected>
                    Select Language...
                  </option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-1" />
            </div>
            {this.state.firstLanguage === "Other" && [
              <div className="form-group row">
                <div className="col-3" />
                <div className="col-6">
                  <input
                    id="languageOther"
                    className="form-control"
                    value={this.state.languageOther}
                    onChange={this.handleChange("languageOther")}
                  />
                </div>
              </div>
            ]}

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Citizenship" className="col-2 col-form-label">
                Citizenship
              </label>
              <div className="col">
                <select
                  id="citizenship"
                  value={this.state.citizenship}
                  className="form-control"
                  onChange={this.handleChange("citizenship")}
                >
                  <option value="" disabled selected>
                    Select Citizenship...
                  </option>
                  <option value="Citizen">Citizen</option>
                  <option value="Legal Resident">Legal Resident</option>
                  <option value="Undocumented">Undocumented</option>
                </select>
              </div>
              <div className="col-1" />
            </div>
            <div className="form-group row">
              <div className="col-1" />
              <label
                htmlFor="Military Service"
                className="col-2 col-form-label"
              >
                Military Service
              </label>
              <div className="col">
                <select
                  id="militaryService"
                  value={this.state.militaryService}
                  className="form-control"
                  onChange={this.handleChange("militaryService")}
                >
                  <option value="" disabled selected>
                    Select Military Service...
                  </option>
                  <option value="Active Duty">Active Duty</option>
                  <option value="Reserve Duty">Reserve Duty</option>
                  <option value="Veteran">Veteran</option>
                  <option value="NA">NA</option>
                </select>
              </div>
              <div className="col-1" />
            </div>
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Employment" className="col-2 col-form-label">
                Employment
              </label>
              <div className="col">
                <select
                  id="employment"
                  value={this.state.employment}
                  className="form-control"
                  onChange={this.handleChange("employment")}
                >
                  <option value="" disabled selected>
                    Select Employment...
                  </option>
                  <option value="Currently Employed">Currently Employed</option>
                  <option value="Unemployed Less than 6 Months">
                    Unemployed Less than 6 Months
                  </option>
                  <option value="Unemployed More than 6 Months">
                    Unemployed More than 6 Months
                  </option>
                  <option value="Unemployed More than 1 Year">
                    Unemployed More than 1 Year
                  </option>
                </select>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Income" className="col-2 col-form-label">
                Income
              </label>
              <div className="col">
                <select
                  id="income"
                  value={this.state.income}
                  className="form-control"
                  onChange={this.handleChange("income")}
                >
                  <option value="" disabled selected>
                    Select filter...
                  </option>
                  <option value="Less than">Less than</option>
                  <option value="Range">Range</option>
                  <option value="Federal Poverty Level">
                    Federal Poverty Level
                  </option>
                </select>
              </div>
              <div className="col-2">
                <input
                  id="incomeLow"
                  className="form-control"
                  value={this.state.incomeLow}
                  onChange={this.handleChange("incomeLow")}
                  disabled={this.state.income !== "Range"}
                />
              </div>
              -
              <div className="col-2">
                <input
                  id="incomeHigh"
                  className="form-control"
                  value={this.state.incomeHigh}
                  onChange={this.handleChange("incomeHigh")}
                  disabled={this.state.income === "Federal Poverty Level"}
                />
              </div>
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Insurance" className="col-2 col-form-label">
                Insurance
              </label>
              <div className="col">
                <select
                  id="insurance"
                  value={this.state.insurance}
                  className="form-control"
                  onChange={this.handleChange("insurance")}
                >
                  <option value="" disabled selected>
                    Select Insurance...
                  </option>
                  <option value="Insured">Insured</option>
                  <option value="Uninsured">Uninsured</option>
                </select>
              </div>
              <div className="col-1" />
            </div>
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="MarriageStatus" className="col-2 col-form-label">
                Marriage Status
              </label>
              <div className="col">
                <select
                  id="marriageStatus"
                  value={this.state.marriageStatus}
                  className="form-control"
                  onChange={this.handleChange("marriageStatus")}
                >
                  <option value="" disabled selected>
                    Select Marriage Status...
                  </option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Single">Single</option>
                </select>
              </div>
              <div className="col-1" />
            </div>
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Dependents" className="col-2 col-form-label">
                Dependents
              </label>
              <div className="col">
                <select
                  id="dependents"
                  value={this.state.dependents}
                  className="form-control"
                  onChange={this.handleChange("dependents")}
                >
                  <option value="" disabled selected>
                    Select Dependents...
                  </option>
                  <option value="Less Than">Less Than</option>
                  <option value="Greater Than">Greater Than</option>
                  <option value="Range">Range</option>
                </select>
              </div>
              <div className="col-2">
                <input
                  id="dependentsLow"
                  className="form-control"
                  value={this.state.dependentsLow}
                  onChange={this.handleChange("dependentsLow")}
                  disabled={this.state.dependents === "Less Than"}
                />
              </div>
              -
              <div className="col-2">
                <input
                  id="dependentsHigh"
                  className="form-control"
                  value={this.state.dependentsHigh}
                  onChange={this.handleChange("dependentsHigh")}
                  disabled={this.state.dependents === "Greater Than"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-2" />
          <input
            type="submit"
            onClick={this.props.previousFunction}
            value="Previous"
            className="submit-button"
          />
          <div className="col-8" />
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
export default Eligibility;
