import React from 'react';
import { screen, render } from '@testing-library/react';
import FilterNoResults from './FilterNoResults';
import userEvent from '@testing-library/user-event';

describe('FilterNoResults component', () => {
  it('renders FilterNoResults component', () => {
    render(<FilterNoResults onClick={jest.fn()} />);
    expect(screen.getByTestId('adelco-filter-no-results')).toBeInTheDocument();
  });

  it('renders custom literals texts', () => {
    const customLiterals = {
      title: 'test_title',
      textButton: 'test_text'
    };
    render(<FilterNoResults onClick={jest.fn()} literals={customLiterals} />);

    expect(screen.getByText(customLiterals.title)).toBeInTheDocument();
    expect(screen.getByText(customLiterals.textButton)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();

    const customLiterals = {
      textButton: 'test_text'
    };

    render(<FilterNoResults onClick={mockOnClick} literals={customLiterals} />);

    userEvent.click(screen.getByText(customLiterals.textButton));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
