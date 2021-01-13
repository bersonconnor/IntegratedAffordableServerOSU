import React, { Component, ChangeEvent, ChangeEventHandler } from "react";

enum ValidStatus {
  VALID, // e.g. this field is valid
  INVALID, // e.g. this field is invalid
  UNCHECKED // e.g. this field has not been checked and will not be checked until input is provided
}

export interface InputProps {
  name: string;
  title: string;
  inputType: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  optional: boolean;
  validationFunction?: (value) => boolean;
}

interface InputState {
  value: string;
  isValid: ValidStatus;
  hasBeenModified: boolean;
}

export class Input extends Component<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);

    this.state = {
      isValid: ValidStatus.UNCHECKED,
      value: this.props.value,
      hasBeenModified: false
    };

    this.onChange = this.onChange.bind(this);
    this.getClassName = this.getClassName.bind(this);
  }

  public static defaultProps: Partial<InputProps> = {
    optional: false
  };

  getClassName(): string {
    let className = "form-control";
    if (this.props.optional) {
      className += " optional";
    }
    if (this.state.hasBeenModified) {
      switch (this.state.isValid) {
        case ValidStatus.VALID:
          className += " is-valid";
          break;
        case ValidStatus.INVALID:
          className += " is-invalid";
          break;
        case ValidStatus.UNCHECKED:
          break;
      }
    }
    return className;
  }

  onChange(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.target.value);
    let validStatus: ValidStatus;
    if (this.props.validationFunction !== undefined) {
      validStatus = this.props.validationFunction(event.target.value)
        ? ValidStatus.VALID
        : ValidStatus.INVALID;
    } else {
      validStatus = ValidStatus.UNCHECKED;
    }
    this.setState({
      value: event.target.value,
      isValid: validStatus,
      hasBeenModified: true
    });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  shouldComponentUpdate(
    nextProps: Readonly<InputProps>,
    nextState: Readonly<InputState>
  ): boolean {
    if (nextProps.value !== this.state.value) {
      return true;
    }
    return (
      this.state.value !== nextState.value ||
      this.state.isValid !== nextState.isValid
    );
  }

  componentDidUpdate(prevProps: Readonly<InputProps>): void {
    this.onChange({ target: { value: this.props.value } } as Pick<
      ChangeEvent<HTMLInputElement>,
      keyof ChangeEvent<HTMLInputElement>
    >);
  }

  render(): React.ReactNode {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name} className="form-label">
          {this.props.title + (this.props.optional ? " (Optional)" : "")}
        </label>
        <input
          className={this.getClassName()}
          id={this.props.name}
          name={this.props.name}
          type={this.props.inputType}
          placeholder={this.props.placeholder}
          // defaultValue={this.props.value}
          value={this.state.value}
          onChange={this.onChange}
        />
        <div className="invalid-feedback">{`REQUIRED: ${this.props.placeholder}`}</div>
      </div>
    );
  }
}

interface SelectState {
  value: string;
  isValid: ValidStatus;
  hasBeenModified: boolean;
}

export interface SelectOption {
  value: string | undefined;
  text: string;
}

export interface SelectProps {
  name: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  optional: boolean;
  choices: Array<string | SelectOption>;
}

export class Select extends Component<SelectProps, SelectState> {
  constructor(props: SelectProps) {
    super(props);

    this.state = {
      isValid: ValidStatus.UNCHECKED,
      value: this.props.value,
      hasBeenModified: false
    };

    this.onChange = this.onChange.bind(this);
    this.getClassName = this.getClassName.bind(this);
  }

  public static defaultProps: Partial<SelectProps> = {
    optional: false
  };

  shouldComponentUpdate(
    nextProps: Readonly<SelectProps>,
    nextState: Readonly<SelectState>
  ): boolean {
    if (nextProps.value !== this.state.value) {
      return true;
    }
    return (
      this.state.value !== nextState.value ||
      this.state.isValid !== nextState.isValid
    );
  }

  componentDidUpdate(): void {
    this.onChange({ target: { value: this.props.value } } as Pick<
      ChangeEvent<HTMLSelectElement>,
      keyof ChangeEvent<HTMLSelectElement>
    >);
  }

  getClassName(): string {
    let className = "form-control";
    if (this.props.optional) {
      className += " optional";
    }
    switch (this.state.isValid) {
      case ValidStatus.VALID:
        className += " is-valid";
        break;
      case ValidStatus.INVALID:
        className += " is-invalid";
        break;
      case ValidStatus.UNCHECKED:
        break;
    }
    return className;
  }

  onChange(event: ChangeEvent<HTMLSelectElement>): void {
    console.log("onChange");
    this.setState({
      value: event.target.value,
      isValid:
        this.state.value !== this.props.placeholder
          ? ValidStatus.VALID
          : ValidStatus.INVALID,
      hasBeenModified: true
    });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  render(): React.ReactNode {
    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>
          {this.props.title + (this.props.optional ? " (Optional)" : "")}
        </label>
        <select
          id={this.props.name}
          name={this.props.name}
          value={this.state.value}
          onChange={this.onChange}
          className={this.getClassName()}
        >
          <option value="" disabled>
            {this.props.placeholder}
          </option>
          {this.props.choices.map(choice => {
            /**
             * If it's an object, look at the value and text fields.
             * If it's a primitive, then both the value and text/label are the primitive
             */
            if (typeof choice === "object") {
              return (
                <option value={choice.value} label={choice.text}>
                  {choice.text}
                </option>
              );
            } else {
              return (
                <option value={choice} label={choice}>
                  {choice}
                </option>
              );
            }
          })}
        </select>
        <div className="invalid-feedback">{`REQUIRED: ${this.props.placeholder}`}</div>
      </div>
    );
  }
}
