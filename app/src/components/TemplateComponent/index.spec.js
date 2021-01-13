import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import TemplateComponent from "./";

describe("TemplateComponent", () => {
  describe("Snapshots", () => {
    it("should match snapshot for default TemplateComponent", () => {
      expect(renderer.create(<TemplateComponent />).toJSON()).toMatchSnapshot();
    });
  });
});
