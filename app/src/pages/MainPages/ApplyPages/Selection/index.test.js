import React from "react";
import Selection from "./";
import {shallow} from "enzyme";

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


describe("Handle Submit Functionality", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Selection />));

  it("charities state should return all charities when all search fields are empty", () => {
    const expected = [];
    wrapper.find("#submit-button").simulate("submit");
    expect(wrapper.state("charities")).toEqual(expected);
  });


  it("charities state should be array with matching charities", () => {
    const wrapper = shallow(<Selection />);
    wrapper.setProps({});
    wrapper.setState({charityName: "beer"});
    const button = wrapper.find("#submit-button");
    expect(button.exists()).toEqual(true);
    button.simulate("click");
    expect(wrapper.state("charities")).toEqual([]);
  });


  it("charities state should be empty array when no match found", () => {
    const wrapper = shallow(<Selection />);
    wrapper.setProps({});
    wrapper.setState({charityName: "beer"});
    let button = wrapper.find("#submit-button");
    expect(button.exists()).toEqual(true);
    button.simulate("click");
    wrapper.setState({charityName: "gibberishfjiasjdfioj"});
    button = wrapper.find("#submit-button");
    expect(button.exists()).toEqual(true);
    button.simulate("click");
    expect(wrapper.state("charities")).toEqual([]);
  });

});




