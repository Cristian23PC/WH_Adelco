import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FilterDropdownMenu from './FilterDropdownMenu';
import { mockFilterList, mockStockFilter } from '../FilterMenu/mocks';
import { getActiveFilters } from './utils';
import userEvent from '@testing-library/user-event';

describe('FilterDropdownMenu', () => {
  const renderComponent = (args = {}): any =>
    render(
      <FilterDropdownMenu
        onFilterClick={() => []}
        activeFilters={getActiveFilters(mockFilterList, mockStockFilter)}
        filterList={mockFilterList}
        stockFilter={mockStockFilter}
        onClear={() => {}}
        {...args}
      />
    );

  it('Should render', () => {
    renderComponent();

    const filterDropdownMenu = screen.getByTestId(
      'filter-dropdown-menu-adelco'
    );

    expect(filterDropdownMenu).toBeInTheDocument();
  });

  it('Should toggle when click header', () => {
    renderComponent();

    const filterDropdownMenu = screen.getByTestId(
      'filter-dropdown-menu-adelco'
    );

    expect(filterDropdownMenu).toHaveClass('max-h-[500vh]');

    fireEvent.click(filterDropdownMenu.children[0]);
    expect(filterDropdownMenu).toHaveClass('max-h-[52px]');

    fireEvent.click(filterDropdownMenu.children[0]);
    expect(filterDropdownMenu).toHaveClass('max-h-[500vh]');
  });

  it('Should render active filters', () => {
    renderComponent();

    const chips = screen.getAllByTestId('adelco-chip');

    expect(chips).toHaveLength(3);
  });

  it('Should remove filter when click on close icon', async () => {
    const onFilterClick = jest.fn();
    renderComponent({ onFilterClick });

    const chipIcons = await screen.findAllByTestId('icon-close');

    fireEvent.click(chipIcons[0]);

    expect(onFilterClick).toHaveBeenCalledWith(
      'tipo-de-producto',
      'Producto-1',
      false,
      'Producto1'
    );
  });

  it('Should render submenus', () => {
    renderComponent();

    const subMenu = screen.getAllByTestId('adelco-accordion');

    expect(subMenu).toHaveLength(2);
  });

  it('Should render submenu options', () => {
    renderComponent();

    const options = screen.getAllByTestId('adelco-option-check');

    expect(options).toHaveLength(10);
  });

  it('Should click on stock switch filter', () => {
    const onFilterClick = jest.fn();

    renderComponent({
      onFilterClick
    });

    const stockSwitchElement = screen.getByTestId(
      'adelco-filter-stock-switch-desktop'
    );
    userEvent.click(stockSwitchElement);
    expect(onFilterClick).toHaveBeenCalledTimes(1);
    expect(onFilterClick).toHaveBeenCalledWith(
      'stock-filter',
      'false',
      false,
      'Productos con stock'
    );
  });

  it('Should check options', () => {
    const onFilterClick = jest.fn();
    renderComponent({
      onFilterClick
    });

    const options = screen.getAllByTestId('adelco-option-check');

    fireEvent.click(options[2]);

    expect(onFilterClick).toHaveBeenLastCalledWith(
      'tipo-de-producto',
      'Producto-3',
      true,
      'Producto3'
    );
  });

  it('Should uncheck options', () => {
    const onFilterClick = jest.fn();
    renderComponent({
      onFilterClick
    });

    const options = screen.getAllByTestId('adelco-option-check');

    fireEvent.click(options[0]);

    expect(onFilterClick).toHaveBeenLastCalledWith(
      'tipo-de-producto',
      'Producto-1',
      false,
      'Producto1'
    );
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

  describe('utils', () => {
    it('getActiveFilters', () => {
      const activeFilters = getActiveFilters(mockFilterList, mockStockFilter);

      expect(activeFilters).toHaveLength(4);
      expect(activeFilters).toEqual([
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
        {
          filterSlug: 'marca',
          optionSlug: 'Marca-3',
          title: 'Marca3'
        },
        {
          filterSlug: 'stock-filter',
          optionSlug: 'true',
          title: 'Productos con stock'
        }
      ]);
    });
  });
});
