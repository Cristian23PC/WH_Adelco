import { type ActiveFilter } from '../FilterMenu/types';

export type HandleFilterClickFn = (
  filterSlug: string,
  optionSlug: string,
  optionValue: boolean,
  title: string
) => ActiveFilter[];

export interface ActiveFilters {
  filterSlug: string;
  optionSlug: string;
  title: string;
}

export interface ChangeFilterParams extends ActiveFilters {
  optionValue: boolean;
}
