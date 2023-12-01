import { FC } from 'react';
import classnames from 'classnames';
import { gridClasses, colSpanClasses } from './utils';

export interface TableHeaderProps {
  gridSizes?: number[];
  headerLabels?: string[];
}

const TableHeader: FC<TableHeaderProps> = ({
  headerLabels = [],
  gridSizes = []
}) => {
  return (
    <ul
      className={classnames(
        gridSizes.length == 0 && gridClasses[headerLabels.length],
        gridSizes.length > 0 && 'grid-cols-12',
        'grid w-full items-center',
        'rounded-lg bg-snow px-2 text-xs'
      )}
    >
      {headerLabels.map((label, index) => (
        <li
          key={index}
          className={classnames('px-2 py-3', colSpanClasses[gridSizes[index]])}
        >
          {label}
        </li>
      ))}
    </ul>
  );
};

export default TableHeader;
