import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import TextArea, { type TextAreaProps } from './TextArea';

const onChangeAction = jest.fn();

describe('TextArea', () => {
  const renderComponent = async (args: TextAreaProps): Promise<void> => {
    await act(async () => {
      render(<TextArea {...args} />);
    });
  };

  it('should render the component', async () => {
    await renderComponent({ onChange: onChangeAction });
    expect(screen.getByTestId('adelco-textarea')).toBeInTheDocument();
  });

  it('should display helper text', async () => {
    const helperText = 'This is a helper text';
    await renderComponent({
      onChange: onChangeAction,
      helperText,
      helperIcon: 'add'
    });
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('should display error message with correct class', async () => {
    await renderComponent({
      onChange: onChangeAction,
      helperText: 'Error message',
      variant: 'failure'
    });

    const component = screen.getByTestId('adelco-textarea');
    expect(component.querySelectorAll('div')[0]).toHaveClass('border-failure');

    const errorMessage = screen.getByTestId('adelco-input-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.querySelector('div')).toHaveClass('text-failure');
  });

  it('should display warning message with correct class', async () => {
    await renderComponent({
      onChange: onChangeAction,
      helperText: 'Warning message',
      variant: 'warning'
    });

    const component = screen.getByTestId('adelco-textarea');
    expect(component.querySelectorAll('div')[0]).toHaveClass('border-warning');

    const warningMessage = screen.getByTestId('adelco-input-message');
    expect(warningMessage).toBeInTheDocument();
    expect(warningMessage.querySelector('div')).toHaveClass('text-warning');
  });

  it('should display success message with correct class', async () => {
    await renderComponent({
      onChange: onChangeAction,
      helperText: 'Success message',
      variant: 'success'
    });

    const component = screen.getByTestId('adelco-textarea');
    expect(component.querySelectorAll('div')[0]).toHaveClass('border-success');

    const successMessage = screen.getByTestId('adelco-input-message');
    expect(successMessage).toBeInTheDocument();
    expect(successMessage.querySelector('div')).toHaveClass('text-success');
  });

  it('should display character counter when prop is passed', async () => {
    await renderComponent({
      onChange: onChangeAction,
      maxLength: 5,
      value: 'text'
    });

    expect(screen.getByText('4 / 5')).toBeInTheDocument();
  });

  it('should change css on focus state', async () => {
    await renderComponent({ onChange: onChangeAction });
    const component = screen.getByTestId('adelco-textarea');
    const textarea = component.querySelector('textarea');
    expect(component.querySelectorAll('div')[0]).not.toHaveClass('shadow-lg');

    if (textarea) {
      fireEvent.focus(textarea);
    }
    expect(component.querySelectorAll('div')[0]).toHaveClass('shadow-lg');

    if (textarea) {
      fireEvent.blur(textarea);
    }
    expect(component.querySelectorAll('div')[0]).not.toHaveClass('shadow-lg');
  });

  it('should call onchange function', async () => {
    await renderComponent({ onChange: onChangeAction });
    const component = screen.getByTestId('adelco-textarea');
    const textarea = component.querySelector('textarea');

    if (textarea) {
      fireEvent.change(textarea, { target: { value: 'some text' } });
    }

    expect(onChangeAction).toHaveBeenCalled();
  });
});
