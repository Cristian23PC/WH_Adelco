import React from 'react';
import { render } from '@testing-library/react';
import EntryPoint from './entry-point';

describe('EntryPoint Component', () => {
  it('should render without errors', () => {
    const { container } = render(<EntryPoint />);

    expect(container).toBeInTheDocument();
  });
});
