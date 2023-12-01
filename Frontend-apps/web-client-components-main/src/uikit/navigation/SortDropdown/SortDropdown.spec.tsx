import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SortDropdown from './SortDropdown';

const mockOptions = [
  { label: 'Recomendados', value: 'recomendados' },
  { label: 'Mas vendido', value: 'mas-vendido' },
  { label: 'Mejor descuento', value: 'mejor-descuento' },
  { label: 'A-Z', value: 'A-Z' },
  { label: 'Z-A', value: 'Z-A' }
];

describe('SortDropdown', () => {
  it('should render', () => {
    render(
      <SortDropdown
        sortList={mockOptions}
        selectedValue=""
        onSelect={() => {}}
      />
    );

    const dropdown = screen.getByTestId('adelco-sort-dropdown');

    expect(dropdown).toBeInTheDocument();
  });

  it('Should render options', () => {
    render(
      <SortDropdown
        sortList={mockOptions}
        selectedValue=""
        onSelect={() => {}}
      />
    );

    const options = screen.getAllByTestId('adelco-option-radio');

    expect(options.length).toBe(mockOptions.length);
  });

  it('Should render selected option', () => {
    const selectedValue = 'recomendados';

    render(
      <SortDropdown
        sortList={mockOptions}
        selectedValue={selectedValue}
        onSelect={() => {}}
      />
    );

    const selectedOption = screen.getAllByTestId('adelco-option-radio')[0];

    expect(selectedOption.firstChild).toHaveClass('bg-corporative-01');
  });

  it('Should toggle', () => {
    render(
      <SortDropdown
        sortList={mockOptions}
        selectedValue=""
        onSelect={() => {}}
      />
    );

    const dropdown = screen.getByTestId('adelco-sort-dropdown');

    expect(dropdown).toHaveClass('max-h-[51px]');

    if (dropdown.firstChild) {
      fireEvent.click(dropdown.firstChild);
    }

    expect(dropdown).toHaveClass('max-h-[500vh]');
  });

  it('Should call onChange when an option is clicked', () => {
    const onChange = jest.fn();
    render(
      <SortDropdown
        selectedValue=""
        sortList={mockOptions}
        onSelect={onChange}
      />
    );

    const option = screen.getAllByTestId('adelco-option-radio')[0];

    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith('recomendados');
  });
});
