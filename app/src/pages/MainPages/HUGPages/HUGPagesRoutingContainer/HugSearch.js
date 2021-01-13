import React, { Component, Fragment } from "react";
import Popup from "reactjs-popup";
import { LinkContainer } from "react-router-bootstrap";
import ReactPaginate from "react-paginate";
import "../../../../styles/buttons.css";
import "./scss/search.scss";
import "react-table/react-table.css";
import { Card, ProgressBar } from "react-bootstrap";
import { UserIDContext } from "../../MainPagesRoutingContainer/index.tsx";
import swal from "sweetalert";
import { UserEmailContext } from "../../MainPagesRoutingContainer/index";
//range slider
const Modal = ({
  hugID,
  hugName,
  hugAmount,
  hugDescription,
  hugCategory,
  medicalCategory,
  location,
  ages,
  hugDeadline,
  handleChange,
  handleDonate,
  handleFundingStatus,
  f
}) => {
  //percent of amount raised
  let percentRaised = Math.round((f / hugAmount) * 100);
  //if percent is a small fraction
  if (percentRaised < 1) {
    percentRaised = 1;
  }
  //if hug percent is fulfilled
  if (percentRaised > 100) {
    percentRaised = 100;
  }

  const progressInstance = (
    <ProgressBar
      variant="success"
      now={percentRaised}
      label={`${percentRaised}%`}
    />
  );

  return (
    // modal trigger
    <Popup
      trigger={
        <button
          className="submit-button"
          data-toggle="modal"
          data-target="#donateModal"
          onClick
        >
          Donate
        </button>
      }
      modal
    >
      {/*//to close modal*/}
      {close => (
        <div className="row" id="donateModal">
          <div className="col text-center">
            <a className="closeModal" onClick={close}>
              &times;
            </a>
            <h1>
              {" "}
              {hugName}: ${hugAmount}
            </h1>
            <div className="form-group-row">
              <label>Funding Status: Raised ${f}</label>
              {/*range slider here*/}

              <div className="form-group row">
                <label className="col-2 col-form-label" />
                $0
                <div className="col-8">{progressInstance}</div>${hugAmount}
              </div>
            </div>
            <div>
              <p>Description: {hugDescription}</p>
              <p>HUG Category: {hugCategory}</p>
              <p>Medical Category: {medicalCategory}</p>
              <p>Location: {location}</p>
              <p>Ages: {ages}</p>
              <p>Deadline: {hugDeadline}</p>
            </div>
            <h2>How much would you like to donate?</h2>

            <div className="form-group row">
              <div className="col-1" />
              <label htmlFor="donate" className="col-2 col-form-label">
                Donation Amount $
              </label>
              <div className="col-8">
                <input
                  type="text"
                  className="form-control"
                  id="donateAmount"
                  onChange={handleChange("donateAmount")}
                />
              </div>
              <div className="col-1" />
            </div>
            <LinkContainer to="/search">
              <button
                className="submit-button"
                onClick={() => handleDonate(hugID)}
              >
                Submit
              </button>
            </LinkContainer>
            {/*close modal*/}
            <LinkContainer to="/search">
              <button
                className="submit-button"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
            </LinkContainer>
          </div>
        </div>
      )}
    </Popup>
  );
};

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

//user id
let userID = 0;

//user email
let userEmail = "";

// to filter the search card results
const FilterFormGroup = ({
  hugCategory,
  medicalCategory,
  specialtyCare,
  location,
  age,
  handleChange,
  hugOptions,
  medOptions,
  specialtyOptions,
  orderBy
}) => {
  return (
    <Fragment>
      <div className="col">
        <div className="col-1" />

        <div className="form-group row">
          <div className="col-1" />
          <label htmlFor="hugCategory" className="col-2 col-form-label">
            HUG Category
          </label>
          <div className="col-8">
            <select
              id="hugCategory"
              placeholder="Select..."
              value={hugCategory}
              className="form-control"
              onChange={handleChange("hugCategory")}
            >
              <option value="" disabled selected>
                Select HUG Category...
              </option>
              {hugOptions}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-1" />
          <label htmlFor="medicalCategory" className="col-2 col-form-label">
            Medical Category
          </label>
          <div className="col-8">
            <select
              id="medicalCategory"
              className="form-control"
              type="medicalCategory"
              value={medicalCategory}
              onChange={handleChange("medicalCategory")}
            >
              <option value="" disabled selected>
                Select Medical Category...
              </option>
              {medOptions}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-1" />
          <label htmlFor="Specialty Care" className="col-2 col-form-label">
            Specialty Care
          </label>
          <div className="col">
            <select
              id="specialtyCare"
              value={specialtyCare}
              className="form-control"
              onChange={handleChange("specialtyCare")}
              disabled={medicalCategory !== "Specialty Care"}
            >
              <option value="" disabled selected>
                Select Specialty Care...
              </option>
              {specialtyOptions}
            </select>
          </div>
          <div className="col-1" />
        </div>

        <div className="form-group row">
          <div className="col-1" />
          <label htmlFor="location" className="col-2 col-form-label">
            Location
          </label>
          <div className="col-8">
            <select
              id="location"
              placeholder="Select Location..."
              value={location}
              className="form-control"
              onChange={handleChange("location")}
            >
              <option value="" disabled selected>
                Select Location...
              </option>
              <option value="Alabama">Alabama</option>
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
              <option value="New York">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="Ohio">Ohio</option>
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
              <option value="Wiscoinsin">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </div>

        <FormGroup
          labelName="Age"
          value={age}
          handleChange={handleChange("age")}
        />
      </div>

      <div className="form-group row">
        <div className="col-1" />
        <label htmlFor="orderBy" className="col-2 col-form-label">
          Order By
        </label>
        <div className="col-8">
          <select
            id="orderBy"
            placeholder="Select ordering..."
            value={orderBy}
            className="form-control"
            onChange={handleChange("orderBy")}
          >
            <option value="" disabled selected>
              Select Ordering...
            </option>
            <option value="Date">Date</option>
            <option value="Amount">Amount</option>
          </select>
        </div>
      </div>
    </Fragment>
  );
};

//to display search results
const searchCards = props => {
  if (props.grants.length === 0) {
    return <div />;
  } else {
    const searchCardsResults = [];
    console.log("The current page");
    console.log(props.currentPage);
    for (
      let i = props.currentPage * 9 - 9;
      i < props.currentPage * 9 && i < props.grants.length;
      i++
    ) {
      // I think we just need to change out props.grants.length
      //  for (let i = props.currentPage - 1; i < props.currentPage; i++) {
      const hugID = props.grants[i].grant.ID;
      const hugName = props.grants[i].grant.grantName;
      const hugAmount = props.grants[i].grant.grantAmount;
      const hugDescription = props.grants[i].grant.purpose;
      const hugCategory = props.grants[i].grant.grantCategory;
      const medicalCategory = props.grants[i].grant.medicalCategory;
      const hugDeadline = props.grants[i].grant.dateEnd;
      //since the test grants do not have a location
      let location = null;
      if (props.grants[i].locations.state !== null) {
        location = props.grants[i].locations.state;
      } else {
        this.state.grants[i].locations.state = "test";
        location = "test";
      }

      let ageLow = null;
      let ageHigh = null;
      let ageFilter = " - ";

      // handle age ranges
      if (
        props.grants[i] &&
        props.grants[i].eligibility.ageLow !== null &&
        props.grants[i].eligibility.ageHigh !== null
      ) {
        ageLow = props.grants[i].eligibility.ageLow;
        ageHigh = props.grants[i].eligibility.ageHigh;
      } else if (props.grants[i].eligibility.ageHigh !== null) {
        ageHigh = props.grants[i].eligibility.ageHigh;
        ageFilter = " < ";
      } else if (props.grants[i].eligibility.ageLow !== null) {
        ageLow = props.grants[i].eligibility.ageLow;
        ageFilter = " + ";
      }

      //funding status of hug
      const f = props.grants[i].grant.fundingStatus;

      searchCardsResults.push(
        hugCard(
          hugID,
          hugName,
          hugAmount,
          hugDescription,
          hugCategory,
          medicalCategory,
          hugDeadline,
          ageLow,
          ageHigh,
          location,
          ageFilter,
          props.handleChange,
          props.handleDonate,
          props.handleFundingStatus,
          f
        )
      );
    }
    return <div className="card-deck">{searchCardsResults}</div>;
  }
};

//hug card in search results
const hugCard = (
  hugID,
  hugName,
  hugAmount,
  hugDescription,
  hugCategory,
  medicalCategory,
  hugDeadline,
  ageLow,
  ageHigh,
  location,
  ageFilter,
  handleChange,
  handleDonate,
  handleFundingStatus,
  f
) => {
  const concatAges = ageLow + ageFilter + ageHigh;

  return (
    <div className="card-deck">
      <Card bg="light" style={{ width: "18rem" }}>
        <Card.Header>
          {hugName.toUpperCase()} | ${hugAmount}
        </Card.Header>
        <Card.Body>
          <Card.Title>HUG Description: {hugDescription}</Card.Title>
          <br />
          <Card.Text>
            <ul>
              <li>HUG Category: {hugCategory}</li>
              <li>Medical Category: {medicalCategory}</li>
              <li>Location: {location}</li>
              <li>
                Ages: {ageLow}
                {ageFilter}
                {ageHigh}
              </li>
            </ul>
            Deadline: {hugDeadline}
          </Card.Text>

          <div>
            <div className="col text-center">
              <Modal
                hugID={hugID}
                hugName={hugName.toUpperCase()}
                hugAmount={hugAmount}
                hugDescription={hugDescription}
                hugCategory={hugCategory}
                medicalCategory={medicalCategory}
                location={location}
                ages={concatAges}
                hugDeadline={hugDeadline}
                handleChange={handleChange}
                handleDonate={handleDonate}
                handleFundingStatus={handleFundingStatus}
                f={f}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

//UserIdContext
const UserIDVal = ID => {
  userID = ID.ID;
  return null;
};

//UserEmailContext
const UserEmailVal = ID => {
  userEmail = ID.Email;
  return null;
};

class HugSearch extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);
    this.state = {
      hugName: "", // the name of the HUG
      donateAmount: 0, // How much money the HUG will be for
      filters: [
        {
          hugCategory: "",
          medicalCategory: "",
          specialtyCare: "",
          location: "",
          age: "",
          orderBy: ""
        }
      ],
      //passing to searchCards
      grants: [], // to hold values from the Grants table
      eligibility: [], // to hold values from the GrantEligibility table
      locations: [], // to hold values for the GrantLocations table
      hugs: [],
      filteredHugs: [], // after we apply filters
      //grant specific information required for handleFilters
      grantCopyInfo: [],
      pageCount: 0, // for the paginaton of the search results
      currentPage: 1 // keep track of the page of the pagination
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDonate = this.handleDonate.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
    this.handleFundingStatus = this.handleFundingStatus.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);
  }

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };

  //handle search
  handleSearch = async e => {
    const data = new FormData();
    const dataID = new FormData();
    const grant = [];
    const eligibility = [];
    const locations = [];

    data.append("grantName", this.state.hugName);

    await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/grants", {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(resJson => {
        // console.log("entered fuflfilled", resJson);
        if (resJson !== null && resJson.grants !== "None") {
          dataID.append("grantIDs", resJson.IDs);
          for (let i = 0; i < resJson.grants.length; i++) {
            grant.push(resJson.grants[i]);
          }
        }
      });
    //if grants exist that match the search criteria, we want to get
    // more information about the grants that include eligibility info
    if (dataID.has("grantIDs")) {
      await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/eligibility", {
        method: "POST",
        body: dataID
      })
        .then(response => response.json())
        .then(resJson => {
          // console.log(resJson);
          if (resJson !== null && resJson.eligibility !== "None") {
            for (let i = 0; i < resJson.eligibility.length; i++) {
              eligibility.push(resJson.eligibility[i]);
            }
          }
        });

      await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/locations", {
        method: "POST",
        body: dataID
      })
        .then(response => response.json())
        .then(resJson => {
          // console.log(resJson);
          if (resJson !== null && resJson.locations !== "None") {
            for (let i = 0; i < resJson.locations.length; i++) {
              locations.push(resJson.locations[i]);
            }
          }
        });
    }

    //call cards here

    const grantResults = [];

    // checking for grant id match and adding the funding status to grant array
    let grantCopy = [];
    grantCopy = grant;
    for (let i = 0; i < grant.length; i++) {
      // find out the funding status for each HUG
      if (grant[i].ID) {
        const grantID = grant[i].ID;
        let status = false;
        await fetch(
          this.REACT_APP_AF_BACKEND_URL + "/search/fundingStatus?grantID=" + grantID,
          {
            method: "GET"
          }
        )
          .then(response => {
            status = response.ok;
            return response.json();
          })
          .then(data => {
            if (status) {
              if (data.status === "OK") {
                const grantsCopy = grant;
                const funding = data.fundingStatus[0].fundingStatus;
                grantsCopy[i]["fundingStatus"] = funding;
                grant[i] = grantCopy[i];
              }
            } else {
              // =>issue getting funding status
            }
          });
      }
      grantResults.push({
        grant: grant[i],
        eligibility: eligibility[i],
        locations: locations[i]
      });
    }

    this.state.grantCopyInfo = grantResults;

    this.setState({ pageCount: grantResults.length / 9 });
    this.setState({ grants: grantResults });
    const props = {
      grants: this.state.grants,
      handleChange: this.handleChange,
      handleDonate: this.handleDonate,
      handleFundingStatus: this.handleFundingStatus,
      currentPage: this.state.currentPage
    };
    // pass all of the data to the search result cards that are to be rendered
    searchCards(props);
    this.render();
  };

  //handle apply filters
  handleFilterSubmit = e => {
    this.state.filteredHugs.length = 0;
    const filters = this.state.filters[0];
    this.state.grants = this.state.grantCopyInfo;
    console.log("Filter HUGS");
    console.log(this.state.grants);
    //Iterate through all the filters
    for (const filter in filters) {
      if (
        filters[filter] !== null &&
        filters[filter] !== "" &&
        filter !== "age" &&
        filter !== "location"
      ) {
        console.log("another filter");
        console.log(filter);
        let i;
        //Iterate through all the HUGs using that filter
        for (i = 0; i < this.state.grants.length; i++) {
          //Iterate through all the grants
          const obj = this.state.grants[i].grant;
          const ID = this.state.grants[i].grant.ID;
          for (const keys in obj) {
            //If the values match add them to the filtered HUGs
            if (
              !this.state.filteredHugs.some(item => item.grant.ID === ID) &&
              obj[keys] === filters[filter]
            ) {
              this.state.filteredHugs.push({
                grant: this.state.grants[i].grant,
                eligibility: this.state.grants[i].eligibility,
                locations: this.state.grants[i].locations
              });
            }
          }
        }
      } else if (
        filters[filter] !== null &&
        filters[filter] !== "" &&
        filter === "age"
      ) {
        console.log("filtering by age");
        let i;
        //Iterate through all the HUGs using that filter
        for (i = 0; i < this.state.grants.length; i++) {
          //Iterate through all the eligibility criteria
          const obj = this.state.grants[i].eligibility;
          const ID = this.state.grants[i].grant.ID;
          for (const keys in obj) {
            console.log("Ages", obj[keys]);
            console.log("Filter val", filters[filter]);
            //If the values match add them to the filtered HUGs
            if (
              !this.state.filteredHugs.some(
                item => item.eligibility.ID === ID
              ) &&
              obj[keys] === filters[filter]
            ) {
              this.state.filteredHugs.push({
                grant: this.state.grants[i].grant,
                eligibility: this.state.grants[i].eligibility,
                locations: this.state.grants[i].locations
              });
            }
          }
        }
      } else if (
        filters[filter] !== null &&
        filters[filter] !== "" &&
        filter === "location"
      ) {
        console.log("filtering by location");
        console.log(this.state.grants.locations);
        let i;
        //Iterate through all the HUGs using that filter
        for (i = 0; i < this.state.grants.length; i++) {
          //Iterate through all the locations
          const obj = this.state.grants[i].locations;
          const ID = this.state.grants[i].grant.ID;
          for (const keys in obj) {
            //If the values match add them to the filtered HUGs
            console.log("Locations", obj[keys]);
            console.log("Filter val", filters[filter]);
            if (
              !this.state.filteredHugs.some(item => item.locations.ID === ID) &&
              obj[keys] === filters[filter]
            ) {
              this.state.filteredHugs.push({
                grant: this.state.grants[i].grant,
                eligibility: this.state.grants[i].eligibility,
                locations: this.state.grants[i].locations
              });
            }
          }
        }
      }
    }

    // order the hugs by the orderBy selection
    if (this.state.filters[0].orderBy === "Date") {
      // if no other filters were applied
      if (this.state.filteredHugs.length === 0) {
        let i;
        //Build filteredHUGS
        for (i = 0; i < this.state.grants.length; i++) {
          this.state.filteredHugs.push({
            grant: this.state.grants[i].grant,
            eligibility: this.state.grants[i].eligibility,
            locations: this.state.grants[i].locations
          });
        }
      }

      // Order by the date
      this.state.filteredHugs.sort(function(a, b) {
        const d1 = new Date(a.grant.dateEnd);
        const d2 = new Date(b.grant.dateEnd);
        return d1 - d2;
      });
    } else if (this.state.filters[0].orderBy === "Amount") {
      // if no other filters were applied
      if (this.state.filteredHugs.length === 0) {
        let i;
        //Build filteredHUGS
        for (i = 0; i < this.state.grants.length; i++) {
          this.state.filteredHugs.push({
            grant: this.state.grants[i].grant,
            eligibility: this.state.grants[i].eligibility,
            locations: this.state.grants[i].locations
          });
        }
      }
      // Order by the amount
      this.state.filteredHugs.sort(function(a, b) {
        return b.grant.fundingPerPerson - a.grant.fundingPerPerson;
      });
    }

    if (this.state.filteredHugs.length === 0) {
      this.setState({ grants: [] });
      swal("Sorry!", "No results matching applied filter", "error").then(
        function(isConfirm) {
          if (isConfirm) {
            //page refresh
          } else {
            //if no clicked => do something else
          }
        }
      );
    } else {
      //set the filtered grants and refresh results
      this.setState({ pageCount: this.state.filteredHugs.length / 9 });
      //this.setState({currentPage: 0});
      this.setState({ grants: this.state.filteredHugs });
      const props = {
        grants: this.state.grants,
        handleChange: this.handleChange,
        handleDonate: this.handleDonate,
        handleFundingStatus: this.handleFundingStatus,
        currentPage: this.state.currentPage
      };
      searchCards(props);
      this.render();
    }
  };

  //handle filters change
  handleFiltersChange = index => key => {
    const { filters } = this.state;
    return event => {
      filters[index][key] = event.target.value;
      this.setState({ filters });
    };
  };

  //update the current page
  updateCurrentPage = current => {
    console.log("Updating the page", current);
    this.setState({ currentPage: current.selected + 1 });
  };

  // handle hug donate
  handleDonate = async grantID => {
    const x = this.state.grants;
    const data = new FormData();
    let donationAmount = 0;
    data.append("grantID", grantID);
    data.append("donorID", userID);
    // check if they have already donated to the HUG
    let status = false;
    await fetch(
      this.REACT_APP_AF_BACKEND_URL + "/search/donationStatus?grantID=" +
        grantID +
        "&donorID=" +
        userID,
      {
        method: "GET"
      }
    )
      .then(response => {
        status = response.ok;
        return response.json();
      })
      .then(data => {
        if (status) {
          if (data.status === "OK") {
            if (data.donationStatus[0] !== null) {
              donationAmount = data.donationStatus[0].donateAmount;
            }
            return donationAmount;
          }
        } else {
          // =>issue getting donation status
        }
      });
    // if they have not donated to the HUG before
    let i;
    let indexOfGrant = 0;
    let grantName = "";
    let grantAmount = "";
    for (i = 0; i < this.state.grants.length; i++) {
      if (this.state.grants[i].grant.ID === grantID) {
        grantName = this.state.grants[i].grant.grantName;
        indexOfGrant = i;
      }
    }
    //added a before donation to hold state of previous donation amount
    const beforeDonation = donationAmount;

    //donation amount here changes
    donationAmount =
      parseInt(this.state.donateAmount) + parseInt(donationAmount);
    data.append("donateAmount", donationAmount);

    //set condition to hold value of before donation instead of donationAmount to enter loop
    if (beforeDonation === 0) {
      await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/donate", {
        method: "POST",
        body: data
      }).then(response => {
        if (response.ok) {
          swal(
            "Thank you for donating to the following HUG with Affordable!",
            grantName,
            "success"
            // );
          ).then(function(isConfirm) {
            if (isConfirm) {
              console.log("on confirm", x);
            } else {
              //if no clicked => do something else
            }
          });
          // to refilter hugs after donating to instantly update the funding status
          this.handleSearch();
        } else {
          swal(
            "There was an issue donating to the HUG. Please check fields and resubmit.",
            "warning"
          );
        }
      });
    } else {
      await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/donateAgain", {
        method: "POST",
        body: data
      }).then(response => {
        if (response.ok) {
          swal(
            "Thank you for donating to the following HUG with Affordable!",
            grantName,
            "success"
          ).then(function(isConfirm) {
            if (isConfirm) {
              console.log("on confirm", x);
            } else {
              //if no clicked => do something else
            }
          });
          // to refilter hugs after donating to instantly update the funding status
          this.handleSearch();
        } else {
          swal(
            "There was an issue donating to the HUG. Please check fields and resubmit.",
            "warning"
          );
        }
      });
    }

    const hugData = new FormData();
    const orgID = this.state.grants[indexOfGrant].grant.orgID;
    let hugOrg = "";
    hugData.append("orgID", orgID);
    await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/hugOrg", {
      method: "POST",
      body: hugData
    })
      .then(response => response.json())
      .then(resJson => {
        console.log("entered fuflfilled", resJson.hugOrg[0].name);
        if (resJson !== null) {
          hugOrg = resJson.hugOrg[0].name;
        }
      });

    console.log("hugOrg", hugOrg);
    console.log(beforeDonation, donationAmount);

    //donation exceeding funding check when reaching goal
    grantAmount = this.state.grants[indexOfGrant].grant.grantAmount;
    let donationExceedFundingCheck = false;

    if (beforeDonation < grantAmount && donationAmount > grantAmount) {
      donationExceedFundingCheck = true;
    }

    //user alert for reaching funding goal of hug
    if (grantAmount === donationAmount || donationExceedFundingCheck) {
      console.log("reached hug goal");
      swal(
        "Thank you! The funding goal has been reached for the following HUG with Affordable!",
        grantName,
        "success"
      );

      // AWS email notify for hug funding

      const email = userEmail;
      if (email !== "") {
        const emailData = new FormData();
        const grantName = this.state.grants[indexOfGrant].grant.grantName;
        //using donor user's email address needs to use donor admin's email address
        emailData.append("email", email);
        emailData.append("grantName", grantName);
        emailData.append("orgName", hugOrg);
        console.log("here", email, grantName, hugOrg);
        fetch(this.REACT_APP_AF_BACKEND_URL + "/search/email/notifyHugFunding", {
          method: "POST",
          body: emailData
        })
          .then(response => {
            if (response.ok) return response.json();
          })
          .then(resData => {
            console.log(resData);
          });
      }
    }
  };

  //handle hug funding status
  //this function works and handle hug status value but is currently not being used
  // due to async call not updating in frontend immediately
  handleFundingStatus = async grantID => {
    let funding = "";
    let i;
    let grantName = "";
    for (i = 0; i < this.state.grants.length; i++) {
      if (this.state.grants[i].grant.ID === grantID) {
        grantName = this.state.grants[i].grant.grantName;
      }
    }

    let status = false;
    await fetch(
      this.REACT_APP_AF_BACKEND_URL + "/search/fundingStatus?grantID=" + grantID,
      {
        method: "GET"
      }
    )
      .then(response => {
        status = response.ok;
        return response.json();
      })
      .then(data => {
        if (status) {
          if (data.status === "OK") {
            funding = data.fundingStatus[0].fundingStatus;
            return funding;
          }
        } else {
          // =>issue getting funding status
        }
      });
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  componentDidMount() {
    if (!window.location.hash) {
      //setting window location
      window.location.assign(window.location + "#loaded");
      // this.handleFundingStatus();
      //using reload() method to reload web page
    }
  }

  render() {
    // console.log('email', userEmail);
    const { filters } = this.state;

    const grants = this.state.grants;
    const props = {
      grants: grants,
      handleChange: this.handleChange,
      handleDonate: this.handleDonate,
      handleFundingStatus: this.handleFundingStatus,
      currentPage: this.state.currentPage
    };

    const hugCategories = [
      "Medical Care",
      "Prescriptions",
      "Lifestyle",
      "Transportation"
    ];
    const medicalCategories = [
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
    const specialtyCares = [
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

    const hugCategoryList = hugCategories.map(function(hugCategory) {
      return <option value={hugCategory}>{hugCategory}</option>;
    });

    const medicalCategoryList = medicalCategories.map(function(
      medicalCategory
    ) {
      return <option value={medicalCategory}>{medicalCategory}</option>;
    });

    const specialtyCareList = specialtyCares.map(function(specialtyCare) {
      return <option value={specialtyCare}>{specialtyCare}</option>;
    });

    return (
      <div className="col">
        <div className="row mt-5">
          <div className="col">
            <FormGroup
              labelName="HUG Name"
              value={this.state.hugName}
              handleChange={this.handleChange("hugName")}
            />

            <div className="form-group row">
              <div className="col-6" />
              <button className="submit-button" onClick={this.handleSearch}>
                {" "}
                Search{" "}
              </button>
            </div>

            <div className="form-group row">
              <div className="col-1" />
              <label className="col-2 col-form-label">Filters</label>
              <div className="col-8">
                {filters.map((item, index) => {
                  return (
                    <div key={index}>
                      <FilterFormGroup
                        hugCategory={this.state.filters[0].hugCategory}
                        medicalCategory={this.state.filters[0].medicalCategory}
                        specialtyCare={this.state.filters[0].specialtyCare}
                        location={this.state.filters[0].location}
                        age={this.state.filters[0].age}
                        handleChange={this.handleFiltersChange(index)}
                        key={index}
                        hugOptions={hugCategoryList}
                        medOptions={medicalCategoryList}
                        specialtyOptions={specialtyCareList}
                        orderBy={this.state.filters[0].orderBy}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <UserIDContext.Consumer>
          {value => <UserIDVal ID={value} />}
        </UserIDContext.Consumer>
        <UserEmailContext.Consumer>
          {value => <UserEmailVal Email={value} />}
        </UserEmailContext.Consumer>
        <div className="form-group row">
          <div className="col-6" />
          <button className="submit-button" onClick={this.handleFilterSubmit}>
            {" "}
            Apply filters{" "}
          </button>
        </div>
        <div>
          <div>{searchCards(props)}</div>
          <div className="form-group row">
            <div className="col-6" />
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"page-item"}
              onPageChange={this.updateCurrentPage}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default HugSearch;
