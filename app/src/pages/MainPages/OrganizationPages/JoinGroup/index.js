import React, {Component} from "react";
import ReactTable from "react-table";
import CollapseWithHeader from "../../../../components/CollapseWithHeader";
import {UserIDContext} from "../../MainPagesRoutingContainer/index.tsx";
import "../../../../styles/buttons.css";
import "./scss/join-group.scss";
import "react-table/react-table.css";
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

let userID = 0;
let call = true;
const insert = true;
const UserIDVal = ID => {
  userID = ID.ID;
  return null;
};
class JoinGroup extends Component {
  REACT_APP_AF_BACKEND_URL = process.env.REACT_APP_AF_BACKEND_URL || window.REACT_APP_AF_BACKEND_URL;
  
  constructor(props) {
    super(props);
    this.state = {
      orgsList: [{ name: "", websiteUrl: "", phone: "", id: 0 }],
      shouldHide: true,
      charityName: "",
      charityDetailsRow: [
        { name: "", verified: "", role: "", date: "", id: 0 }
      ],
      representing: { name: "", verified: "", role: "", date: "", id: 0 }
    };
    this.displayOrganizations = this.displayOrganizations.bind(this);
    this.joinedOrganizations = this.joinedOrganizations.bind(this);
  }

  /*Helper Functions*/
  //Updates state with what company they are representing
  changeRepresentation = rowNum => {
    this.state.representing = this.state.charityDetailsRow[rowNum];
    localStorage.setItem(
      "representing",
      JSON.stringify(this.state.representing)
    );
    swal(
      this.state.representing.name,
      "You are now representing this organization"
    );
    const r = localStorage.getItem("representing");
    console.log(r);
  };

  //Removes member from organization
  removeMember = rowNum => {
    console.log(rowNum);
    swal(
      this.state.charityDetailsRow[rowNum].name,
      "Do you wish to remove this organization?",
      { buttons: ["Cancel", true] }
    ).then(willRemove => {
      if (willRemove) {
        const data = new FormData();
        data.append("orgID", this.state.charityDetailsRow[rowNum].id);
        data.append(
          "admin",
          this.state.charityDetailsRow[rowNum].role === "Admin" ? "1" : "0"
        );
        data.append("userID", userID);
        fetch(this.REACT_APP_AF_BACKEND_URL + "/joinGroup/removeMember", {
          method: "POST",
          body: data
        })
          .then(response => {
            if (response.ok) {
              swal("You have been removed from the organization!", {
                icon: "success"
              });
            } else {
              swal("Failure: Group already removed", {
                icon: "warning"
              });
            }
          })
          .then(() => {});
      }
    });
  };

  //Displays organization affiliations
  joinedOrganizations = e => {
    if (call && userID != null && userID != 0) {
      call = false;
      const data = new FormData();
      data.append("userID", userID);
      fetch(this.REACT_APP_AF_BACKEND_URL + "/joinGroup/affiliations", {
        method: "POST",
        body: data
      })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(resData => {
          if (resData != null && resData.orgs == null) {
            const charityVals = [];
            for (let i = 0; i < resData.length; i++) {
              charityVals.push({
                name: resData[i].name,
                verified: resData[i].verified ? "Yes" : "No",
                role: resData[i].role,
                date: resData[i].date,
                id: resData[i].orgID
              });
            }
            this.setState({
              charityDetailsRow: charityVals,
              representing:
                JSON.parse(localStorage.getItem("representing")) ||
                charityVals[0]
            });
            console.log(JSON.parse(localStorage.getItem("representing")));
          } else {
          }
        });
    }
  };

  //function: Searches for organizations whose name contains the entered string
  handleSearchOrganizations = e => {
    console.log("Charity search");
    console.log(document.getElementById("Charity-Name").value);
    if (document.getElementById("Charity-Name") != null) {
      const searchVal = document.getElementById("Charity-Name").value;
      const data = new FormData();
      data.append("orgName", searchVal);
      fetch(this.REACT_APP_AF_BACKEND_URL + "/joinGroup/searchOrg", {
        method: "POST",
        body: data
      })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(resData => {
          if (resData != null) {
            console.log("Here are your results");
            this.displayOrganizations(resData.orgName);
            this.render();
          } else {
            console.log("No organizations matched your search");
          }
        });
    }
  };

  displayOrganizations = orgs => {
    console.log(orgs);
    const orgValues = [];
    for (let i = 0; i < orgs.length; i++) {
      orgValues.push({
        name: orgs[i].name,
        websiteUrl: orgs[i].websiteUrl,
        phone: orgs[i].phone,
        id: orgs[i].ID
      });
    }
    console.log(orgValues);
    this.setState({
      orgsList: orgValues
    });
    console.log("after displaying orgs", this.state.orgsList);
    this.render();
  };

  /*Handle Event Functions*/
  handleChange = key => {
    return event => {
      this.setState({ [key]: event.target.value });
    };
  };

  handleCharityClick = rowNum => {
    swal(
      this.state.orgsList[rowNum].name,
      "Do you wish to join this organization?",
      { buttons: ["Cancel", true] }
    ).then(willJoin => {
      if (willJoin) {
        const data = new FormData();
        data.append("orgID", this.state.orgsList[rowNum].id);
        data.append("userID", userID);
        fetch(this.REACT_APP_AF_BACKEND_URL + "/joinGroup/addMember", {
          method: "POST",
          body: data
        })
          .then(response => {
            if (response.ok) {
              swal("You have joined the group!", {
                icon: "success"
              });
              //return response.json();
            } else {
              swal("Failure: Group already joined", {
                icon: "warning"
              });
            }
          })
          .then(() => {});
      }
    });
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

  componentDidUpdate() {
    this.joinedOrganizations();
  }
  render() {
    const orgResult = this.state.orgsList.map(function(current_info) {
      return current_info ? <li>{current_info}</li> : null;
    });
    return (
      <div className="col">
        <form className="col" onSubmit={this.handleSubmit}>
          <UserIDContext.Consumer>
            {value => <UserIDVal ID={value} />}
          </UserIDContext.Consumer>
          <FormGroup
            id="charityName"
            labelName="Charity Name"
            value={this.state.charityName}
            handleChange={this.handleChange("charityName")}
          />
          <div className="form-group row">
            <div className="col text-center">
              <input
                className="submit-button"
                type="submit"
                value="Search"
                onClick={this.handleSearchOrganizations}
              />
            </div>
          </div>
        </form>
        <CollapseWithHeader title="Search Results" open={true}>
          <ReactTable
            data={this.state.orgsList}
            resolveData={data => {
              return data.map(({ name, websiteUrl, phone }) => {
                return { name, websiteUrl, phone };
              });
            }}
            columns={[
              {
                headerClassName: "apply-table-thead",
                Header: "Organization Name",
                accessor: "name",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                Header: "Website",
                accessor: "websiteUrl",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                Header: "Phone",
                accessor: "phone",
                style: { whiteSpace: "unset" }
              }
            ]}
            defaultPageSize={10}
            getTrProps={(state, rowInfo, column) => {
              return {
                onClick: e => {
                  this.handleCharityClick(rowInfo.index);
                }
              };
            }}
            className="-striped -highlight"
            style={{
              height: "400px"
            }}
          />
        </CollapseWithHeader>
        <CollapseWithHeader title="Membership Requests" open={true}>
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
                Header: "Organization",
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
                Header: "Verified",
                style: { whiteSpace: "unset" }
              },
              {
                headerClassName: "apply-table-thead",
                accessor: "cause",
                Header: "Role",
                style: { whiteSpace: "unset" }
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            style={{
              height: "400px"
            }}
          />
        </CollapseWithHeader>

        <CollapseWithHeader title="Affiliations" open={true}>
          {this.state.charityDetailsRow[0] !== undefined ? (
            <ReactTable
              data={this.state.charityDetailsRow}
              resolveData={data => {
                return data.map(({ name, verified, role, date }) => {
                  return { name, verified, role, date };
                });
              }}
              columns={[
                {
                  Header: "Active Group",
                  accessor: "mission",
                  style: { whiteSpace: "unset" },
                  show: () =>
                    this.state.charityDetailsRow[0].name === "" ? false : true,
                  Cell: row => (
                    <div className="col text-center">
                      <input
                        className="submit-button"
                        type="submit"
                        value={
                          this.state.representing.id ==
                          this.state.charityDetailsRow[row.index].id
                            ? "+"
                            : "-"
                        }
                        onClick={() => this.changeRepresentation(row.index)}
                      />
                    </div>
                  )
                },
                {
                  Header: "Name",
                  accessor: "name",
                  style: { whiteSpace: "unset", alignItems: "center" }
                },
                {
                  Header: "Verified",
                  accessor: "verified",
                  style: { whiteSpace: "unset" }
                },
                {
                  Header: "Role",
                  accessor: "role",
                  style: { whiteSpace: "unset" }
                },
                {
                  Header: "Date Joined",
                  accessor: "date",
                  style: { whiteSpace: "unset" }
                },
                {
                  Header: "",
                  accessor: "remove",
                  style: { whiteSpace: "unset" },
                  show: () =>
                    this.state.charityDetailsRow[0].name === "" ? false : true,
                  Cell: row => (
                    <div className="col text-center">
                      <input
                        className="submit-button"
                        type="submit"
                        value="Remove"
                        onClick={() => this.removeMember(row.index)}
                      />
                    </div>
                  )
                }
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
              style={{
                height: "400px"
              }}
            />
          ) : (
            ""
          )}
        </CollapseWithHeader>
      </div>
    );
  }
}
export default JoinGroup;
