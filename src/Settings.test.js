import React from 'react';
import Settings from './Settings';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<Settings />).toJSON();
  expect(rendered).toBeTruthy();
});
