import React from 'react';
import Feed from './Feed';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<Feed />).toJSON();
  expect(rendered).toBeTruthy();
});
