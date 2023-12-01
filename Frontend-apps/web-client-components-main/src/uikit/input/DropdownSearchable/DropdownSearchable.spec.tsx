import React, { type FC } from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownSearchable, {
  type DropdownSearchableProps,
  DEFAULT_LITERALS
} from './DropdownSearchable';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'pear', label: 'Pear' },
  { value: 'carrot', label: 'Carrot' },
  { value: 'broccoli', label: 'Broccoli' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'potato', label: 'Potato' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'beef', label: 'Beef' }
];

const Component: FC<Partial<DropdownSearchableProps>> = (props) => (
  <DropdownSearchable
    onChange={jest.fn()}
    onSearch={jest.fn()}
    options={options}
    {...props}
  />
);

describe('DropdownSearchable component', () => {
  describe('render', () => {
    it('should render with helper text', async () => {
      render(
        <Component options={[]} helperIcon="timer" helperText="helper text" />
      );

      expect(screen.getByText(/helper text/)).toBeInTheDocument();
      expect(
        await screen.findByTestId('adelco-input-message-icon-timer')
      ).toBeInTheDocument();
    });

    it('should render with warning variant', () => {
      render(
        <Component options={[]} variant="warning" helperText="helper text" />
      );

      expect(screen.getByRole('textbox')).toHaveClass('text-warning');
      expect(screen.getByText(/helper text/)).toHaveClass('text-warning');
    });

    it('should render with failure variant', () => {
      render(
        <Component options={[]} variant="failure" helperText="helper text" />
      );

      expect(screen.getByRole('textbox')).toHaveClass('text-failure');
      expect(screen.getByText(/helper text/)).toHaveClass('text-failure');
    });

    it('should render with success variant', () => {
      render(
        <Component options={[]} variant="success" helperText="helper text" />
      );

      expect(screen.getByRole('textbox')).toHaveClass('text-success');
      expect(screen.getByText(/helper text/)).toHaveClass('text-success');
    });
  });

  describe('actions', () => {
    it('should call onSearch when type in MenuToggle with 3 words', async () => {
      const onSearchSpy = jest.fn();
      const searchTerm = 'foo';
      jest.useFakeTimers();
      render(<Component onSearch={onSearchSpy} />);

      const input = screen
        .getByTestId('adelco-textfield')
        .getElementsByTagName('input')[0];

      await act(async () => {
        userEvent.type(input, searchTerm);
      });

      jest.runAllTimers();

      expect(onSearchSpy).toHaveBeenCalledWith(searchTerm);
      expect(input).toHaveProperty('value', searchTerm);
    });

    it('should not call onSearch when type in MenuToggle with 2 characters', async () => {
      const onSearchSpy = jest.fn();
      const searchTerm = 'fo';
      jest.useFakeTimers();
      render(<Component minLengthToSearch={3} onSearch={onSearchSpy} />);

      const input = screen
        .getByTestId('adelco-textfield')
        .getElementsByTagName('input')[0];

      await act(async () => {
        userEvent.type(input, searchTerm);
      });

      jest.runAllTimers();

      expect(onSearchSpy).not.toHaveBeenCalled();
    });

    it('should call onChange when user click on a option', async () => {
      const onChangeSpy = jest.fn();
      render(<Component onChange={onChangeSpy} />);

      const input = screen
        .getByTestId('adelco-textfield')
        .getElementsByTagName('input')[0];

      await act(async () => {
        userEvent.click(input);
        userEvent.click(screen.getByText(options[0].label));
      });

      expect(onChangeSpy).toHaveBeenCalledWith(options[0].value);
      expect(input).toHaveProperty('value', options[0].label);
    });

    it('should show not found label if search and dont find any item', async () => {
      render(<Component options={[]} />);

      const input = screen
        .getByTestId('adelco-textfield')
        .getElementsByTagName('input')[0];

      await act(async () => {
        userEvent.type(input, 'not-found');
      });

      expect(
        screen.getByText(DEFAULT_LITERALS.notFoundLabel)
      ).toBeInTheDocument();
    });

    it('should call onChange when remove text in input', async () => {
      const onChangeSpy = jest.fn();
      render(<Component value={options[0].value} onChange={onChangeSpy} />);

      const input = screen
        .getByTestId('adelco-textfield')
        .getElementsByTagName('input')[0];

      await act(async () => {
        userEvent.clear(input);
      });

      expect(onChangeSpy).toHaveBeenCalledWith('');
    });
  });
});
