import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import "../../../../styles/buttons.css";
import "./scss/search.scss";
import "react-table/react-table.css";
import "./scss/search.scss";
import ReactPaginate from 'react-paginate';
import { Button, Card, ProgressBar } from "react-bootstrap";
import { UserIDContext } from "../../MainPagesRoutingContainer/index.tsx";
import { RepresentingOrgIDContext } from "../../MainPagesRoutingContainer/index.tsx";

// Manage
// This page reflects much of the behavior of the HUG Search page and
// therefore some of the methods are reused or only slightly modified
// A major distinction is that this page limits the data displayed to the
// organization that the user is representing
let userID = 0;
let orgID = 0;
// capture the user id of the current user logged in from the context
const UserIDVal = ID => {
  userID = ID.ID;
  return null;
};
// capture the organization the user is representing from the context
const OrgIDVal = orgId => {
  orgID = orgId.id;
  console.log("Manage Has Representing Org ID");
  console.log(orgID);
  return null;
};

//to display search results
const searchCards = (props) => {
  {console.log("Properties of search card")}
{ console.log(props)}
  if (props.grants.length === 0) {
    return <div />;
  } else {
    const searchCardsResults = [];
  for (let i = props.currentPage*9 - 9; i < props.currentPage*9 && i<props.grants.length; i++) { // I think we just need to change out props.grants.length
  //for (let i = props.currentPage - 1; i < props.currentPage; i++) {
      const hugID = props.grants[i].grant.ID;
      const hugName = props.grants[i].grant.grantName;
      const hugAmount = props.grants[i].grant.grantAmount;
      const hugDescription = props.grants[i].grant.purpose;
      const hugCategory = props.grants[i].grant.grantCategory;
      const medicalCategory = props.grants[i].grant.medicalCategory;
      const hugDeadline = props.grants[i].grant.dateEnd;
    //  const location = props.grants[i].locations.state;
      let ageLow = null;
      let ageHigh = null;
      let ageFilter = " - ";


      //funding status of hug
      const f = props.grants[i].grant.fundingStatus;
      const numPeople = props.grants[i].grant.numPeopleDonated;

      //get the number of people that donated to the hug


      searchCardsResults.push(
        hugCard(hugID, hugName, hugAmount, numPeople , f)
      );
    }
    return <div className="card-deck">{searchCardsResults}</div>;
  }
};

//hug card in search results
const hugCard = (hugID, hugName, hugAmount, numPeopleDonated, amountRaised) => {
  let percentRaised = Math.round((amountRaised / hugAmount) * 100);
  //if percent is a small fraction
  if(percentRaised<1)
  {
    percentRaised = 1;
  }
  //if hug percent is fulfilled
  if(percentRaised >100)
  {
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
    <div className="card-deck">
      <Card bg="light" style={{ width: "28rem" }}>
        <Card.Header>
          {hugName.toUpperCase()} | ${hugAmount}
        </Card.Header>
        <Card.Body>
          <Card.Title>${amountRaised} has been raised</Card.Title>
          <br />
          <div className="form-group-row">
            <label>Funding Status</label>
            <div className="form-group row">
              <label className="col-2 col-form-label" />
              $0
              <div className="col-8">{progressInstance}</div>${hugAmount}
            </div>
          </div>
          <Card.Text>
            <ul>
              <li>Number of people that donated: {numPeopleDonated}</li>
            </ul>
          </Card.Text>
          <button className="submit-button">Manage</button>
        </Card.Body>
      </Card>
    </div>
  );
};

//to display donor HUG results
const donorHUGs = props => {
  if (props.grants.length === 0) {
    return <div />;
  } else {
    const donorCardsResults = [];
    for (let i = 0; i < props.grants.length; i++) {
      const hugID = props.grants[i].grant.ID;
      const hugName = props.grants[i].grant.grantName;
      const hugAmount = props.grants[i].grant.grantAmount;

      //funding status of hug
      const f = props.grants[i].grant.fundingStatus;
      const peopleDonated = props.grants[i].grant.numPeopleDonated;

      donorCardsResults.push(
        hugCard(hugID, hugName, hugAmount,peopleDonated, f)
      );
    }
    return <div className="card-deck">{donorCardsResults}</div>;
  }
};
class Manage extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  constructor(props) {
    super(props);
    this.state = {
      grants: [],
      pageCount: 0,
      currentPage: 1
     };
    this.handleChange = this.handleChange.bind(this);
    //this.handleFundingStatus = this.handleFundingStatus.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.updateCurrentPage = this.updateCurrentPage.bind(this);
  }

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };

  //update the current page
  updateCurrentPage  = current => {
    console.log("Updating the page", current);
    this.setState({currentPage: current.selected + 1});
  };


  //handle Query
  handleQuery = async e => {
    const data = new FormData();
    const dataID = new FormData();
    const grant = [];
    const eligibility = [];
    const locations = [];

    data.append("orgID", orgID)
    console.log("in handleQuery");
    await fetch(this.REACT_APP_AF_BACKEND_URL + "/manage/managegrants", {
      method: "POST",
      body: data
    })
      .then(response => response.json())
      .then(resJson => {
         console.log("entered fuflfilled", resJson);
        if (resJson != null && resJson.grants != "None") {
          dataID.append("grantIDs", JSON.stringify(resJson.IDs));
          for (let i = 0; i < resJson.grants.length; i++) {
            grant.push(resJson.grants[i]);

          }
        }
      });

      console.log("Grant Value", grant);

    if (dataID.has("grantIDs")) {
      await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/eligibility", {
        method: "POST",
        body: dataID
      })
        .then(response => response.json())
        .then(resJson => {
          // console.log(resJson);
          if (resJson != null && resJson.eligibility != "None") {
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
          if (resJson != null && resJson.locations != "None") {
            for (let i = 0; i < resJson.locations.length; i++) {
              locations.push(resJson.locations[i]);
            }
          }
        });
    }

    //call cards here

    let grantResults = [];
    // checking for grant id match and adding the funding status to grant array
    let grantCopy = [];
    grantCopy = grant;
    for (let i = 0; i < grant.length; i++) {

      if (grant[i].ID) {
        let grantID = grant[i].ID;
        let status = false;
        await fetch(this.REACT_APP_AF_BACKEND_URL + "/search/fundingStatus?grantID="+grantID, {
          method: "GET",
        }).then(response => {
          status=response.ok;
          return response.json();
        })
            .then(data => {
              if  (status) {
                if (data.status === "OK") {
                  let grantsCopy = grant;
                  let funding = data.fundingStatus[0].fundingStatus;
                  console.log('data in status okay', funding);
                  grantsCopy[i]['fundingStatus']= funding;
                  grant[i]= grantCopy[i];
                }

              }
              else {

                // =>issue getting funding status
              }
            });
            await fetch(this.REACT_APP_AF_BACKEND_URL + "/manage/managedonates?grantID="+grantID, {
              method: "GET",
            }).then(response => {
              status=response.ok;
              return response.json();
            })
                .then(data => {
                  if  (status) {
                    console.log("The status returned" , data.status);
                    if (data.status === "OK") {
                      console.log("Adding donate info");
                      let grantsCopy = grant;
                      let donates = data.donates;
                      console.log('data for number of people donated', donates);
                      grantsCopy[i]['numPeopleDonated']= donates;
                      grant[i]= grantCopy[i];
                    }

                  }
                  else {

                    // =>issue getting funding status
                  }
                });
      };
      grantResults.push({
        grant: grant[i],
        eligibility: eligibility[i],
        locations: locations[i]
      });
    }

    // console.log('so', grantResults);
    this.state.grantCopyInfo = grantResults;
    console.log("The Grant Results");
    console.log(grantResults);
    this.setState({pageCount:grantResults.length/9 });
    this.setState({ grants: grantResults });
    let props = {grants: this.state.grants, handleChange: this.handleChange, handleFundingStatus: this.handleFundingStatus, currentPage: this.state.currentPage};
    return props;
  };
  //handle hug funding status
  //this function works and handle hug status value but is currently not being used
  // due to async call not updating in frontend immediately
  // handleFundingStatus = async () => {
  //   let status = false;
  //   await fetch(
  //     "http://localhost:4000/manage/fundingStatus?donorID=" + userID,
  //     {
  //       method: "GET"
  //     }
  //   )
  //     .then(response => {
  //       status = response.ok;
  //       return response.json();
  //     })
  //     .then(data => {});
  // };
  componentDidMount() {
    if (!window.location.hash) {
      //setting window location
      const hugsOrg = this.handleQuery();
      window.location.assign(window.location + "#loaded");
      //using reload() method to reload web page
    }
  }

  render() {
    const donorHugs = [];
    const props = {grants: this.state.grants, currentPage: this.state.currentPage};
    return (
      <div className="col">
        <div className="row mt-5">
          <div className="col">

              <div>{searchCards(props)}</div>
              <div className="form-group row">
                <div className="col-6" />
              <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={'...'}
              breakClassName={'page-item'}
              onPageChange={this.updateCurrentPage}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
            </div>
            <RepresentingOrgIDContext.Consumer>
              {value => <OrgIDVal id={value} />}
            </RepresentingOrgIDContext.Consumer>
          </div>
        </div>
      </div>
    );
  }
}

export default Manage;
