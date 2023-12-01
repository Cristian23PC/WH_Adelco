import { ActiveFilters } from 'am-ts-components/dist/src/uikit/navigation/FilterDropdownMenu/types';
import { FilterList } from 'am-ts-components/dist/src/uikit/navigation/FilterMenu/types';

export const getActiveFilters = (filterList: FilterList): ActiveFilters[] => {
  const activeFilters = filterList.filters.flatMap((filter) => {
    return filter.options
      .filter((option) => option.active)
      .map((option) => ({
        filterSlug: filter.slug,
        optionSlug: option.slug,
        title: option.title,
      }));
  });

  return activeFilters;
};
