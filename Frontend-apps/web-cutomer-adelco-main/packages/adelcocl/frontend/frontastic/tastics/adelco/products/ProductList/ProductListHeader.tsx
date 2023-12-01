import React from 'react';
import { Category } from '@Types/product/Category';
import { Button, FilterIndicator } from 'am-ts-components';
import ActiveFilters from '../../../../../components/adelco/plp/ActiveFilters';
import { useFilterContext } from '../../../../../contexts/Filter/FilterContext';
import { formatCapitalizeText } from '../../../../../helpers/utils/formatLocaleName';

export interface ProductListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  total: number;
  onSort: VoidFunction;
  category?: Category;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({ title, total, onSort, category }) => {
  const { openFilters, activeFilters } = useFilterContext();

  let displayTitle = title;
  if (category) {
    displayTitle = formatCapitalizeText(category.name['es-CL']);
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2 tablet:hidden">
        <span
          className="font-sans text-xs font-semibold text-corporative-03 tablet:hidden"
          data-testid="adelco-plp-results-count"
        >
          {category && (
            <span className="pr-[10px] font-sans text-lg font-bold" data-testid="adelco-plp-title">
              {displayTitle}
            </span>
          )}
          {total} resultados
        </span>
        <ActiveFilters />
        <div className="flex w-full justify-between">
          <Button variant="tertiary" onClick={openFilters} className="relative">
            Filtrar
            {activeFilters.length > 0 && (
              <FilterIndicator className="absolute -right-2" quantity={activeFilters.length} />
            )}
          </Button>
          <Button variant="tertiary" onClick={onSort}>
            Ordenar
          </Button>
        </div>
      </div>

      <div className="hidden w-full tablet:flex tablet:flex-col desktop:hidden">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold" data-testid="adelco-plp-title">
              {displayTitle}
            </span>
            <span className="font-sans text-xs font-semibold text-moon" data-testid="adelco-plp-results-count">
              Resultados ({total})
            </span>
          </div>
          <div className="flex justify-end">
            <Button className="relative mr-6" variant="tertiary" size="sm" onClick={openFilters}>
              Filtrar
              {activeFilters.length > 0 && (
                <FilterIndicator className="absolute -right-2" quantity={activeFilters.length} />
              )}
            </Button>
            <Button variant="tertiary" size="sm" onClick={onSort}>
              Ordenar
            </Button>
          </div>
        </div>
        <div className="py-4">
          <ActiveFilters />
        </div>
      </div>

      <div className="mb-6 hidden w-full justify-between desktop:flex">
        <div className="flex w-full items-center">
          <span className="mr-4 font-sans text-lg font-bold" data-testid="adelco-plp-title">
            {displayTitle}
          </span>
          <span className="mt-[6px] font-sans text-xs font-semibold text-moon" data-testid="adelco-plp-results-count">
            Resultados ({total})
          </span>
        </div>
        <div className="flex justify-end">
          <div className="flex h-[51px] w-[258px] flex-col justify-center rounded border p-4 text-sm font-semibold">
            Ordenar
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListHeader;
