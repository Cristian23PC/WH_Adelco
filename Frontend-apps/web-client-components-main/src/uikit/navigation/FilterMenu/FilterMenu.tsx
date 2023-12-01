import React, { useState, type FC, type ReactNode } from 'react';
import { OffCanvas } from '../../structure';
import { type LinkRenderer } from '../../../utils/types';
import { Button } from '../../actions';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import Footer from './partials/Footer';
import Filters from './partials/Filters';
import Categories from './partials/Categories';
import { type StockFilter, type CategoryList, type FilterList } from './types';
import { defaultLiterals } from './mocks';
import { type HandleFilterClickFn } from '../FilterDropdownMenu/types';

interface SectionsState {
  categories: boolean[];
  filters: boolean[];
}
export interface FilterMenuProps {
  title: string;
  open: boolean;
  onClose: VoidFunction;
  onClear: VoidFunction;
  onApply: VoidFunction;
  literals?: { [key in keyof typeof defaultLiterals]: string };
  categoryList?: CategoryList[];
  filterList: FilterList;
  stockFilter: StockFilter;
  onFilterClick: HandleFilterClickFn;
  linkRenderer: LinkRenderer;
  customFilterComponent?: ReactNode;
}
const FilterMenu: FC<FilterMenuProps> = ({
  open,
  categoryList = [],
  onFilterClick,
  filterList,
  onClose,
  onClear,
  onApply,
  literals = defaultLiterals,
  linkRenderer,
  title,
  stockFilter,
  customFilterComponent
}) => {
  const { isMobile } = useScreen();

  const isCategoryListPresent = categoryList.length > 0;

  const customLiterals = {
    ...defaultLiterals,
    ...literals
  };

  const [sectionsState, setSectionsState] = useState<SectionsState>({
    categories: new Array(categoryList.length).fill(false),
    filters: new Array(filterList.filters.length).fill(false)
  });

  const handleToggleCategories = (index: number): void => {
    setSectionsState((prevState) => ({
      ...prevState,
      categories: prevState.categories.map((category, i) =>
        index === i ? !category : category
      )
    }));
  };

  const handleToggleFilter = (index: number): void => {
    setSectionsState((prevState) => ({
      ...prevState,
      filters: prevState.filters.map((filter, i) =>
        index === i ? !filter : filter
      )
    }));
  };

  return (
    <OffCanvas
      show={open}
      data-testid="adelco-filter-menu"
      placement="right"
      onClose={onClose}
      className="pl-2 pr-3.5 tablet:px-4 flex flex-col gap-2 tablet:gap-0"
    >
      <div className="flex justify-between items-center pl-2 pr-0.5 py-2.5 tablet:mb-6 overflow-hidden text-lg font-bold shrink-0">
        <span className="whitespace-normal">
          {isCategoryListPresent ? title : filterList.title}
        </span>
        <Button
          data-testid="adelco-filter-menu-close"
          className="shrink-0"
          variant="tertiary"
          iconName="close"
          size={isMobile ? 'md' : 'sm'}
          onClick={onClose}
        />
      </div>

      <div className="text-corporative-03 pl-2 pr-2 pb-2 tablet:px-4 overflow-auto">
        {categoryList.map((category, index) => (
          <Categories
            key={category.title}
            onClick={() => {
              handleToggleCategories(index);
            }}
            categoryList={category}
            linkRenderer={linkRenderer}
            open={sectionsState.categories[index]}
          />
        ))}
        {isCategoryListPresent && (
          <div className="w-full h-px mb-4 border-b border-b-silver tablet:hidden"></div>
        )}
        <Filters
          showTitle={isCategoryListPresent}
          filterList={filterList}
          onFilterClick={onFilterClick}
          filtersState={sectionsState.filters}
          onToggleSection={handleToggleFilter}
          stockFilter={stockFilter}
          customFilterComponent={customFilterComponent}
        />
      </div>

      <Footer literals={customLiterals} onClear={onClear} onApply={onApply} />
    </OffCanvas>
  );
};

export default FilterMenu;
