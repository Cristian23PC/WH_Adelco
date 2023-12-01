import React, { useState, type FC } from 'react';
import { OptionCheck } from '../../../input';
import { Accordion } from '../../../structure';
import { type FilterOption } from '../../FilterMenu/types';
import { type HandleFilterClickFn } from '../types';

interface SubMenuProps {
  title: string;
  items: FilterOption[];
  filterGroupSlug: string;
  onChangeFilters: HandleFilterClickFn;
  openByDefault?: boolean;
}
const SubFilterDropdown: FC<SubMenuProps> = ({
  title,
  items,
  filterGroupSlug,
  onChangeFilters,
  openByDefault = false
}) => {
  const [open, setOpen] = useState(openByDefault);

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  return (
    <Accordion title={title} open={open} onClick={toggleOpen}>
      <div className="flex flex-col gap-y-2 mt-2 max-h-64 overflow-y-auto">
        {items.map((item, index) => {
          return (
            <OptionCheck
              className="tablet:w-auto w-auto"
              checked={item.active}
              key={`${index}_${item.slug}`}
              label={`${item.title} (${item.count})`}
              onChange={() => {
                onChangeFilters(
                  filterGroupSlug,
                  item.slug,
                  !item.active,
                  item.title
                );
              }}
            />
          );
        })}
      </div>
    </Accordion>
  );
};

export default SubFilterDropdown;
