import React from "react";
import { shallow, configure } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";

import Settings from "./Settings";

configure({ adapter: new Adapter() });

describe("Test UI", () => {
    let component;

    beforeEach(() => {
        component = shallow(<Settings />);
    });

    it("renders without crashing", () => {
        expect(component).toBeTruthy();
    });
});
