import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';

import { Button } from '../../actions/Button';
import FilterMenu from './FilterMenu';
import {
  mockCategoryList,
  mockFilterList,
  mockLinkRenderer,
  mockStockFilter
} from './mocks';
import { getActiveFilters } from '../FilterDropdownMenu/utils';
import { type ActiveFilter } from './types';

export default {
  title: 'Ui Kit/Navigation/FilterMenu',
  component: FilterMenu
} as ComponentMeta<typeof FilterMenu>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?type=design&node-id=1336-2965&t=wE4KERxSozP3shXw-4'
  }
};

const Template: ComponentStory<typeof FilterMenu> = (args) => {
  const [open, setOpen] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState(mockCategoryList);
  const [filterList, setFilterList] = React.useState(mockFilterList);
  const [activeFilters, setActiveFilters] = React.useState(
    getActiveFilters(mockFilterList, mockStockFilter)
  );
  const [stockFilter, setStockFilter] = React.useState(mockStockFilter);

  React.useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  const onClose = (): void => {
    setOpen(false);
  };

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

  const handleCategoryClick = (slug: string): void => {
    const newCategoryList = categoryList.map((section) => ({
      ...section,
      categories: section.categories.map((category) => {
        if (category.slug === slug) {
          return { ...category, active: true };
        }
        return { ...category, active: false };
      })
    }));

    setCategoryList(newCategoryList);
  };

  return (
    <>
      <Button onClick={toggleOpen} variant="tertiary" iconName="filter" />
      <FilterMenu
        {...args}
        open={open}
        onClose={onClose}
        linkRenderer={mockLinkRenderer(handleCategoryClick)}
        onFilterClick={handleFilterClick}
        categoryList={categoryList}
        filterList={filterList}
        stockFilter={stockFilter}
        onClear={onClearFilters}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  open: false,
  title: 'Categorías relacionadas'
};
Default.parameters = designParameters;
Default.storyName = 'FilterMenu';
