import { type StockFilter, type FilterList } from '../FilterMenu/types';
import { type ActiveFilters } from './types';

export const getActiveFilters = (
  filterList: FilterList,
  stockFilter: StockFilter
): ActiveFilters[] => {
  const activeFilters: ActiveFilters[] = [];

  filterList.filters.forEach((filter) => {
    filter.options.forEach((option) => {
      if (option.active) {
        activeFilters.push({
          filterSlug: filter.slug,
          optionSlug: option.slug,
          title: option.title
        });
      }
    });
  });

  activeFilters.push({
    filterSlug: stockFilter.slug,
    optionSlug: String(stockFilter.active),
    title: stockFilter.title
  });

  return activeFilters;
};
