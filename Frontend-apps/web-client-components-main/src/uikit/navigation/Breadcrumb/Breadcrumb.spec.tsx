import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('should render with correct passed data-testid', async () => {
    const dataTestId = 'adelco-breadcrumb';
    render(
      <Breadcrumb
        elements={[
          { label: 'Label 1', url: '#' },
          { label: 'Label 2', url: '#' },
          { label: 'Label 3', url: '#' },
          { label: 'Label 4', url: '#' }
        ]}
      />
    );
    const breadcrumb = await screen.findByTestId(dataTestId);
    expect(breadcrumb).toBeInTheDocument();
  });
});
