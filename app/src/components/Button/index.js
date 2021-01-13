import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./scss/button.scss";

const Button = ({
  buttonLabelText,
  containerClassName,
  handleClickByParent,
  kind,
  ...props
}) => {
  const handleClick = event => {
    handleClickByParent(event);
  };

  return (
    <div
      className={classNames("button__container", {
        [containerClassName]: containerClassName
      })}
    >
      <button
        className={classNames("button", `button--${kind}`)}
        onClick={handleClick}
        {...props}
      >
        {buttonLabelText}
      </button>
    </div>
  );
};

Button.propTypes = {
  /*
   * Displays text label for button
   */
  buttonLabelText: PropTypes.string.isRequired,
  /*
   * Contains classes to style the container surrounding button
   */
  containerClassName: PropTypes.string,
  /**
   * The style of button to create. Primary buttons correspond with primary actions
   * on a page, secondary and tertiary are, likewise, corresponding to secondary and
   * tertiary actions on a page
   */
  kind: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  /**
   * Logic that handles change event if state is kept
   * in parent node
   */
  handleClickByParent: PropTypes.func
};

Button.defaultProps = {
  containerClassName: undefined,
  handleClickByParent: () => {},
  kind: "primary"
};

export default Button;
