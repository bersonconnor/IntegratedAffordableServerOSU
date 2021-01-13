import React, { Component } from "react";
import ReactTable from "react-table";
import { AffordableClient } from "affordable-client";
import CollapseWithHeader from "../../../components/CollapseWithHeader";

import "../Settings/scss/settings.scss";
import "./scss/filemanager.scss";
import "../../../styles/buttons.css";

import { UserType } from "affordable-shared-models";
import FMS from "./filemanager/src/FMS.js";

class Filemanager extends Component {
	constructor(props) {
    		super(props);
 		this.client = new AffordableClient();
  		this.state = {
      			userID: this.props.userId,
      			username: this.props.user,
      			usertype: this.props.userType
    		};
	}
	// Render the filemanager as a column to ensure that it fits properly within the page
	render() {
		return (
			<div className="col">
				<FMS />
			</div>
		)};
}
export default Filemanager;

