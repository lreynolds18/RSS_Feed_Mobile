import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";

import App from './App';

configure({ adapter: new Adapter() });

describe("Test UI", () => {
    let component;

    beforeEach(() => {
        component = mount(<App />);
    });

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
