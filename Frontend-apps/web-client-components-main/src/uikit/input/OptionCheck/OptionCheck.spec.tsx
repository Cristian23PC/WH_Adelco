import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OptionCheck from './OptionCheck';

describe('OptionCheck', () => {
  it('Should render', async () => {
    const label = 'Option 1';
    render(<OptionCheck label={label} checked onChange={() => null} />);

    expect(screen.getByTestId('adelco-option-check')).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(await screen.findByTestId('adelco-checkbox')).toBeInTheDocument();
  });

  it('Should render unchecked', async () => {
    const label = 'Option 1';
    render(<OptionCheck label={label} checked={false} onChange={() => null} />);

    expect(screen.getByText(label)).not.toHaveClass('font-bold');
  });

  it('Should render checked', async () => {
    const label = 'Option 1';
    render(<OptionCheck label={label} checked={true} onChange={() => null} />);

    expect(screen.getByText(label)).toHaveClass('font-bold');
  });

  it('Should call onClick when clicked', async () => {
    const onClick = jest.fn();
    render(
      <OptionCheck
        label="Option 1"
        checked={true}
        onClick={onClick}
        onChange={() => null}
      />
    );

    fireEvent.click(screen.getByTestId('adelco-option-check'));

    expect(onClick).toHaveBeenCalled();
  });

  it('Should render disabled', async () => {
    const label = 'Option 1';
    render(
      <OptionCheck
        label={label}
        checked={true}
        disabled={true}
        onChange={() => null}
      />
    );

    expect(screen.getByTestId('adelco-option-check')).toHaveClass('opacity-30');
  });
});
