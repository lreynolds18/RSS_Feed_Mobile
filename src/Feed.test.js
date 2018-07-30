import React from "react";
import renderer from "react-test-renderer";
import Feed from "./Feed";

it("renders without crashing", () => {
    const rendered = renderer.create(<Feed />).toJSON();
    expect(rendered).toBeTruthy();
});
