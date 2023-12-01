import React from 'react';
import { render, screen } from '@testing-library/react';
import CartIndicator from './CartIndicator';

describe('CartIndicator', () => {
  it('should render with default size and quantity', () => {
    render(<CartIndicator quantity={0} />);

    const indicator = screen.getByText('0');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('p-[1px] text-xs min-w-[18px] rounded-3xl');
  });

  it('should render with custom size', () => {
    render(<CartIndicator quantity={0} size="md" />);

    const indicator = screen.getByText('0');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass(
      'p-1 text-xl min-w-[38px] rounded-[40px] leading-[30px]'
    );
  });

  it('should display quantity up to 99+', () => {
    render(<CartIndicator quantity={100} />);

    const indicator = screen.getByText('99+');
    expect(indicator).toBeInTheDocument();
  });
});
