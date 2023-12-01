import React, { type FC } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import DropdownMultiselect, {
  type DropdownMultiselectProps
} from './DropdownMultiselect';
import userEvent from '@testing-library/user-event';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' }
];

const Component: FC<Partial<DropdownMultiselectProps>> = (props) => (
  <DropdownMultiselect
    onChange={jest.fn()}
    onSearch={jest.fn()}
    options={options}
    title="accordion title"
    isSearchable
    {...props}
  />
);

describe('DropdownMultiselect component', () => {
  it('should open the accordion', async () => {
    render(<Component />);

    const accordion = screen.getByTestId('adelco-accordion');
    const accordionTitle = screen.getByText('accordion title');
    const searchInput = screen.getByTestId('adelco-textfield');

    userEvent.click(accordionTitle);

    await waitFor(() => {
      expect(accordion).toHaveClass('max-h-[500vh]');
      expect(searchInput).toBeVisible();
    });
  });

  it('should render the options', async () => {
    await act(async () => {
      render(<Component />);
    });

    options.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('should call onSearch when type in MenuToggle', async () => {
    const onSearchSpy = jest.fn();
    const searchTerm = 'apple';
    await act(async () => {
      render(<Component onSearch={onSearchSpy} />);
    });

    const input = screen
      .getByTestId('adelco-textfield')
      .getElementsByTagName('input')[0] as any;

    await act(async () => {
      userEvent.type(input, searchTerm);
    });

    expect(onSearchSpy).toHaveBeenCalledWith(searchTerm);
    userEvent.clear(input);
    act(() => {
      userEvent.type(input, searchTerm);
    });
    await waitFor(() => {
      expect(input).toHaveValue(searchTerm);
    });
  });

  it('should call onSearch with empty string on click clear icon', async () => {
    const onSearchSpy = jest.fn();
    const searchTerm = 'apple';
    await act(async () => {
      render(<Component onSearch={onSearchSpy} />);
    });

    const input = screen
      .getByTestId('adelco-textfield')
      .getElementsByTagName('input')[0] as any;

    await act(async () => {
      userEvent.type(input, searchTerm);
    });

    expect(onSearchSpy).toHaveBeenCalledWith(searchTerm);
    expect(input).toHaveProperty('value', searchTerm);

    const clearIcon = screen.getByTestId('input-icon-close');

    await act(async () => {
      userEvent.click(clearIcon);
    });

    expect(onSearchSpy).toHaveBeenCalledWith('');
    expect(input).toHaveProperty('value', '');
  });

  it('should call onChange when user click on a option', async () => {
    const onChangeSpy = jest.fn();
    await act(async () => {
      render(<Component onChange={onChangeSpy} />);
    });

    userEvent.click(screen.getByText(options[0].label));
    userEvent.click(screen.getByText(options[1].label));
    userEvent.click(screen.getByText(options[0].label));

    expect(onChangeSpy).toHaveBeenCalledTimes(3);
    expect(onChangeSpy).toHaveBeenNthCalledWith(1, [options[0].value]);
    expect(onChangeSpy).toHaveBeenNthCalledWith(2, [
      options[0].value,
      options[1].value
    ]);
    expect(onChangeSpy).toHaveBeenNthCalledWith(3, [options[1].value]);
  });

  it('should show not found label if search and there are not items select', async () => {
    await act(async () => {
      render(<Component literals={{ notFoundLabel: 'item not found' }} />);
    });
    const input = screen
      .getByTestId('adelco-textfield')
      .getElementsByTagName('input')[0] as any;

    await act(async () => {
      userEvent.type(input, 'not-found text');
    });

    await waitFor(() => {
      expect(screen.getByText('item not found')).toBeInTheDocument();
    });
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
