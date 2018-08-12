import React from "react";
import renderer from "react-test-renderer";

import Comments from "./Comments";

describe("", () => {
    it("renders without crashing", () => {
        const rendered = renderer.create(<Comments />).toJSON();
        expect(rendered).toBeTruthy();
    });
});
