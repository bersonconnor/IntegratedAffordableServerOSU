import React, {Component} from "react";
import "./scss/sidebar.scss";
import swal from "sweetalert";
import {OrganizationMembership} from "affordable-shared-models";
import {AffordableClient} from "affordable-client";

interface RepresentingOrganizationProps {
  userId: number;
  representedOrganization: OrganizationMembership;
  updateOrganizationFn: (organization: OrganizationMembership) => void;
  client: AffordableClient;
}

interface RepresentingOrganizationState {
  organizationOptions: Array<OrganizationMembership>;
}

/**
 * This component provides a select box that shows all of the user's organizations. When the user
 * selects an organization, they will be "representing" or acting on behalf of that organization.
 */
class RepresentingOrganization extends Component<
  RepresentingOrganizationProps,
  RepresentingOrganizationState
> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      organizationOptions: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(): void {
    // Get organizations for user.
    if (this.props.userId != null) {
      this.props.client.getOrganizationsForUser(this.props.userId).then(
        (organizations: Array<OrganizationMembership>) => {
          this.setState({ organizationOptions: organizations });
        }
      );
    }

    if (!window.location.hash) {
      // using reload() method to reload web page
      window.location.assign(window.location + "#loaded");
    }
  }

  /*Handle Event Functions*/
  handleChange(event): void {
    if (event.target.value === "unverified" || event.target.value === "") {
      swal(
        "Once your organizations have been verified, you will be eligible to create a HUG",
        "",
        "warning"
      ).then(function(isConfirm) {
        if (isConfirm) {
          window.location.replace("http://localhost:3000/organization");
        } else {
          //if no clicked => do something else
        }
      });
    } else {
      swal("You are representing", event.target.value, "success").then(function(
        isConfirm
      ) {
        if (isConfirm) {
          window.location.assign(window.location.toString());
        } else {
          //if no clicked => do something else
        }
      });
    }
    console.log(this.state.organizationOptions);
    const result = this.state.organizationOptions.filter(
      organizationMembership => {
        return organizationMembership.organization.id === Number.parseInt(event.target.value);
      }
    )[0];
    console.log("Representing:")
    console.log(result);
    this.props.updateOrganizationFn(result);
  }

  handleSubmit(e): void {
    e.preventDefault();
  }

  render(): React.ReactNode {
    return (
      <div>
        <form className="col" onSubmit={this.handleSubmit}>
          <label>Representing</label>
          <select
            id="representing"
            className="form-control"
            onChange={this.handleChange}
          >
            <option value="" disabled selected>
              Select Organization...
            </option>
            {this.state.organizationOptions?.map(
              (organization: OrganizationMembership) => {
                return (
                  <option
                    key={
                      "RepresentingOrganizationOption-" +
                      organization.organization?.id
                    }
                    id={organization.organization?.id?.toString()}
                    value={organization.organization?.id}
                  >
                    {organization.organization?.name}
                  </option>
                );
              }
            )}{" "}
            <option value="unverified">No Verified Orgs</option>
          </select>
        </form>
      </div>
    );
  }
}

export default RepresentingOrganization;
