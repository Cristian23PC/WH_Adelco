import classNames from 'classnames';
import React, { useState, type FC, type ReactNode } from 'react';
import { Button } from '../../actions';
import { Chip, Icon } from '../../feedback';
import SubFilterDropdown from './components/FilterDropdownSubMenu';
import {
  type StockFilter,
  type ActiveFilter,
  type FilterList
} from '../FilterMenu/types';
import { type HandleFilterClickFn } from './types';
import { Switch } from '../../input';

const DEFAULT_LITERALS = {
  filterLbl: 'Filtrar productos',
  clearBtn: 'Limpiar',
  applyBtn: 'Aplicar'
};

export interface FilterDropdownMenuProps {
  'data-testid'?: string;
  filterList: FilterList;
  onFilterClick: HandleFilterClickFn;
  activeFilters: ActiveFilter[];
  stockFilter: StockFilter;
  onClear: () => void;
  className?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
  customFilterComponent?: ReactNode;
}

const FilterDropdownMenu: FC<FilterDropdownMenuProps> = ({
  filterList,
  onClear,
  literals,
  className,
  activeFilters,
  onFilterClick,
  stockFilter,
  'data-testid': testId = 'filter-dropdown-menu-adelco',
  customFilterComponent
}) => {
  const [open, setOpen] = useState<boolean>(true);

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div
      data-testid={testId}
      className={classNames(
        'bg-white overflow-hidden rounded-2xl duration-300 shadow-card',
        {
          'max-h-[500vh]': open,
          'max-h-[52px]': !open
        },
        className
      )}
    >
      <div
        className="flex items-center p-4 cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Icon name="filter" className="mr-1" />
        <span className="text-sm">{l.filterLbl}</span>
      </div>
      <div className="flex flex-col gap-4 px-4 pb-6">
        <div className="flex gap-2 flex-wrap">
          {activeFilters.map((filter) => {
            if (filter.filterSlug === stockFilter.slug) {
              return null;
            }

            return (
              <Chip
                key={filter.optionSlug}
                label={filter.title}
                onClose={() => {
                  onFilterClick(
                    filter.filterSlug,
                    filter.optionSlug,
                    false,
                    filter.title
                  );
                }}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center font-body text-xs text-corporative-02">
          <span>{stockFilter.title}</span>
          <Switch
            name="filter-stock"
            variant="sm"
            checked={stockFilter.active}
            data-testid="adelco-filter-stock-switch-desktop"
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

        {customFilterComponent}
        {filterList.filters.map((menu, index) => {
          return (
            <SubFilterDropdown
              filterGroupSlug={menu.slug}
              key={menu.slug}
              title={menu.title}
              items={menu.options}
              onChangeFilters={onFilterClick}
              openByDefault={index === 0}
            />
          );
        })}
        <div className="flex gap-2">
          <Button variant="tertiary" size="xs" onClick={onClear} block>
            {l.clearBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdownMenu;
