import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge', () => {
  it('should render the badge with the default size', () => {
    const testId = 'adelco-badge';
    const sizeClass = 'p-1';
    render(<Badge>-25%</Badge>);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(sizeClass);
  });

  it('should render the badge with the size sm', () => {
    const testId = 'adelco-badge';
    const sizeClass = 'p-1';
    render(<Badge size="sm">-25%</Badge>);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).not.toHaveClass(sizeClass);
  });
});
