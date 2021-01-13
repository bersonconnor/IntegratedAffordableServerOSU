const JoinGroup = require('../JoinGroup/index');
import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import FormGroup from "./index";

const testLabelText = "Test";
const testID = "test";
const testChange = "t";

const testAddressLine1 = "987 ";
const testAddressLine2 = "";
const testCity = "Atlanta";
const testState = "Georgia";
const testZip = "30301";

const createFormGroup = () => (
  <FormGroup labelName={testLabelText} value={testID} handleChange={testChange} />
);

//to handle hash changes in navigation
Object.defineProperty(window.location, 'reload', {
  configurable: true,
});
describe("Handle navigation changes to be configurable with jsdom", () => {
window.location.reload = jest.fn();
it('should mock window.location.reload call', () => {
  window.location.reload = jest.fn();
  window.location.reload();
  expect(window.location.reload).toHaveBeenCalled();
});
// window.location.reload = jest.fn();
jest.spyOn(window.location, 'reload');
});


describe("FormGroups", () => {
  describe("Snapshots", () => {
    it("should match snapshot for default FormGroup", () => {
      expect(renderer.create(createFormGroup()).toJSON()).toMatchSnapshot();
    });
  });
});
