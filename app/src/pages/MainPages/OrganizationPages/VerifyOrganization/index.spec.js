const verifyOrganization = require('../VerifyOrganization/index');
import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import FormGroup from "./index";
import VerifyOrganization from "../VerifyOrganization/index.js";

const testLabelText = "Test";
const testID = "test";
const testChange = "t";

const createFormGroup = () => (
    <FormGroup labelName={testLabelText} value={testID} handleChange={testChange} />
);

//to handle hash changes in navigation
Object.defineProperty(window.location, 'reload', {
  configurable: true,
});
describe("Handle navigation changes to be configurable with jsdom", () => {
window.location.reload = jest.fn();
it('should mocks window.location.reload call', () => {
  window.location.reload = jest.fn();
  window.location.reload();
  expect(window.location.reload).toHaveBeenCalled();
});
// window.location.reload = jest.fn();
jest.spyOn(window.location, 'reload');
});


//default form group
describe("FormGroups", () => {
  test("should match snapshot for default FormGroup", () => {
    expect(renderer.create(createFormGroup()).toJSON()).toMatchSnapshot();
  });
});



//default verify organization form
describe("Verify Organization Form", () => {
  let wrapper = shallow(<VerifyOrganization />);
  //HeaderTitle should be rendered
  test("should render verify organization form", () => {
    expect(wrapper.find('div').length).toEqual(14);
  });

});
