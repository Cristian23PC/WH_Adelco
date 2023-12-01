import React, { type FC } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown, { type DropdownProps } from './Dropdown';
import { options } from './Dropdown.mock';
const Component: FC<Partial<DropdownProps>> = (props) => (
  <Dropdown options={options} label="Select.." {...props} />
);

describe('Dropdown', () => {
  describe('render', () => {
    it('should display all options when open dropdown', async () => {
      render(<Component />);

      const dropdown = screen.getByTestId('adelco-dropdown')
        .firstChild as ChildNode;
      await act(async () => {
        fireEvent.click(dropdown);
      });

      const optionWrapper = screen.getByTestId('adelco-dropdown-options');
      expect(optionWrapper.children).toHaveLength(options.length);
    });

    it('should not be able to open the dropdown when it is disabled', async () => {
      render(<Component disabled />);

      const dropdown = screen.getByTestId('adelco-dropdown')
        .firstChild as ChildNode;
      expect(dropdown).toHaveClass('opacity-30');
      fireEvent.click(dropdown);

      const dropdownItem = screen.queryByTestId('adelco-dropdown-option-0');
      expect(dropdownItem).not.toBeInTheDocument();
    });

    it('should display value if there is value select', () => {
      render(<Component value={options[0].value} />);

      const dropdown = screen.getByText(options[0].label);

      expect(dropdown).toBeInTheDocument();
    });

    it('should render with helper text', async () => {
      render(<Component helperIcon="timer" helperText="helper text" />);

      expect(screen.getByText(/helper text/)).toBeInTheDocument();
      expect(
        await screen.findByTestId('adelco-input-message-icon-timer')
      ).toBeInTheDocument();
    });

    it('should render with warning variant', () => {
      render(<Component variant="warning" helperText="helper text" />);

      expect(screen.getByText(/helper text/)).toHaveClass('text-warning');
    });

    it('should render with failure variant', () => {
      render(<Component variant="failure" helperText="helper text" />);

      expect(screen.getByText(/helper text/)).toHaveClass('text-failure');
    });

    it('should render with success variant', () => {
      render(<Component variant="success" helperText="helper text" />);

      expect(screen.getByText(/helper text/)).toHaveClass('text-success');
    });
  });

  describe('actions', () => {
    it('should call the onChange with correct value', async () => {
      const onChangeSpy = jest.fn();
      render(<Component onChange={onChangeSpy} />);

      const dropdown = screen.getByTestId('adelco-dropdown')
        .firstChild as ChildNode;
      await act(async () => {
        fireEvent.click(dropdown);
      });

      const dropdownItem = screen.getByTestId('adelco-dropdown-option-0');
      fireEvent.click(dropdownItem);

      expect(onChangeSpy).toHaveBeenCalledWith(options[0].value);
    });
  });
});
