import React, { type ReactNode, type FC } from 'react';
import { Accordion } from '../../../structure';
import { OptionCheck, Switch } from '../../../input';
import { type StockFilter, type FilterList } from '../types';
import { type HandleFilterClickFn } from '../../FilterDropdownMenu/types';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';

interface FiltersProps {
  filterList: FilterList;
  filtersState: boolean[];
  showTitle?: boolean;
  onToggleSection: (index: number) => void;
  onFilterClick: HandleFilterClickFn;
  stockFilter: StockFilter;
  customFilterComponent?: ReactNode;
}
const Filters: FC<FiltersProps> = ({
  filterList,
  showTitle,
  filtersState,
  onToggleSection,
  onFilterClick,
  stockFilter,
  customFilterComponent
}) => {
  const { isMobile } = useScreen();

  return (
    <>
      {showTitle && (
        <div className="mb-6 font-bold tablet:text-lg">{filterList.title}</div>
      )}
      <div className="flex justify-between items-center font-body text-sm tablet:text-xs text-corporative-02 mb-8 tablet:mb-10">
        <span>{stockFilter.title}</span>
        <Switch
          name="filter-stock"
          data-testid="adelco-filter-stock-switch-mobile"
          variant={isMobile ? 'lg' : 'md'}
          checked={stockFilter.active}
          onChange={(e) => {
            onFilterClick(
              stockFilter.slug,
              String(e.target.checked),
              e.target.checked,
              stockFilter.title
            );
          }}
        />
      </div>
      <div className="flex flex-col gap-2 tablet:gap-4">
        {customFilterComponent}
        {filterList.filters.map((filter, index) => (
          <Accordion
            key={filter.title}
            onClick={() => {
              onToggleSection(index);
            }}
            open={filtersState[index]}
            title={filter.title}
            data-testid="adelco-filter-list"
          >
            <div>
              {filter.options.map((option) => (
                <OptionCheck
                  onChange={() => {
                    onFilterClick(
                      filter.slug,
                      option.slug,
                      !option.active,
                      option.title
                    );
                  }}
                  className="w-full mt-2"
                  key={option.slug}
                  checked={option.active}
                  label={`${option.title} (${option.count})`}
                />
              ))}
            </div>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default Filters;
