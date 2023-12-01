import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TextField from './TextField';

describe('TextField', () => {
  describe('TextField', () => {
    const renderTextField = (props = {}): void => {
      const defaultProps = {
        value: '',
        label: 'label',
        onChange: () => {},
        ...props
      };

      render(<TextField {...defaultProps} />);
    };

    it('should render', () => {
      renderTextField();
      expect(screen.getByTestId('adelco-textfield')).toBeInTheDocument();
      expect(screen.getByText(/label/)).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      renderTextField({ placeholder: 'placeholder' });

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('placeholder', 'placeholder');
      fireEvent.focus(input);
      expect(input).toHaveAttribute('placeholder', 'placeholder');
      fireEvent.blur(input);
      expect(input).not.toHaveAttribute('placeholder', 'placeholder');
    });

    it('should render with icon', async () => {
      renderTextField({ iconName: 'search' });

      const icon = await screen.findByTestId('input-icon-search');
      expect(icon).toBeInTheDocument();
    });

    it('should render with password icon', async () => {
      const onClickIcon = jest.fn();
      renderTextField({ type: 'password', iconName: 'add', onClickIcon });

      const iconPasswordHidden = await screen.findByTestId(
        'input-password-hidden-icon'
      );
      expect(iconPasswordHidden).toBeInTheDocument();

      fireEvent.click(iconPasswordHidden);

      screen.queryByTestId('input-password-hidden-icon');
      const iconPasswordVisible = await screen.findByTestId(
        'input-password-visible-icon'
      );
      expect(iconPasswordVisible).toBeInTheDocument();

      fireEvent.click(iconPasswordVisible);

      await screen.findByTestId('input-password-hidden-icon');

      expect(
        screen.queryByTestId('adelco-input-message-icon-add')
      ).not.toBeInTheDocument();
      expect(onClickIcon).not.toHaveBeenCalled();
    });

    it('should render with helper text', async () => {
      renderTextField({ helperText: 'helper text', helperIcon: 'timer' });

      expect(screen.getByText(/helper text/)).toBeInTheDocument();
      expect(
        await screen.findByTestId('adelco-input-message-icon-timer')
      ).toBeInTheDocument();
    });

    it('Should render with warning variant', () => {
      renderTextField({ variant: 'warning', helperText: 'helper text' });

      expect(screen.getByRole('textbox')).toHaveClass('text-warning');
      expect(screen.getByText(/helper text/)).toHaveClass('text-warning');
    });

    it('Should render with failure variant', () => {
      renderTextField({ variant: 'failure', helperText: 'helper text' });

      expect(screen.getByRole('textbox')).toHaveClass('text-failure');
      expect(screen.getByText(/helper text/)).toHaveClass('text-failure');
    });

    it('Should render with success variant', () => {
      renderTextField({ variant: 'success', helperText: 'helper text' });

      expect(screen.getByRole('textbox')).toHaveClass('text-success');
      expect(screen.getByText(/helper text/)).toHaveClass('text-success');
    });

    it('Should place the label on top when the input is focused', () => {
      renderTextField();

      expect(screen.getByText(/label/)).toHaveClass(
        'text-xs peer-focus:text-xs peer-placeholder-shown:text-sm absolute left-4 top-2 peer-focus:top-2 transition-all peer-placeholder-shown:top-3.5'
      );
    });

    it('Should execute the onChange function when the input value changes', () => {
      const onChange = jest.fn();
      renderTextField({ onChange });

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('Should execute the onFocus function when the input is focused', () => {
      const onFocus = jest.fn();
      renderTextField({ onFocus });

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('Should execute the onBlur function when the input is blurred', () => {
      const onBlur = jest.fn();
      renderTextField({ onBlur });

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
    });

    it('Should render an empty space as placeholder when the placeholder is not provided', () => {
      renderTextField();

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', ' ');
    });

    it('Should execute the onClick function when the icon is clicked', async () => {
      const onClick = jest.fn();
      renderTextField({ iconName: 'search', onClickIcon: onClick });

      const icon = await screen.findByTestId('input-icon-search');
      fireEvent.click(icon);
      expect(onClick).toHaveBeenCalled();
    });
  });
});
