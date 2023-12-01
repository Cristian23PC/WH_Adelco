import React from 'react';
import { type ComponentStory, type ComponentMeta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import Filters from './Filters';
import { Button } from '../../uikit';
import {
  mockCategoryList,
  mockFilterList,
  mockStockFilter
} from '../../uikit/navigation/FilterMenu/mocks';
import useScreen from '../../utils/hooks/useScreen/useScreen';
import {
  type FilterList,
  type StockFilter
} from '../../uikit/navigation/FilterMenu/types';

export default {
  title: 'PLP/Filters',
  component: Filters,
  decorators: [withDesign]
} as ComponentMeta<typeof Filters>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: ''
  }
};

const Template: ComponentStory<typeof Filters> = (args) => {
  const [open, setOpen] = React.useState(false);
  const [categoryList] = React.useState(mockCategoryList);
  const [filterList, setFilterList] = React.useState(mockFilterList);
  const [filterListToApply, setFilterListToApply] =
    React.useState<FilterList | null>(null);
  const [stockFilter, setStockFilter] = React.useState(mockStockFilter);
  const [stockFilterToApply, setStockFilterToApply] =
    React.useState<StockFilter | null>(null);
  const { isDesktop } = useScreen();

  React.useEffect(() => {
    if (isDesktop && open) {
      onClose();
    }
  }, [isDesktop, open]);

  const clearFiltersToApply = (): void => {
    setFilterListToApply(null);
    setStockFilterToApply(null);
  };

  const getFilterListStatus = (
    filterList: any,
    filter: string,
    option: string,
    value: boolean
  ): any => ({
    ...filterList,
    filters: filterList.filters.map((filterItem: any) => {
      if (filterItem.slug === filter) {
        return {
          ...filterItem,
          options: filterItem.options.map((optionItem: any) => {
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

  const handleFilterClick = (
    filter: string,
    option: string,
    value: boolean,
    applyChanges: boolean
  ): void => {
    if (filter === stockFilter.slug) {
      const newStockFilter = { ...stockFilter, active: value };
      if (applyChanges) {
        setStockFilter(newStockFilter);
        setStockFilterToApply(null);
      } else {
        setStockFilterToApply(newStockFilter);
      }
    } else {
      if (applyChanges) {
        const newFilterList = getFilterListStatus(
          filterList,
          filter,
          option,
          value
        );

        setFilterList(newFilterList);
        setFilterListToApply(null);
      } else {
        const newFilterList = getFilterListStatus(
          filterListToApply ?? filterList,
          filter,
          option,
          value
        );

        setFilterListToApply(newFilterList);
      }
    }
  };

  React.useEffect(() => {
    setOpen(args.open);
  }, [args.open]);

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  const onClose = (): void => {
    setOpen(false);
    clearFiltersToApply();
  };

  const onClear = (): void => {
    onClose();
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
  };

  const onApply = (): void => {
    if (filterListToApply) {
      setFilterList(filterListToApply);
    }
    if (stockFilterToApply) {
      setStockFilter(stockFilterToApply);
    }

    onClose();
  };

  return (
    <>
      {!isDesktop && (
        <Button onClick={toggleOpen} variant="tertiary" iconName="filter" />
      )}
      <Filters
        {...args}
        className="desktop:w-52"
        open={open}
        onClose={onClose}
        linkRenderer={(key, label) => <div key={key}>{label}</div>}
        categoryList={categoryList}
        filterList={filterListToApply ?? filterList}
        stockFilter={stockFilterToApply ?? stockFilter}
        onClear={onClear}
        onChangeFilters={handleFilterClick}
        onApply={onApply}
      />
    </>
  );
};
export const Default = Template.bind({});
Default.storyName = 'Filters';
Default.parameters = designParameters;
Default.args = {
  title: 'Categorías relacionadas'
};
