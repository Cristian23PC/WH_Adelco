import React, { useState } from 'react';
import { Category } from '@Types/product/Category';
import { Button, FilterIndicator } from '@adelco/web-components';
import ActiveFilters from '../../../../../components/adelco/plp/ActiveFilters';
import {
  stockFilterDefaultValue,
  useFilterContext
} from '../../../../../contexts/Filter/FilterContext';
import { formatCapitalizeText } from '../../../../../helpers/utils/formatLocaleName';
import ProductSorting from './ProductSorting';
import useTrackSort from 'helpers/hooks/analytics/useTrackSort';
import Head from 'components/adelco/Head';
import { MetadataFormat } from 'helpers/utils/metadataFormat';
import useScreen from 'helpers/hooks/useScreen';

export interface ProductListHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  total: number;
  category?: Category;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  title,
  total,
  category
}) => {
  const { openFilters, activeFilters } = useFilterContext();
  const [isSortingMenuOpen, setIsSortingMenuOpen] = useState(false);
  const { trackOpenSort } = useTrackSort();
  const { isDesktop, isTablet, isMobile } = useScreen();

  const openSortingMenu = () => {
    setIsSortingMenuOpen(true);
    trackOpenSort();
  };
  const closeSortingMenu = () => setIsSortingMenuOpen(false);

  let displayTitle = title;
  if (category) {
    displayTitle = formatCapitalizeText(category.name['es-CL']);
  }

  const activeFiltersCount = activeFilters.filter(
    (filter) =>
      filter.filterSlug !== stockFilterDefaultValue.slug ||
      filter.optionSlug !== 'false'
  ).length;

  return (
    <>
      <Head
        title={MetadataFormat.formatTitle(displayTitle)}
        description={MetadataFormat.formatDescription(displayTitle)}
      />
      {isMobile && (
        <div className="flex w-full flex-col gap-2">
          <span
            className="flex items-center font-sans text-xs font-semibold text-corporative-03 tablet:hidden"
            data-testid="adelco-plp-results-count"
          >
            {category && (
              <h1
                className="pr-[10px] font-sans text-lg font-bold"
                data-testid="adelco-plp-title"
              >
                {displayTitle}
              </h1>
            )}
            <span className="mt-1 whitespace-nowrap text-moon">
              Resultados ({total})
            </span>
          </span>
          <ActiveFilters />
          <div className="flex w-full justify-between">
            <Button
              variant="tertiary"
              onClick={openFilters}
              className="relative"
            >
              Filtrar
              {activeFiltersCount > 0 && (
                <FilterIndicator
                  className="absolute -right-2"
                  quantity={activeFiltersCount}
                />
              )}
            </Button>
            <Button variant="tertiary" onClick={openSortingMenu}>
              Ordenar
            </Button>
            <ProductSorting
              open={isSortingMenuOpen}
              onClose={closeSortingMenu}
            />
          </div>
        </div>
      )}
      {isTablet && (
        <div className=" flex w-full flex-col">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1
                className="font-sans text-lg font-bold"
                data-testid="adelco-plp-title"
              >
                {displayTitle}
              </h1>
              <span
                className="whitespace-nowrap font-sans text-xs font-semibold text-moon"
                data-testid="adelco-plp-results-count"
              >
                Resultados ({total})
              </span>
            </div>
            <div className="flex justify-end">
              <Button
                className="relative mr-6"
                variant="tertiary"
                size="sm"
                onClick={openFilters}
              >
                Filtrar
                {activeFiltersCount > 0 && (
                  <FilterIndicator
                    className="absolute -right-2"
                    quantity={activeFiltersCount}
                  />
                )}
              </Button>
              <Button size="sm" variant="tertiary" onClick={openSortingMenu}>
                Ordenar
              </Button>
              <ProductSorting
                open={isSortingMenuOpen}
                onClose={closeSortingMenu}
              />
            </div>
          </div>
          <div className="py-4">
            <ActiveFilters />
          </div>
        </div>
      )}
      {isDesktop && (
        <div className="mb-6 flex w-full justify-between">
          <div className="flex w-full items-center">
            <h1
              className="mr-4 font-sans text-lg font-bold"
              data-testid="adelco-plp-title"
            >
              {displayTitle}
            </h1>
            <span
              className="mt-[6px] whitespace-nowrap font-sans text-xs font-semibold text-moon"
              data-testid="adelco-plp-results-count"
            >
              Resultados ({total})
            </span>
          </div>
          <div className="relative flex h-[51px] justify-end">
            <div className="absolute z-10">
              <ProductSorting
                open={isSortingMenuOpen}
                onClose={closeSortingMenu}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductListHeader;
