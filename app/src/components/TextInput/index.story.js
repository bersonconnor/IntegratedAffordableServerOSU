import React from "react";
import { storiesOf } from "@storybook/react";
import TextInput from "./index";

storiesOf("TextInput", module)
  .add("default", () => <TextInput labelText="Username" id="username" />)
  .add("controlled", () => (
    <TextInput
      labelText="Username"
      id="username"
      parentValue="VALUE SHOULD NOT CHANGE"
    />
  ));
