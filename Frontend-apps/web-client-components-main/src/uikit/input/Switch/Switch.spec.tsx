import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Switch from './Switch';

describe('Switch component', () => {
  const mockOnChange = (): null => null;

  it('should render with default props', () => {
    const { getByTestId } = render(<Switch checked={false} />);
    const switchElement = getByTestId('adelco-switch');
    const handleElement = getByTestId('adelco-switch-handle');
    expect(switchElement).toBeInTheDocument();
    expect(handleElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it('should render small size', async () => {
    const { getByTestId } = render(
      <Switch checked variant="sm" onChange={mockOnChange} />
    );
    const switchElement = getByTestId('adelco-switch-handle');
    expect(switchElement).toHaveClass('w-[35px] h-[21px]');
  });

  it('should render medium size', async () => {
    const { getByTestId } = render(
      <Switch checked variant="md" onChange={mockOnChange} />
    );
    const switchElement = getByTestId('adelco-switch-handle');
    expect(switchElement).toHaveClass('w-[45px] h-[25px]');
  });

  it('should render large size', async () => {
    const { getByTestId } = render(
      <Switch checked variant="lg" onChange={mockOnChange} />
    );
    const switchElement = getByTestId('adelco-switch-handle');
    expect(switchElement).toHaveClass('w-[60px] h-[35px]');
  });

  it('should call onClick when clicked', async () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <Switch checked onClick={onClick} onChange={mockOnChange} />
    );
    const switchElement = getByTestId('adelco-switch');
    fireEvent.click(switchElement);
    expect(onClick).toHaveBeenCalled();
  });
});
