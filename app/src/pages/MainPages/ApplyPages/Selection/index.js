import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";

import ApplyTable from "../../../../components/ApplyTable";
import CollapseWithHeader from "../../../../components/CollapseWithHeader";
import SimpleMap from "../../../../components/SimpleMap";

import "./scss/selection.scss";
import "../../../../styles/buttons.css";

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

class Selection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charityName: "",
      programService: "",
      category: "",
      cause: "",
      currentAddress: "",
      display: "",
      programType: "",
      distance: "",
      addressLine1: "",
      addressLine2: "",
      searchcity: "",
      searchusstate: "",
      searchzip: "",
      city: "",
      usstate: "",
      zip: "",
      charities: [],
      charityDetailsRow: [],
      shouldHide: true
    };
  }

  /*Helper Functions*/
  createURL = () => {
    const pageSize = 100;
    const appID = "aedfc34a";
    const appKey = "01cf73941404f7ea6081d16d4923ab3b";
    let URL = `https://api.data.charitynavigator.org/v2/Organizations?app_id=${appID}&app_key=${appKey}&pageSize=${pageSize}&rated=true`;
    if (this.state.charityName !== "" && this.state.programService === "") {
      //search is by charity name only, hence the NAME_ONLY attribute
      URL += "&searchType=NAME_ONLY&search=" + this.state.charityName;
    } else if (
      this.state.charityName === "" &&
      this.state.programService !== ""
    ) {
      //search is by program & service, hence the DEFAULT attribute
      URL += "&searchType=DEFAULT&search=" + this.state.programService;
    } else if (
      this.state.charityName !== "" &&
      this.state.programService !== ""
    ) {
      //search is by program & service, as well as by charity name.  No way to just search by name,
      //so DEFAULT attribute is used and the search terms are combined, with a white space separator
      URL += "&searchType=DEFAULT&search=" + this.state.programService;
      URL += " " + this.state.charityName;
    }
    if (this.state.state !== "") {
      URL += "&state=" + this.state.usstate;
    }
    if (this.state.city !== "") {
      URL += "&city=" + this.state.city;
    }
    if (this.state.zip !== "") {
      URL += "&zip=" + this.state.zip;
    }

    return URL;
  };

  formatAddress = ({
    streetAddress1,
    streetAddress2,
    city,
    stateOrProvince,
    postalCode
  }) => {
    return `${streetAddress1} ${
      streetAddress2 ? streetAddress2 : ""
    } ${city}, ${stateOrProvince} ${postalCode}`;
  };

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };

  handleAddressChange = () => {
    return event => {
      this.setState({
        currentAddress: event.target.value
      });
      if (event.target.value !== "InputAddress") {
        this.setState({
          shouldHide: true
        });
      } else {
        this.setState({
          shouldHide: false
        });
      }
    };
  };

  handleCharityClick = index => () => {
    const {
      mission = "",
      tagLine = "",
      irsClassification: { classification = "", foundationStatus = "" }
    } = this.state.charities[index];
    this.setState({
      charityDetailsRow: [
        { mission, tagLine, classification, foundationStatus }
      ]
    });
  };

  handleSubmit = event => {
    const URL = this.createURL();

    fetch(URL)
      .then(response => {
        if (response.ok) {
          // console.log('json', response.json());
          return response.json();
        } else {
          console.log("RESPONSE: NOT OK");
        }
      })
      .then(charities => {
        let charityDetailsRow;
        if (!charities) {
          console.log('if');
          charities = [];
          charityDetailsRow = [];
        } else {
          console.log('else');
          if (this.state.category !== "") {
            charities = charities.filter(charity => {
              return charity.category.categoryName === this.state.category;
            });
          }
          if (this.state.cause !== "") {
            charities = charities.filter(charity => {
              return charity.cause.causeName === this.state.cause;
            });
          }
        }
        console.log(`Charities: ${JSON.stringify(charities)}`);
        this.setState({
          charities,
          charityDetailsRow
        });
      });

    console.log('result of charities state', this.state.charities);
    event.preventDefault();
  };

  componentDidMount() {
    if (!window.location.hash) {
      //setting window location
      window.location.assign(window.location + "#loaded");
    }
  }
  render() {
    const registeredProgramsHeaderRow = [
      "Add",
      "Program",
      "Description",
      "Deadline",
      "Aid/Service",
      "Supplemental"
    ];
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
        <div className="row mt-5">
          <SimpleMap
            addresses={this.state.charities[0] ? this.state.charities : ""}
          />
        </div>
        <div className="row mt-5">
          <form className="col" onSubmit={this.handleSubmit}>
            <FormGroup
              labelName="Charity Name"
              value={this.state.charityName}
              handleChange={this.handleChange("charityName")}
            />

            <FormGroup
              labelName="Program/Service"
              value={this.state.programService}
              handleChange={this.handleChange("programService")}
            />
            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Category" className="col-2 col-form-label">
                Category
              </label>
              <div className="col-8">
                <select
                  id="Category"
                  value={this.state.category}
                  className="form-control"
                  onChange={this.handleChange("category")}
                >
                  <option value="">Select Category...</option>
                  <option value="Animals">Animals</option>
                  <option value="Arts, Culture, Humanities">
                    Arts, Culture, Humanities
                  </option>
                  <option value="Community Development">
                    Community Development
                  </option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Human Services">Human Services</option>
                  <option value="International">International</option>
                  <option value="Research and Public Policy">
                    Research and Public Policy
                  </option>
                  <option value="Religion">Religion</option>
                </select>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Cause" className="col-2 col-form-label">
                Cause
              </label>
              <div className="col-8">
                <select
                  id="Cause"
                  value={this.state.cause}
                  className="form-control"
                  onChange={this.handleChange("cause")}
                >
                  <option value="">Select Cause...</option>
                  <option value="Animal Rights, Welfare, and Services">
                    Animal Rights, Welfare, and Services
                  </option>
                  <option value="Wildlife Conservation">
                    Wildlife Conservation
                  </option>
                  <option value="ZooAqua">Zoos and Aquariums</option>
                  <option value="Libraries, Historical Societies, and Landmark Preservation">
                    Libraries, Historical Societies, and Landmark Preservation
                  </option>
                  <option value="Museum">Museums</option>
                  <option value="PerformArt">Performing Arts</option>
                  <option value="Public Broadcasting and Media">
                    Public Broadcasting and Media
                  </option>
                  <option value="United Ways">United Ways</option>
                  <option value="Jewish Federations">Jewish Federations</option>
                  <option value="Community Foundations">
                    Community Foundations
                  </option>
                  <option value="Housing and Neighborhood Development">
                    Housing and Neighborhood Development
                  </option>
                  <option value="Early Childhood Programs and Services">
                    Early Childhood Programs and Services
                  </option>
                  <option value="Youth Education Programs and Services">
                    Youth Education Programs and Services
                  </option>
                  <option value="Adult Education Programs and Services">
                    Adult Education Programs and Services
                  </option>
                  <option value="Special Education">Special Education</option>
                  <option value="Education Policy and Reform">
                    Education Policy and Reform
                  </option>
                  <option value="Scholarship and Financial Support">
                    Scholarship and Financial Support
                  </option>
                  <option value="Environmental Protection and Conservation">
                    Environmental Protection and Conservation
                  </option>
                  <option value="Botanical Gardens, Parks, and Nature Centers">
                    Botanical Gardens, Parks, and Nature Centers
                  </option>
                  <option value="Disease, Disorders, and Disciplines">
                    Disease, Disorders, and Disciplines
                  </option>
                  <option value="Patient and Family Support">
                    Patient and Family Support
                  </option>
                  <option value="Food Banks, Food Pantries, and Food Distribution">
                    Food Banks, Food Pantries, and Food Distribution
                  </option>
                  <option value="Multipurpose Human Service Organizations">
                    Multipurpose Human Service Organizations
                  </option>
                  <option value="Homeless Services">Homeless Services</option>
                  <option value="Social Services">Social Services</option>
                  <option value="Development and Relief Services">
                    Development and Relief Services
                  </option>
                  <option value="International Peace, Security, and Affairs">
                    International Peace, Security, and Affairs
                  </option>
                  <option value="Humanitarian Relief Supplies">
                    Humanitarian Relief Supplies
                  </option>
                  <option value="Non-Medical Science & Technology Research">
                    Non-Medical Science & Technology Research
                  </option>
                  <option value="Social and Public Policy Research">
                    Social and Public Policy Research
                  </option>
                  <option value="Religious Activites">
                    Religious Activites
                  </option>
                  <option value="Religious Media & Broadcasting">
                    Religious Media & Broadcasting
                  </option>
                </select>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Display" className="col-2 col-form-label">
                Display
              </label>
              <div className="col-8">
                <select
                  id="Display"
                  value={this.state.display}
                  className="form-control"
                  onChange={this.handleChange("display")}
                >
                  <option value="">Select Display...</option>
                  <option value="AllCharities">All charities</option>
                  <option value="OnlyCharities">
                    Only charities with available programs
                  </option>
                </select>
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Program Type" className="col-2 col-form-label">
                Program Type
              </label>
              <div className="col-8">
                <select
                  id="Program Type"
                  value={this.state.programType}
                  className="form-control"
                  onChange={this.handleChange("programType")}
                >
                  <option value="base">Select Program Type...</option>
                  <option value="OnlyFinancial">
                    Only financial aid programs
                  </option>
                  <option value="OnlyService">Only service programs</option>
                </select>
              </div>
              <div className="col-1" />
            </div>

            <FormGroup
              labelName="Distance (mi)"
              value={this.state.distance}
              handleChange={this.handleChange("distance")}
            />

            <div className="form-group row">
              <div className="col-1" />

              <label htmlFor="City" className="col-2 col-form-label">
                City
              </label>
              <div className="col">
                <input
                  id="City"
                  className="form-control"
                  type="city"
                  value={this.state.city}
                  onChange={this.handleChange("city")}
                />
              </div>

              <label htmlFor="State" className="col-1 col-form-label">
                State
              </label>
              <div className="col">
                <select
                  id="State"
                  value={this.state.usstate}
                  className="form-control"
                  onChange={this.handleChange("usstate")}
                >
                  <option value="">Select State...</option>
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
                  id="Zip"
                  className="form-control"
                  type="zip"
                  value={this.state.zip}
                  onChange={this.handleChange("zip")}
                />
              </div>
              <div className="col-1" />
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="Location" className="col-2 col-form-label">
                Location
              </label>
              <div className="col-8">
                <select
                  id="Current Address"
                  value={this.state.currentAddress}
                  className="form-control"
                  onChange={this.handleAddressChange("currentAddress")}
                >
                  <option value="">Choose Location To Search By...</option>
                  <option value="CurrentLocation">Current Location</option>
                  <option value="HomeAddress">Home Address</option>
                  <option value="InputAddress">Input Address</option>
                </select>
              </div>
              <div className="col-1" />
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
                    id="City"
                    className="form-control"
                    type="searchcity"
                    value={this.state.searchcity}
                    onChange={this.handleChange("searchcity")}
                  />
                </div>

                <label htmlFor="State" className="col-1 col-form-label">
                  State
                </label>
                <div className="col">
                  <select
                    id="State"
                    value={this.state.searchusstate}
                    className="form-control"
                    onChange={this.handleChange("searchusstate")}
                  >
                    <option value="">Select State...</option>
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
                    id="Zip"
                    className="form-control"
                    type="searchzip"
                    value={this.state.searchzip}
                    onChange={this.handleChange("searchzip")}
                  />
                </div>
                <div className="col-1" />
              </div>
            </div>

            {/* search for charities*/}
            <div className="form-group row">
              <div className="col text-center">
                <input className="submit-button" id="submit-button" type="submit" value="Search" />
              </div>
            </div>
          </form>
        </div>

        <CollapseWithHeader title="Charity Matches" open={true}>
          <ReactTable
            data={this.state.charities}
            resolveData={data => {
              return data.map(
                ({
                  charityName,
                  mailingAddress,
                  category: { categoryName },
                  cause: { causeName }
                }) => {
                  return {
                    charityName,
                    mailingAddress: this.formatAddress(mailingAddress),
                    category: categoryName,
                    cause: causeName
                  };
                }
              );
            }}
            columns={[
              {
                headerClassName: "apply-table-thead",
                Header: "Name",
                accessor: "charityName",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                Header: "Location",
                accessor: "mailingAddress",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                accessor: "category",
                Header: "Category",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                accessor: "cause",
                Header: "Cause",
                style: { whiteSpace: "unset" }
              }
            ]}
            defaultPageSize={10}
            getTrProps={(state, rowInfo) => {
              if (rowInfo) {
                return {
                  onClick: this.handleCharityClick(rowInfo.index)
                };
              } else return {};
            }}
            className="-striped -highlight"
            style={{
              height: "400px"
            }}
          />
        </CollapseWithHeader>

        <CollapseWithHeader title="Charity Details" open={true}>
          <ReactTable
            data={this.state.charityDetailsRow}
            resolveData={data => data.map(row => row)}
            columns={[
              {
                Header: "Mission",
                accessor: "mission",
                style: { whiteSpace: "unset" }
              },
              {
                Header: "Tag Line",
                accessor: "tagLine",
                style: { whiteSpace: "unset" }
              },
              {
                Header: "Foundation Status",
                accessor: "foundationStatus",
                style: { whiteSpace: "unset" }
              },
              {
                Header: "IRS Classification",
                accessor: "classification",
                style: { whiteSpace: "unset" }
              }
            ]}
            defaultPageSize={1}
            className="-striped -highlight"
            style={{
              height: "400px"
            }}
          />
        </CollapseWithHeader>

        <CollapseWithHeader title="Registered Programs" open={false}>
          <ApplyTable headerRow={registeredProgramsHeaderRow} />
        </CollapseWithHeader>

        <CollapseWithHeader title="Application List" open={false}>
          <ApplyTable headerRow={applicationListHeaderRow} />
        </CollapseWithHeader>

        {/*Next button*/}
        <div className="row">
          <div className="col text-right">
            <LinkContainer to="/apply/supplemental">
              <a className="prev_next">Next</a>
            </LinkContainer>
          </div>
        </div>
      </div>
    );
  }
}
export default Selection;
