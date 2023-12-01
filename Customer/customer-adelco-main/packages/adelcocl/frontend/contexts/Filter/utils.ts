import { Facet, FacetFilter } from '@Types/adelco/facet';
import { ActiveFilter, FilterList, StockFilter } from './types';
import {
  BRAND,
  CATEGORIES,
  getFiltersFromFacets,
  getQueryParamsWithoutFacets,
  mapCategories,
  unwrapFromArray
} from 'components/adelco/plp/utils';
import { NextRouter } from 'next/router';
import { CtCategory } from '@Types/adelco/category';

export const getActiveFilters = (
  filterList: FilterList,
  stockFilter: StockFilter
): ActiveFilter[] => {
  const activeFilters = filterList.filters.flatMap((filter) => {
    return filter.options
      .filter((option) => option.active)
      .map((option) => ({
        filterSlug: filter.slug,
        optionSlug: option.slug,
        title: option.title
      }));
  });

  activeFilters.push({
    filterSlug: stockFilter.slug,
    optionSlug: String(stockFilter.active),
    title: stockFilter.title
  });

  return activeFilters;
};

export const getFilterListStatus = (
  filterList: FilterList,
  filter: string,
  option: string,
  value: boolean
): FilterList => ({
  ...filterList,
  filters: filterList.filters.map((filterItem) => {
    if (filterItem.slug === filter) {
      return {
        ...filterItem,
        options: filterItem.options.map((optionItem) => {
          if (optionItem.slug === option) {
            return { ...optionItem, active: value };
          }
          return optionItem;
        })
      };
    }
    return filterItem;
  })
});

export const getRouterNewDataWithFilters = (
  newFilters: ActiveFilter[],
  query: NextRouter['query']
) => {
  const { path, ...params } = getQueryParamsWithoutFacets(query);

  const filters = {};
  newFilters.forEach((filter) => {
    if (filters[filter.filterSlug]) {
      filters[filter.filterSlug] += `,"${filter.optionSlug}"`;
    } else {
      filters[filter.filterSlug] = `"${filter.optionSlug}"`;
    }
  });

  return {
    pathname: Array.isArray(path) ? path.join('/') : path,
    query: { ...params, offset: '0', ...filters }
  };
};

const filterTitle = 'Filtrar productos';

export const getFilterList = (
  query: { brands: string | string[]; categories: string | string[] },
  facets: Facet,
  categoryList: CtCategory
) => {
  const filters: FacetFilter = {
    [CATEGORIES]: unwrapFromArray(query.categories),
    [BRAND]: unwrapFromArray(query.brands)
  };

  const categoryMap = mapCategories(categoryList);

  const productTypes = categoryMap[2];

  return {
    title: filterTitle,
    filters: getFiltersFromFacets(facets, filters, productTypes)
  };
};
