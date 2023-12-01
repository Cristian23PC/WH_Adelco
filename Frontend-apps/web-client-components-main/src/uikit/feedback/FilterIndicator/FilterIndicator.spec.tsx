import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterIndicator from './FilterIndicator';

describe('FilterIndicator', () => {
  it('should render with default quantity and no label', () => {
    render(<FilterIndicator quantity={0} />);

    const indicator = screen.getByText('0');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('p-[1px] text-xs min-w-[18px] rounded-3xl');
  });

  it('should render with quantity and label', () => {
    render(<FilterIndicator quantity={5} label="items" />);

    const indicator = screen.getByText('5 items');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('py-[1px] px-2');
  });

  it('should render with quantity and empty label', () => {
    render(<FilterIndicator quantity={10} label="" />);

    const indicator = screen.getByText('10');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('p-[1px]');
  });
});
