import React from "react";
import PropTypes from "prop-types";
import "./scss/template-component.scss";

const TemplateComponent = ({ name }) => {
  return <div>This is a {name}</div>;
};

TemplateComponent.propTypes = {
  /*
   *  This is an example comment for a prop
   */
  name: PropTypes.string
};

TemplateComponent.defaultProps = {
  name: "TemplateComponent"
};

export default TemplateComponent;
