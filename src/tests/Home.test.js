import React from 'react';
import { shallow , mount , render } from 'enzyme';
import Enzyme from 'enzyme'
import Home from '../Components/Home';
import Adapter from 'enzyme-adapter-react-16';
 
Enzyme.configure({ adapter: new Adapter() });
describe("Home Component Snapshot", () => {
  it("should render my component", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("Home Component State Change ", () => {
  it("should set radio button value for launch success true", () => {
    const component = shallow(<Home />);
    component.find('#launchSuccesstrue').at(0).simulate('click',{ target: { name: 'launchSuccess', value: 'true' } });
    expect(component.state('launchSuccess')).toBe('true')
  });
  it("should set radio button value for launch success false", () => {
    const component = shallow(<Home />);
    component.find('#launchSuccessfalse').at(0).simulate('click',{ target: { name: 'launchSuccess', value: 'false' } });
    expect(component.state('launchSuccess')).toBe('false')
  });
});