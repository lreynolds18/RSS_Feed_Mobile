import React from "react";
import renderer from "react-test-renderer";
import Settings from "./Settings";

it("renders without crashing", () => {
    const rendered = renderer.create(<Settings />).toJSON();
    expect(rendered).toBeTruthy();
});
