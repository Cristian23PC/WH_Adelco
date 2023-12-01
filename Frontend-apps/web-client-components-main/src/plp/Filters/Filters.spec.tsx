import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Filters from './Filters';
import {
  mockFilterList,
  mockStockFilter
} from '../../uikit/navigation/FilterMenu/mocks';
import * as useScreen from '../../utils/hooks/useScreen/useScreen';
import userEvent from '@testing-library/user-event';

describe('Filters', () => {
  const renderComponent = (args = {}): void => {
    render(
      <Filters
        onChangeFilters={() => {}}
        onApply={() => {}}
        filterList={mockFilterList}
        onClear={() => {}}
        onClose={() => {}}
        title=""
        linkRenderer={() => <div></div>}
        open
        stockFilter={mockStockFilter}
        {...args}
      />
    );
  };
  it('Should render Filters on tablet or mobile', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: false,
      isMobile: true,
      isTablet: false
    }));

    renderComponent();

    expect(screen.getByTestId('adelco-filter-menu')).toBeInTheDocument();
  });

  it('Should render Filters on tablet or mobile', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: true,
      isMobile: false,
      isTablet: false
    }));

    renderComponent();

    expect(
      screen.getByTestId('filter-dropdown-menu-adelco')
    ).toBeInTheDocument();
  });

  it('Should uncheck filter when click on active filter on mobile', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: false,
      isMobile: true,
      isTablet: false
    }));
    const onApply = jest.fn();
    const onChangeFilters = jest.fn();
    renderComponent({ onChangeFilters, onApply });

    const filter = screen.getAllByTestId('adelco-option-check');

    fireEvent.click(filter[0]);

    const filterData = mockFilterList.filters[0];
    expect(onChangeFilters).toHaveBeenCalledWith(
      filterData.slug,
      filterData.options[0].slug,
      false,
      false
    );
    expect(onApply).not.toHaveBeenCalled();
  });

  it('Should uncheck filter when click on active filter on desktop', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: true,
      isMobile: false,
      isTablet: false
    }));
    const onApply = jest.fn();
    const onChangeFilters = jest.fn();
    renderComponent({ onChangeFilters, onApply });

    const filter = screen.getAllByTestId('adelco-option-check');

    fireEvent.click(filter[0]);

    const filterData = mockFilterList.filters[0];
    expect(onChangeFilters).toHaveBeenCalledWith(
      filterData.slug,
      filterData.options[0].slug,
      false,
      true
    );
    expect(onApply).toHaveBeenCalledWith([
      {
        filterSlug: 'tipo-de-producto',
        optionSlug: 'Producto-2',
        title: 'Producto2'
      },
      { filterSlug: 'marca', optionSlug: 'Marca-3', title: 'Marca3' },
      {
        filterSlug: 'stock-filter',
        optionSlug: 'true',
        title: 'Productos con stock'
      }
    ]);
  });

  it('Should check filter when click on non active filter on mobile', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: false,
      isMobile: true,
      isTablet: false
    }));
    const onApply = jest.fn();
    const onChangeFilters = jest.fn();
    renderComponent({ onChangeFilters, onApply });

    const filter = screen.getAllByTestId('adelco-option-check');

    fireEvent.click(filter[2]);

    const filterData = mockFilterList.filters[0];
    expect(onChangeFilters).toHaveBeenCalledWith(
      filterData.slug,
      filterData.options[2].slug,
      true,
      false
    );
    expect(onApply).not.toHaveBeenCalled();
  });

  it('Should check filter when click on non active filter on desktop', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: true,
      isMobile: false,
      isTablet: false
    }));
    const onApply = jest.fn();
    const onChangeFilters = jest.fn();
    renderComponent({ onChangeFilters, onApply });

    const filter = screen.getAllByTestId('adelco-option-check');

    fireEvent.click(filter[2]);

    const filterData = mockFilterList.filters[0];
    expect(onChangeFilters).toHaveBeenCalledWith(
      filterData.slug,
      filterData.options[2].slug,
      true,
      true
    );
    expect(onApply).toHaveBeenCalledWith([
      {
        filterSlug: 'tipo-de-producto',
        optionSlug: 'Producto-1',
        title: 'Producto1'
      },
      {
        filterSlug: 'tipo-de-producto',
        optionSlug: 'Producto-2',
        title: 'Producto2'
      },
      { filterSlug: 'marca', optionSlug: 'Marca-3', title: 'Marca3' },
      {
        filterSlug: 'stock-filter',
        optionSlug: 'true',
        title: 'Productos con stock'
      },
      {
        filterSlug: 'tipo-de-producto',
        optionSlug: 'Producto-3',
        title: 'Producto3'
      }
    ]);
  });

  it('Should toggle stock filter on click on desktop', () => {
    jest.spyOn(useScreen, 'default').mockImplementation(() => ({
      isDesktop: true,
      isMobile: false,
      isTablet: false
    }));
    const onApply = jest.fn();
    const onChangeFilters = jest.fn();
    renderComponent({ onChangeFilters, onApply });

    const stockSwitchElement = screen.getByTestId(
      'adelco-filter-stock-switch-desktop'
    );
    userEvent.click(stockSwitchElement);

    expect(onChangeFilters).toHaveBeenCalledWith(
      'stock-filter',
      'false',
      false,
      true
    );
    expect(onApply).toHaveBeenCalledWith([
      {
        filterSlug: 'tipo-de-producto',
        optionSlug: 'Producto-1',
        title: 'Producto1'
      },
      {
        filterSlug: 'tipo-de-producto',
        optionSlug: 'Producto-2',
        title: 'Producto2'
      },
      { filterSlug: 'marca', optionSlug: 'Marca-3', title: 'Marca3' },
      {
        filterSlug: 'stock-filter',
        optionSlug: 'false',
        title: 'Productos con stock'
      }
    ]);
  });

  it('Should clear all filters', () => {
    const onClear = jest.fn();
    renderComponent({
      onClear
    });

    const clearButton = screen.getByText('Limpiar');
    fireEvent.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });
});
