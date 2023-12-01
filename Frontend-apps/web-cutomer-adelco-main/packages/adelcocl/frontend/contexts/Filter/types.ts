import { FilterList, ActiveFilter } from 'am-ts-components/dist/src/uikit/navigation/FilterMenu/types';

export interface FilterContextType {
  activeFilters: ActiveFilter[];
  filterList: FilterList;
  showFilter: boolean;
  handleApply: (newFilters: ActiveFilter[]) => void;
  clearFilters: () => void;
  openFilters: () => void;
  closeFilters: () => void;
  removeActiveFilter: (filterSlug: string, optionSlug: string) => void;
  handleActiveFiltersChange: (filters: ActiveFilter[]) => void;
  handleFilterClick: (filterSlug: string, optionSlug: string, optionValue: boolean) => ActiveFilter[];
}
