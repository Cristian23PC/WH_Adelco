/* eslint-disable @typescript-eslint/indent */
import React, { type FC, useState, useEffect, type ReactNode } from 'react';
import { FilterDropdownMenu, FilterMenu } from '../../uikit';
import { type FilterDropdownMenuProps } from '../../uikit/navigation/FilterDropdownMenu/FilterDropdownMenu';
import { type FilterMenuProps } from '../../uikit/navigation/FilterMenu/FilterMenu';
import useScreen from '../../utils/hooks/useScreen/useScreen';
import { getActiveFilters } from '../../uikit/navigation/FilterDropdownMenu/utils';
import { type HandleFilterClickFn } from '../../uikit/navigation/FilterDropdownMenu/types';
import { type ActiveFilter } from '../../uikit/navigation/FilterMenu/types';

type FiltersPropsUnion = FilterDropdownMenuProps & FilterMenuProps;
export interface FiltersProps
  extends Omit<
    FiltersPropsUnion,
    'activeFilters' | 'onApply' | 'onFilterClick'
  > {
  onChangeFilters: (
    filterSlug: string,
    optionSlug: string,
    optionValue: boolean,
    applyChanges: boolean
  ) => void;
  onApply: (activeFilters: ActiveFilter[]) => void;
  customFilterComponent?: ReactNode;
}
const Filters: FC<FiltersProps> = (props) => {
  const {
    filterList,
    stockFilter,
    onApply,
    onChangeFilters,
    onClear,
    open,
    customFilterComponent
  } = props;

  const { isDesktop } = useScreen();
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(
    getActiveFilters(filterList, stockFilter)
  );

  useEffect(() => {
    const newActiveFilters = getActiveFilters(filterList, stockFilter);
    const shouldUpdateStockFilter =
      String(stockFilter?.active || '') !==
      newActiveFilters.find(
        (activeFilter) => activeFilter.filterSlug === stockFilter.slug
      )?.optionSlug;

    if (
      (newActiveFilters.length !== activeFilters.length ||
        shouldUpdateStockFilter) &&
      !open
    ) {
      setActiveFilters(newActiveFilters);
    }
  }, [filterList, stockFilter.active]);

  const handleStockFilterClick = (
    filterSlug: string,
    optionSlug: string,
    title: string
  ): ActiveFilter[] => {
    let newActiveFilters = [...activeFilters].filter(
      (filter) => filter.filterSlug !== filterSlug
    );

    newActiveFilters = [...newActiveFilters, { filterSlug, optionSlug, title }];

    return newActiveFilters;
  };

  const handleDropdownFilterClick = (
    filterSlug: string,
    optionSlug: string,
    optionValue: boolean,
    title: string
  ): ActiveFilter[] => {
    let newActiveFilters = [];
    if (optionValue) {
      newActiveFilters = [...activeFilters, { filterSlug, optionSlug, title }];
    } else {
      newActiveFilters = activeFilters.filter(
        (filter) =>
          filter.filterSlug !== filterSlug || filter.optionSlug !== optionSlug
      );
    }

    return newActiveFilters;
  };

  const handleFilterClick = (
    filterSlug: string,
    optionSlug: string,
    optionValue: boolean,
    title: string,
    applyChanges: boolean = false
  ): ActiveFilter[] => {
    const newActiveFilters =
      filterSlug === stockFilter.slug
        ? handleStockFilterClick(filterSlug, optionSlug, title)
        : handleDropdownFilterClick(filterSlug, optionSlug, optionValue, title);

    onChangeFilters(filterSlug, optionSlug, optionValue, applyChanges);

    if (applyChanges) {
      setActiveFilters(newActiveFilters);
    }

    return newActiveFilters;
  };

  const handleFilterClickOnDesktop: HandleFilterClickFn = (
    filterSlug,
    optionSlug,
    optionValue,
    title
  ) => {
    const newActiveFilters = handleFilterClick(
      filterSlug,
      optionSlug,
      optionValue,
      title,
      true
    );

    onApply(newActiveFilters ?? []);

    return newActiveFilters;
  };

  const handleClearFilters = (): void => {
    onClear();
    setActiveFilters(
      getActiveFilters(
        { filters: [], title: '' },
        { ...stockFilter, active: true }
      )
    );
  };

  const handleApplyFilters = (): void => {
    const activeFilters = getActiveFilters(filterList, stockFilter);

    setActiveFilters(activeFilters);
    onApply(activeFilters);
  };

  return (
    <>
      {isDesktop && (
        <FilterDropdownMenu
          {...props}
          activeFilters={activeFilters}
          onClear={handleClearFilters}
          onFilterClick={handleFilterClickOnDesktop}
          customFilterComponent={customFilterComponent}
        />
      )}
      {!isDesktop && (
        <FilterMenu
          {...props}
          onFilterClick={handleFilterClick}
          onClear={handleClearFilters}
          onApply={handleApplyFilters}
          customFilterComponent={customFilterComponent}
        />
      )}
    </>
  );
};

Filters.displayName = 'Filters';

export default Filters;
