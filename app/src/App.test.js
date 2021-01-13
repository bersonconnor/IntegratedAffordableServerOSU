import React from "react";
import { mount } from "enzyme";
import App from "./App";

describe("App", () => {
  it("should render without crashing", () => {
    mount(<App />);
  });
});
