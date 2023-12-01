import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilterMenu from './FilterMenu';
import { linkRendererMock } from '../CategoriesMenu/CategoriesMenuMocks';
import { mockCategoryList, mockFilterList, mockStockFilter } from './mocks';
import userEvent from '@testing-library/user-event';

describe('FilterMenu', () => {
  const renderComponent = (args = {}): any => {
    return render(
      <FilterMenu
        linkRenderer={linkRendererMock}
        onClose={() => {}}
        onFilterClick={() => []}
        onApply={() => {}}
        onClear={() => {}}
        open
        title="title"
        categoryList={mockCategoryList}
        filterList={mockFilterList}
        stockFilter={mockStockFilter}
        {...args}
      />
    );
  };

  it('should render', () => {
    renderComponent();

    expect(screen.getByTestId('adelco-filter-menu')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('Should close the menu when clicking on the close button', () => {
    const onClose = jest.fn();

    renderComponent({ onClose });

    fireEvent.click(screen.getByTestId('adelco-filter-menu-close'));

    expect(onClose).toHaveBeenCalled();
  });

  it('Should render categories', () => {
    renderComponent();

    expect(screen.getAllByTestId('adelco-category-list').length).toBe(2);
    expect(screen.getByText('Limpieza (39)')).toBeInTheDocument();
  });

  it('Should toggle categories', async () => {
    renderComponent();

    const category = screen.getAllByTestId('adelco-category-list')[0];

    expect(category).toHaveClass('max-h-[30px]');
    fireEvent.click(category.firstChild as HTMLElement);

    await waitFor(() => {
      expect(category).toHaveClass('max-h-[500vh]');
      expect(category).not.toHaveClass('max-h-[30px]');
    });
  });

  it('Should render filters', () => {
    renderComponent();

    expect(screen.getByText('Filtrar productos')).toBeInTheDocument();
    expect(screen.getAllByTestId('adelco-filter-list').length).toBe(2);
    expect(screen.getByText('Producto1 (7)')).toBeInTheDocument();
  });

  it('Should toggle filters', async () => {
    renderComponent();

    const filter = screen.getAllByTestId('adelco-filter-list')[0];

    expect(filter).toHaveClass('max-h-[46px]');
    fireEvent.click(filter.firstChild as HTMLElement);

    await waitFor(() => {
      expect(filter).toHaveClass('max-h-[500vh]');
      expect(filter).not.toHaveClass('max-h-[46px]');
    });
  });

  it('Should execute onFilterClick when clicking on a filter', () => {
    const onFilterClick = jest.fn();

    renderComponent({ onFilterClick });
    fireEvent.click(screen.getAllByTestId('adelco-option-check')[0]);

    const filterData = mockFilterList.filters[0];

    expect(onFilterClick).toHaveBeenCalledWith(
      filterData.slug,
      filterData.options[0].slug,
      !filterData.options[0].active,
      filterData.options[0].title
    );
  });

  it('Should click on stock switch filter', () => {
    const onFilterClick = jest.fn();

    renderComponent({
      onFilterClick
    });

    const stockSwitchElement = screen.getByTestId(
      'adelco-filter-stock-switch-mobile'
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

  it('Should render footer', () => {
    renderComponent();

    const footer = screen.getByTestId('adelco-filter-menu-footer');

    expect(footer).toBeInTheDocument();
    expect(footer.getElementsByTagName('button').length).toBe(2);
  });

  it('Should execute onClear when clicking on the clear button', () => {
    const onClear = jest.fn();
    renderComponent({ onClear });

    fireEvent.click(screen.getByText('Limpiar'));

    expect(onClear).toHaveBeenCalled();
  });

  it('Should execute onApply when clicking on the apply button', () => {
    const onApply = jest.fn();
    renderComponent({ onApply });

    fireEvent.click(screen.getByText('Aplicar'));

    expect(onApply).toHaveBeenCalled();
  });
});
