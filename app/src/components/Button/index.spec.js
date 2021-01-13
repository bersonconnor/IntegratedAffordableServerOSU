import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import Button from "./";

const testButtonLabelTest = "TestLabel";

const testButton = (
  <Button buttonLabelText={testButtonLabelTest} kind="primary" type="button" />
);

describe("Button", () => {
  describe("Snapshots", () => {
    it("should match snapshot for default Button", () => {
      expect(renderer.create(testButton).toJSON()).toMatchSnapshot();
    });
  });

  describe("label text", () => {
    it("should render string passed in", () => {
      const wrapper = shallow(testButton);
      expect(wrapper.find("button")).toHaveText(testButtonLabelTest);
    });
  });

  describe("onClick functionality", () => {
    it("should call parent function when button is clicked", () => {
      const mockHandleClick = jest.fn(() => {});
      const wrapper = shallow(
        <Button buttonLabelText="test" handleClickByParent={mockHandleClick} />
      );
      wrapper.find("button").simulate("click");
      expect(mockHandleClick.mock.calls.length).toBe(1);
    });
  });
});
