import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./scss/text-input.scss";

const TextInput = ({
  containerClassName,
  handleChangeByParent,
  id,
  labelText,
  password,
  parentValue
}) => {
  const [hasValue, setHasValue] = useState(parentValue ? true : false);
  const [hasFocus, setHasFocus] = useState(false);
  const [componentValue, setComponentValue] = useState("");

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  const handleChange = event => {
    parentValue !== undefined
      ? handleChangeByParent(event)
      : setComponentValue(event.target.value);

    event.target.value ? setHasValue(true) : setHasValue(false);
  };

  return (
    <div className={classNames("text-input__container", containerClassName)}>
      <input
        className={classNames("text-input", {
          "text-input--has-value": hasValue
        })}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        id={id}
        type={password ? "password" : "text"}
        value={parentValue || componentValue}
      />
      <label
        htmlFor={id}
        className={classNames("text-input__label", {
          "text-input__label--inline": !hasValue && !hasFocus,
          "text-input__label--float": hasFocus || hasValue,
          "text-input__label--float--focused": hasFocus
        })}
      >
        {labelText}
      </label>
    </div>
  );
};

TextInput.propTypes = {
  /**
   * Class to be applied to the container of TextInput.
   * Typically used for resizing TextInput
   */
  containerClassName: PropTypes.string,
  /**
   * Logic that handles change event if state is kept
   * in parent node
   */
  handleChangeByParent: PropTypes.func,
  /**
   * ID of the TextInput
   * (NOT INTENDED FOR STYLING)
   */
  id: PropTypes.string.isRequired,
  /**
   * Text shown by the label
   */
  labelText: PropTypes.string.isRequired,
  /**
   * If `true`, text typed in by user will be hidden
   */
  password: PropTypes.bool,
  /**
   * Value passed in if state is handled by parent
   * node
   */
  parentValue: PropTypes.string
};

TextInput.defaultProps = {
  containerClassName: undefined,
  handleChangeByParent: () => {},
  password: false,
  parentValue: undefined
};

export default TextInput;
