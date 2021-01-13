import React, { Component } from "react";
import swal from "sweetalert";
import { ProfileFields } from "affordable-shared-models";
import "./scss/profile.scss";
import { AffordableClient, AffordableHttpError } from "affordable-client";
import CollapseWithHeader from "../../../components/CollapseWithHeader";
import { Input, Select, SelectOption } from "./FormComponents";
import { FormValidation } from "./FormValidation";
import moment from "moment";
import states from "./data/states.json";
import { UserInfoProps } from "../../../App";

class FormProps {
  name: string;
  handleSubmit: (any) => void;
  children: React.ReactNode;
}

class Form extends Component<FormProps, {}> {
  constructor(props) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <form name={this.props.name} onSubmit={this.props.handleSubmit}>
        {this.props.children}
        <input className="submit-button" type="submit" value="Submit" />
      </form>
    );
  }
}

interface ProfileFormState {
  loading: boolean;
  isFilledOut: boolean;
  verified: boolean;
  // Legal Name Form
  primaryFirstName: string;
  primaryMiddleName: string;
  primaryLastName: string;
  primarySuffix?: string;

  // Birth date
  dateOfBirth: string;

  // Address
  streetAddress: string;
  cityAddress: string;
  stateAddress: string;
  zipCode: string;

  // Phone and language
  primaryPhone: string;
}

interface ProfileFormProps {
  userId: number;
  client: AffordableClient;
}

function convertProfileToFormState(
  profile: ProfileFields.Profile
): ProfileFormState {
  const formState = {
    isFilledOut: false
  } as ProfileFormState;

  formState.primaryFirstName = profile.legalNames[0]?.firstName;
  formState.primaryMiddleName = profile.legalNames[0]?.middleName ?? "";
  formState.primaryLastName = profile.legalNames[0]?.lastName;
  if (profile.legalNames[0] && profile.legalNames[0].suffix === undefined) {
    formState.primarySuffix = "None";
  } else {
    formState.primarySuffix = profile.legalNames[0]?.suffix;
  }

  if (profile.birthDate) {
    formState.dateOfBirth = moment(profile.birthDate).format("YYYY-MM-DD");
  }

  if (profile.address) {
    formState.streetAddress = profile.address.street ?? "";
    formState.cityAddress = profile.address.city ?? "";
    formState.stateAddress = profile.address.state ?? "";
    formState.zipCode = profile.address.zip ?? "";
  }

  if (profile.phoneNumbers) {
    formState.primaryPhone = profile.phoneNumbers[0] ?? "";
  } else {
    formState.primaryPhone = "";
  }

  return formState;
}

function convertFormStateToProfile(
  state: ProfileFormState
): ProfileFields.Profile {
  const profile = new ProfileFields.Profile();
  profile.legalNames = [];
  const primaryName = new ProfileFields.LegalName();
  primaryName.firstName = state.primaryFirstName;
  primaryName.middleName = state.primaryMiddleName;
  primaryName.lastName = state.primaryLastName;
  if (state.primarySuffix) {
    primaryName.suffix = ProfileFields.Suffix[state.primarySuffix];
  }
  primaryName.currentName = true;
  profile.legalNames.push(primaryName);

  if (state.dateOfBirth !== null) {
    profile.birthDate = state.dateOfBirth;
  }

  profile.address = new ProfileFields.Address();
  profile.address.street = state.streetAddress;
  profile.address.city = state.cityAddress;
  profile.address.state = state.stateAddress;
  profile.address.zip = state.zipCode;

  profile.phoneNumbers = new Array<string>();
  profile.phoneNumbers.push(state.primaryPhone);
  return profile;
}

class ProfileForm extends Component<ProfileFormProps, ProfileFormState> {
  private _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isFilledOut: false,
      verified: false,
      // Legal names
      primaryFirstName: "",
      primaryMiddleName: "",
      primaryLastName: "",
      primarySuffix: "",

      // Birth date
      dateOfBirth: "",

      // Address
      streetAddress: "",
      cityAddress: "",
      stateAddress: "",
      zipCode: "",

      // Phone number
      primaryPhone: "",
      // secondaryPhone: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(): void {
    this._isMounted = true;
    this.props.client.getProfile(this.props.userId)
      .then((profile: ProfileFields.Profile) => {
        const newState = convertProfileToFormState(profile);
        if (this._isMounted) {
          this.setState(newState);
        }
      })
      .catch(error => {
        if (error instanceof AffordableHttpError) {
          console.log(error as AffordableHttpError);
        }
      });
    this.setState({ loading: false });
    // this.setState(this.state);
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }
  handleSubmit(event: React.ChangeEvent): void {
    event.preventDefault();

    let i = 0;
    let isValid = true;
    const data = new FormData();
    while (event.target[i].type !== "submit") {
      const fieldIsValidOrOptional =
        event.target[i].className.includes("is-valid") ||
        event.target[i].className.includes("optional");
      if (!fieldIsValidOrOptional) {
        event.target[i].className = "form-control is-invalid";
      }
      isValid = isValid && fieldIsValidOrOptional;
      data.append(event.target[i].name, event.target[i].value);
      i++;
    }
    this.setState({ isFilledOut: isValid });
    if (isValid) {
      // isValid
      console.log("State:");
      console.log(this.state);
      console.log("Profile:");
      console.log(convertFormStateToProfile(this.state));

      this.props.client.createProfile(
        convertFormStateToProfile(this.state)
      )
        .then(() => {
          swal(
            "Profile Saved",
            "Your profile has successfully been saved",
            "success"
          );
        })
        .catch(error => {
          console.log(error);
          swal(
            "There was an error saving your profile",
            error.message,
            "error"
          );
        });
    } else {
      swal(
        "Can't complete your profile",
        "Verify that all required fields are filled out",
        "error"
      );
    }
  }

  render(): React.ReactNode {
    return (
      <div className="col">
        {/* <Prompt
          when={!this.state.isFilledOut}
          message="Are you sure you want to leave this page? All unsaved data will be lost."
        /> */}
        {/* <h1>Profile</h1> */}
        {this.state.loading ? (
          "Loading..."
        ) : (
          <Form
            name="ProfileForm"
            handleSubmit={this.handleSubmit}
            key="Profile-Form"
          >
            <CollapseWithHeader
              key="legal-name-form"
              title="Legal Name"
              open={true}
            >
              <Input
                key="primary-first-name-input"
                inputType={"text"}
                title={"First Name"}
                name={"given-name"}
                placeholder={"Enter your first name"}
                value={this.state.primaryFirstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ primaryFirstName: e.target.value });
                }}
                validationFunction={FormValidation.validIfNonEmpty}
              />
              <Input
                key="primary-middle-name-input"
                inputType={"text"}
                title={"Middle Name"}
                name={"additional-name"}
                placeholder={"Enter your middle name"}
                value={this.state.primaryMiddleName}
                optional={true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.setState({ primaryMiddleName: e.target.value });
                }}
              />
              <Input
                key="primary-last-name-input"
                inputType={"text"}
                title={"Last Name"}
                name={"family-name"}
                placeholder={"Enter your last name"}
                value={this.state.primaryLastName}
                onChange={e => {
                  this.setState({ primaryLastName: e.target.value });
                }}
                validationFunction={FormValidation.validIfNonEmpty}
              />
              <Select
                key="primary-suffix-input"
                title={"Suffix"}
                name={"honorific-suffix"}
                choices={[
                  { value: "None", text: "None" },
                  { value: ProfileFields.Suffix.JR, text: "Jr" },
                  { value: ProfileFields.Suffix.SR, text: "Sr" },
                  { value: ProfileFields.Suffix.THIRD, text: "III" },
                  { value: ProfileFields.Suffix.FOURTH, text: "IV" }
                ]}
                value={this.state.primarySuffix}
                placeholder={"Select Suffix"}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  this.setState({ primarySuffix: e.target.value });
                }}
              />
            </CollapseWithHeader>

            <CollapseWithHeader
              key="date-of-birth-form"
              title="Birthdate"
              open={true}
            >
              <Input
                key="date-of-birth-input"
                inputType={"date"}
                title={"Date of Birth"}
                name={"birthdate"}
                placeholder={"Enter your birthday"}
                value={this.state.dateOfBirth}
                validationFunction={FormValidation.validIfNonEmpty}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  this.setState({ dateOfBirth: e.target.value });
                }}
              />
            </CollapseWithHeader>

            <CollapseWithHeader key="address-form" title="Address" open={true}>
              <Input
                key="street-address-input"
                inputType={"text"}
                title={"Street"}
                name={"streetAddress"}
                placeholder={"Enter your Street"}
                value={this.state.streetAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  this.setState({ streetAddress: e.target.value });
                }}
                validationFunction={FormValidation.validIfNonEmpty}
              />
              <Input
                key={"city-address-input"}
                inputType={"text"}
                title={"City"}
                name={"cityAddress"}
                placeholder={"Enter your City"}
                value={this.state.cityAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  this.setState({ cityAddress: e.target.value });
                }}
                validationFunction={FormValidation.validIfNonEmpty}
              />
              <Select
                key={"state-address-input"}
                title={"State"}
                name={"stateAddress"}
                choices={states.map(
                  (s): SelectOption => {
                    return { text: s.name, value: s.abbreviation };
                  }
                )}
                placeholder={"Select State"}
                value={this.state.stateAddress}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                  this.setState({ stateAddress: e.target.value });
                }}
              />
              <Input
                key="zip-code-input"
                inputType={"number"}
                title={"Zip Code"}
                name={"zipCode"}
                placeholder={"Enter your Zip Code"}
                value={this.state.zipCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  this.setState({ zipCode: e.target.value });
                }}
                validationFunction={value => {
                  return (
                    FormValidation.validIfOfLength(value, 5) ||
                    FormValidation.validIfOfLength(value, 9)
                  );
                }}
              />
            </CollapseWithHeader>

            <CollapseWithHeader
              key="phone-language-form"
              title="Phone Number"
              open={true}
            >
              <Input
                inputType={"number"}
                title={"Primary Phone"}
                name={"primaryPhone"}
                placeholder={"Enter Your Primary Phone Number"}
                value={this.state.primaryPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  this.setState({ primaryPhone: e.target.value });
                }}
                validationFunction={value =>
                  FormValidation.validIfOfLength(value, 10)
                }
                // error="Phone Numbers should be 10 digits long"
              />
            </CollapseWithHeader>
          </Form>
        )}
      </div>
    );
  }
}
export default ProfileForm;
