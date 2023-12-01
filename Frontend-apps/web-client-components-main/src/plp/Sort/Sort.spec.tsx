import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Sort from './Sort';
import * as useScreen from '../../utils/hooks/useScreen/useScreen';

const mockFilterList = [
  { label: 'Recomendados', value: 'recomendados' },
  { label: 'Mas vendido', value: 'mas-vendido' },
  { label: 'Mejor descuento', value: 'mejor-descuento' },
  { label: 'A-Z', value: 'A-Z' },
  { label: 'Z-A', value: 'Z-A' }
];

describe('Sort', () => {
  const renderComponent = (args = {}): void => {
    render(
      <Sort
        onSelect={() => {}}
        onApply={() => {}}
        title=""
        open={true}
        onClose={() => {}}
        sortList={mockFilterList}
        {...args}
      />
    );
  };

  it('Should render on desktop', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: true,
      isMobile: false,
      isTablet: false
    }));

    renderComponent();

    const element = screen.getByTestId('adelco-sort-dropdown');

    expect(element).toBeInTheDocument();
  });

  it('Should render on mobile', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: false,
      isMobile: true,
      isTablet: false
    }));

    renderComponent();

    const element = screen.getByTestId('adelco-filter-menu');

    expect(element).toBeInTheDocument();
  });

  it('Should execute onSelect and onApply when click on option at desktop mode', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: true,
      isMobile: false,
      isTablet: false
    }));
    const onSelect = jest.fn();
    const onApply = jest.fn();
    renderComponent({ onSelect, onApply });

    const option = screen.getAllByTestId('adelco-option-radio')[0];

    fireEvent.click(option);

    expect(onSelect).toHaveBeenCalledWith(mockFilterList[0].value);
    expect(onApply).toHaveBeenCalled();
  });
});
