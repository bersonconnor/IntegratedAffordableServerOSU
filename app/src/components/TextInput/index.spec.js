import React, { useState } from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import TextInput from "./";

const testLabelText = "Test";
const testID = "test";

const createTextInput = (props = {}) => (
  <TextInput labelText={testLabelText} id={testID} {...props} />
);

describe("TextInput", () => {
  describe("Snapshots", () => {
    it("should match snapshot for default TextInput", () => {
      expect(renderer.create(createTextInput()).toJSON()).toMatchSnapshot();
    });

    it("should match snapshot for password TextInput", () => {
      expect(
        renderer.create(createTextInput({ password: true })).toJSON()
      ).toMatchSnapshot();
    });
  });

  describe("Controlled vs Uncontrolled", () => {
    const testString = "Test String";

    it("should handle its own state when no parentValue passed in - uncontrolled", () => {
      const wrapper = shallow(createTextInput());
      wrapper
        .find("input")
        .simulate("change", { target: { value: testString } });
      expect(wrapper.find("input")).toHaveValue(testString);
    });

    it("should not change value when parentValue passed in - controlled", () => {
      const wrapper = shallow(createTextInput({ parentValue: testString }));
      wrapper.find("input").simulate("change", { target: { value: "EEP" } });
      expect(wrapper.find("input")).toHaveValue(testString);
    });

    it("should change parent's state when handleChangeByParent passed in - controlled", () => {
      const ParentComponent = () => {
        const [value, setValue] = useState("");

        const handleChange = event => {
          setValue(event.target.value);
        };

        return (
          <div>
            {createTextInput({
              parentValue: value,
              handleChangeByParent: handleChange
            })}
            <p>{value}</p>
          </div>
        );
      };

      const wrapper = shallow(<ParentComponent />);

      wrapper
        .find(TextInput)
        .dive()
        .find("input")
        .simulate("change", { target: { value: testString } });

      expect(wrapper.find("p")).toHaveText(testString);
    });
  });
});
