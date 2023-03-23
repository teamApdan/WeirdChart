import React from 'react';
import { render } from '@testing-library/react';

import RatioBarChart from './RatioBarChart';

describe('RatioBarChart', () => {
  test('renders the RatioBarChart component', () => {
    render(<RatioBarChart dataset={[]} />);
  });
});
