import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';

import FilterDropdownMenu from './FilterDropdownMenu';
import { mockFilterList, mockStockFilter } from '../FilterMenu/mocks';
import { getActiveFilters } from './utils';
import { type ActiveFilter } from '../FilterMenu/types';

export default {
  title: 'Ui Kit/Navigation/FilterDropdownMenu',
  component: FilterDropdownMenu
} as ComponentMeta<typeof FilterDropdownMenu>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=1202%3A4797&t=MAAdK5Dvqn6FBntr-4'
  }
};

const Template: ComponentStory<typeof FilterDropdownMenu> = (args) => {
  const [filterList, setFilterList] = React.useState(mockFilterList);
  const [activeFilters, setActiveFilters] = React.useState(
    getActiveFilters(mockFilterList, mockStockFilter)
  );
  const [stockFilter, setStockFilter] = React.useState(mockStockFilter);

  const onClearFilters = (): void => {
    setStockFilter(mockStockFilter);
    setFilterList((prevState) => ({
      ...prevState,
      filters: filterList.filters.map((filterItem) => ({
        ...filterItem,
        options: filterItem.options.map((option) => ({
          ...option,
          active: false
        }))
      }))
    }));

    setActiveFilters(
      getActiveFilters(
        { filters: [], title: '' },
        { ...stockFilter, active: true }
      )
    );
  };

  const handleChangeFilter = (
    filter: string,
    option: string,
    value: boolean
  ): void => {
    if (filter === stockFilter.slug) {
      setStockFilter((prevValue) => ({ ...prevValue, active: value }));
    } else {
      const newFilterList = {
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
      };
      setFilterList(newFilterList);
    }
  };

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
    title: string
  ): ActiveFilter[] => {
    const newActiveFilters =
      filterSlug === stockFilter.slug
        ? handleStockFilterClick(filterSlug, optionSlug, title)
        : handleDropdownFilterClick(filterSlug, optionSlug, optionValue, title);

    setActiveFilters(newActiveFilters);
    handleChangeFilter(filterSlug, optionSlug, optionValue);

    return newActiveFilters;
  };

  return (
    <FilterDropdownMenu
      {...args}
      activeFilters={activeFilters}
      filterList={filterList}
      onFilterClick={handleFilterClick}
      onClear={onClearFilters}
      className="w-[207px]"
      stockFilter={stockFilter}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  filterList: mockFilterList
};
Default.parameters = designParameters;
Default.storyName = 'FilterDropdownMenu';
