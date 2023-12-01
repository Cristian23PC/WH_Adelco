export interface FilterOption {
  title: string;
  slug: string;
  count: number;
  active: boolean;
}
export interface Filter {
  title: string;
  slug: string;
  options: FilterOption[];
}

export interface StockFilter extends Omit<Filter, 'options'> {
  active: boolean;
}
export interface FilterList {
  title: string;
  filters: Filter[];
}

export interface ActiveFilter {
  filterSlug: string;
  optionSlug: string;
  title: string;
}

export interface FilterContextType {
  activeFilters: ActiveFilter[];
  filterList: FilterList;
  showFilter: boolean;
  handleApply: (newFilters: ActiveFilter[]) => void;
  clearFilters: () => void;
  openFilters: () => void;
  closeFilters: () => void;
  trackSelectFilter: (category?: string, filters?: ActiveFilter[]) => void;
  removeActiveFilter: (filterSlug: string, optionSlug: string) => void;
  handleActiveFiltersChange: (filters: ActiveFilter[]) => void;
  handleFilterClick: (
    filterSlug: string,
    optionSlug: string,
    optionValue: boolean,
    applyChange: boolean
  ) => ActiveFilter[];
  stockFilter: StockFilter;
}
