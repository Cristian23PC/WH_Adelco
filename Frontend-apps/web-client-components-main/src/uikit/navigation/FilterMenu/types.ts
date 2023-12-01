export interface FilterOption {
  title: string;
  slug: string;
  count: number;
  active: boolean;
}
export interface CategoryOption extends FilterOption {}
export interface CategoryList {
  title: string;
  count: number;
  categories: CategoryOption[];
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

export type OnFilterClickFn = (
  filterSlug: string,
  optionSlug: string,
  optionValue: boolean,
  activeFilters?: ActiveFilter[]
) => void;
