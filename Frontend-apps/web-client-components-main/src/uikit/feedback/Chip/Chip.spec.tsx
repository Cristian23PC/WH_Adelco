import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import Chip from './Chip';

describe('Chip component', () => {
  it('renders label text', () => {
    render(<Chip label="Example" />);
    expect(screen.getByTestId('adelco-chip')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Chip label="Example" onClick={handleClick} />
    );
    fireEvent.click(getByText('Example'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClose handler when close icon clicked', async () => {
    const handleClose = jest.fn();
    render(<Chip label="Example" onClose={handleClose} />);
    const closeIcon = await screen.findByTestId('icon-close');
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders with active style when active prop is true', () => {
    const { getByText } = render(<Chip label="Example" active />);
    const chipElement = getByText('Example');
    expect(chipElement).toHaveClass('bg-corporative-03');
    expect(chipElement).toHaveClass('border-corporative-03');
    expect(chipElement).toHaveClass('text-white');
  });

  it('renders with small size class when size prop is "small"', () => {
    const { getByText } = render(<Chip label="Example" size="small" />);
    expect(getByText('Example')).toHaveClass('text-xs');
  });
});
