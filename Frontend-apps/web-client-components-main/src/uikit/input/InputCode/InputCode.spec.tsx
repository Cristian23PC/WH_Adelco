import React, { type FC } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import InputCode, { type InputCodeProps } from './InputCode';

afterEach(() => {
  jest.clearAllMocks();
});

const mockOnSubmit = jest.fn();
const Component: FC<Partial<InputCodeProps>> = (overwrite) => (
  <InputCode onSubmit={mockOnSubmit} {...overwrite} />
);

describe('InputCode', () => {
  it('renders the correct number of Input components', () => {
    const { container } = render(<Component />);
    const inputElements = container.querySelectorAll('input');
    expect(inputElements.length).toBe(4);
  });

  it('calls onSubmit with the correct code when submitting the form', () => {
    const { container } = render(<Component />);
    const formElement = container.querySelector('form');
    const inputElements = container.querySelectorAll('input');
    const code = '1234';

    inputElements.forEach((input, index) => {
      fireEvent.change(input, { target: { value: code[index] } });
    });

    if (formElement != null) {
      fireEvent.submit(formElement);
    }

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith(code);
  });

  it('renders the error message when onSubmit throws an error', () => {
    render(
      <InputCode onSubmit={mockOnSubmit} errorMessage={'Test error message'} />
    );

    const component = screen.getByTestId('adelco-input-code');

    const formElement = component.querySelector('form');
    const inputElements = component.querySelectorAll('input');

    inputElements.forEach((input) => {
      fireEvent.change(input, { target: { value: '1' } });
    });

    if (formElement != null) {
      fireEvent.submit(formElement);
    }

    const errorMessage = screen.getByText('Test error message');

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith('1111');
    expect(errorMessage).toBeInTheDocument();
  });
});
