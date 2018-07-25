import React from 'react';
import SetFeed from './SetFeed';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<SetFeed />).toJSON();
  expect(rendered).toBeTruthy();
});
