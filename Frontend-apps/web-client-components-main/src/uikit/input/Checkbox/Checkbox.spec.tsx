import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  const mockOnChange = (): null => null;

  it('should render checked styles', async () => {
    render(<Checkbox checked onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('adelco-checkbox');
    const icon = await screen.findByTestId('adelco-checkbox-icon');

    expect(checkbox).toHaveClass('bg-corporative-01 ring-0');
    expect(icon).toHaveClass('opacity-1');
  });

  it('should render unchecked styles', async () => {
    render(<Checkbox checked={false} onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('adelco-checkbox');
    const icon = await screen.findByTestId('adelco-checkbox-icon');

    expect(checkbox).toHaveClass('ring-1 ring-inset ring-silver');
    expect(icon).toHaveClass('opacity-0');
  });

  it('should render small size', async () => {
    render(<Checkbox checked variant="sm" onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('adelco-checkbox');
    const icon = await screen.findByTestId('adelco-checkbox-icon');

    expect(checkbox).toHaveClass('w-[18px] h-[18px]');
    expect(icon).toHaveClass('w-4 h-4');
  });

  it('should render medium size', async () => {
    render(<Checkbox checked variant="md" onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('adelco-checkbox');
    const icon = await screen.findByTestId('adelco-checkbox-icon');

    expect(checkbox).toHaveClass('w-[26px] h-[26px]');
    expect(icon).toHaveClass('w-6 h-6');
  });

  it('should render large size', async () => {
    render(<Checkbox checked variant="lg" onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('adelco-checkbox');
    const icon = await screen.findByTestId('adelco-checkbox-icon');

    expect(checkbox).toHaveClass('w-[34px] h-[34px]');
    expect(icon).toHaveClass('w-8 h-8');
  });

  it('should call onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<Checkbox checked onClick={onClick} onChange={mockOnChange} />);

    const checkbox = screen.getByTestId('adelco-checkbox');

    fireEvent.click(checkbox);
    expect(onClick).toHaveBeenCalled();
  });

  it('Should hide input', async () => {
    render(<Checkbox checked onChange={mockOnChange} />);

    const input = screen.getByRole('checkbox');
    expect(input).toHaveClass('opacity-0 absolute cursor-pointer');
  });
});
