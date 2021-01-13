import React, { useState } from "react";
import Enzyme, { shallow, mount} from "enzyme";
import Purpose from './index.js';
import Eligibility from './index';
import Fundraising from './index';
import Information from './index';
import InformationFormGroup from './information';
import DiagnosisFormGroup from './purpose';
import PrescriptionFormGroup from './purpose';
import HugSearch from './HugSearch';
import Manage from './manage';
import renderer from 'react-test-renderer';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom'
import Selection from "../../ApplyPages/Selection/index.test";
import TextInput from "../../../../components/TextInput/index.spec";


//should handle hash changes in navigation
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


//should render default Purpose page
describe("Purpose page", () => {
  test("should render default Purpose page", () => {
    const wrapper = shallow(<Purpose />);
    expect(wrapper.find('div').length).toEqual(3);
  });
}
);

//should render default HugSearch page
describe("HugSearch page", () => {
  test("should render default Hug Search page", () => {
    const component = mount(<HugSearch />);
    expect (component).toMatchSnapshot();
  });
}
);

//should render default HugSearch page
describe("HugSearch page", () => {
      test("should render default Hug Search page", () => {
        let wrapper = shallow(<HugSearch/>);
        expect(wrapper.find('div').length).toEqual(16);
      });
    }
);

//should render search result for HugSearch page
describe("Hug Search Page - Handle Search Functionality", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<HugSearch />));

  it("should render results for the entered hug", () => {
    const wrapper = shallow(<HugSearch />);
    wrapper.setProps({hugName: "test"});
    let button = wrapper.find("button").at(0);
    expect(button.exists()).toEqual(true);
    button.simulate("click");
    expect(wrapper).toMatchSnapshot();
  });

  it("should render results when no entered hug", () => {
    const wrapper = shallow(<HugSearch />);
    let button = wrapper.find("button").at(0);
    expect(button.exists()).toEqual(true);
    button.simulate("click");
    expect(wrapper).toMatchSnapshot();
  });
});


//should handle conditional rendering for specific illness
describe("Purpose page - conditional rendering for specific illness", () => {

  test("should render add diagnosis when yes is selected", () => {
    let hasDiagnosis = 1;
    const component = mount(<Purpose hasDiagnosis="1"/>);
    expect (component).toMatchSnapshot();
  });
});

//should handle conditional rendering for specialtyCare
describe("Purpose page - conditional rendering for specialtyCare", () => {

  test("should render primary care options when primary care is selected", () => {
    let medCat = "Specialty Care";
    const component = mount(<Purpose medCat="Specialty Care"/>);
    expect (component).toMatchSnapshot();
  });
});



//should handle conditional rendering for specific prescriptions
describe("Purpose page - conditional rendering for specific prescription", () => {
  const testProps ={
    hasDiagnosis: "yes"
  };
  test("should render add prescription when yes is selected", () => {
    const component = mount(<Purpose hasPrescriptions="1" />);
    expect (component).toMatchSnapshot();
  });
});

//should have matching structure
describe("Purpose page - Diagnosis Form Group", () => {

  test("should have correct diagnosis structure", () => {
    const formgroup = shallow(<DiagnosisFormGroup name="Cold" handleChange=""/>);
    expect (formgroup).toMatchSnapshot();
  });
});


//should have matching structure
describe("Purpose page - Prescription Form Group", () => {

  test("should have correct diagnosis structure", () => {
    const formgroup = shallow(<PrescriptionFormGroup name="Medicine" handleChange=""/>);
    expect (formgroup).toMatchSnapshot();
  });
});


//should render default Eligibility page
describe("Eligibility page", () => {
  test("should render default Eligibility page", () => {
    const wrapper = shallow(<Eligibility />);
    expect(wrapper.find('div').length).toEqual(3);
  });
});

//should handle conditional rendering for age less than
describe("Eligibility page - conditional rendering for specialtyCare", () => {

  test("should disable field when less than is selected", () => {
    let age = "Less than";
    const component = mount(<Eligibility age="Less than"/>);
    expect (component).toMatchSnapshot();
  });
});

//should handle conditional rendering for distance from location
describe("Eligibility page - conditional rendering for distance from location", () => {

  test("should enable field when distance from location is selected", () => {
    let location = "Less than";
    const component = mount(<Eligibility location="Distance From Location"/>);
    expect (component).toMatchSnapshot();
  });
});



//should handle conditional rendering for age less than
describe("Eligibility page - conditional rendering for specialtyCare", () => {

  test("should disable field when less than is selected", () => {
    let age = "Less than";
    const component = mount(<Eligibility age="Less than"/>);
    expect (component).toMatchSnapshot();
  });
});


//should handle conditional rendering for income
describe("Eligibility page - conditional fields for income", () => {

  test("should disable fields when federal poverty level is selected", () => {
    let income = "Federal Poverty Level";
    const component = mount(<Eligibility income="Federal Poverty Level"/>);
    expect (component).toMatchSnapshot();
  });
});

//should handle conditional rendering for dependents
describe("Eligibility page - conditional fields for dependents", () => {

  test("should disable fields when dependents greater than", () => {
    let dependents = "Greater Than";
    const component = mount(<Eligibility dependents="Greater Than"/>);
    expect (component).toMatchSnapshot();
  });
});

//should render default Fundraising page
describe("Fundraising page", () => {
  test("should render default Fundraising page", () => {
    const wrapper = shallow(<Fundraising />);
    expect(wrapper.find('div').length).toEqual(3);
  });
});

//should render default Information page
describe("Information page", () => {
  test("should render default Information page", () => {
    const wrapper = shallow(<Information />);
    expect(wrapper.find('div').length).toEqual(3);
  });
});

//should handle conditional rendering for specific document
describe("Information page - conditional rendering for specific document", () => {

  test("should render add document when yes is selected", () => {
    let documentationNeeded = 1;
    const component = mount(<Information documentationNeeded="1"/>);
    expect (component).toMatchSnapshot();
  });
});

//should handle conditional rendering for specific document
describe("Information page - conditional rendering for specific document", () => {

  test("should render add document when yes is selected", () => {
    let medicalInfoNeeded = 1;
    const component = mount(<Information medicalInfoNeeded="1"/>);
    expect (component).toMatchSnapshot();
  });
});

//should have matching text to name attribute
describe("Information page - Information Form Group Text", () => {

  test("should have text that matches name parameter", () => {
    const formgroup = mount(<InformationFormGroup name="Medical History" handleChange="" key="1" />);
    expect (formgroup).toMatchSnapshot();
  });
});


//should render default HugManage page
describe("HugManage page", () => {
      test("should render default Hug Manage page", () => {
        let wrapper = mount(<Manage />);
        expect(wrapper).toMatchSnapshot();
      });
    }
);



//testing card results for hug manage page
describe("HugManage Page - testing numPeopleDonated, fundingStatus, manage grantfields for a HUG ", () => {
      //props for test case
      let grantProps = [{
        grant:
            {
              ID: 1000,
              dateEnd: "7/19/2018",
              dateStart: "11/8/2014",
              fundingPerPerson: null,
              fundingStatus: 120,
              grantAmount: 250,
              grantBudget: null,
              grantCategory: "Medical Care",
              grantDistribution: null,
              grantName: "HUGtest",
              hasDiagnosis: null,
              hasPrescription: null,
              medicalCategory: "Primary Care",
              numPeopleDonated: "1",
              numberSupported: null,
              orgID: 1000,
              ownerSelectsCandidate: null,
              specialtyCare: "None"
            }
      }];

      let createHugManage = {grants: grantProps};
      test("should render Hug Manage results for props", () => {
        let component = mount(<Manage {...createHugManage} />);
        expect(component).toMatchSnapshot();
      });




      //props for test case
      grantProps = [{
        grant:
            {
              ID: 1000,
              dateEnd: "7/19/2018",
              dateStart: "11/8/2014",
              fundingPerPerson: null,
              fundingStatus: 200,
              grantAmount: 250,
              grantBudget: null,
              grantCategory: "Medical Care",
              grantDistribution: null,
              grantName: "HUGTEST",
              hasDiagnosis: null,
              hasPrescription: null,
              medicalCategory: "Primary Care",
              numPeopleDonated: "0",
              numberSupported: null,
              orgID: 1000,
              ownerSelectsCandidate: null,
              specialtyCare: "None"
            }
      }];

      let props = {grants: grantProps};
      test("should render Hug Manage results for props", () => {
        let component = mount(<Manage {...props} />);
        expect(component).toMatchSnapshot();
      });


      //props for test case
      grantProps = [{
        grant:
            {
              ID: 1001,
              dateEnd: "7/19/2018",
              dateStart: "11/8/2014",
              fundingPerPerson: null,
              fundingStatus: 700,
              grantAmount: 700,
              grantBudget: null,
              grantCategory: "Medical Care",
              grantDistribution: null,
              grantName: "HUGTEST",
              hasDiagnosis: null,
              hasPrescription: null,
              medicalCategory: "Primary Care",
              numPeopleDonated: "0",
              numberSupported: null,
              orgID: 1000,
              ownerSelectsCandidate: null,
              specialtyCare: "None"
            }
      }];

      props ={grants: grantProps};

      // let props = grants;
      test("should render Hug Manage results for props", () => {
        let component = mount(<Manage {...props} />);
        expect(component).toMatchSnapshot();
      });
    }


);
