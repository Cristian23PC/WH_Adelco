import { FC, ReactNode } from 'react';
import classnames from 'classnames';
import { gridClasses, colSpanClasses } from './utils';

export interface TableRowProps {
  rowData: (string | ReactNode)[];
  gridSizes?: number[];
}

const TableRow: FC<TableRowProps> = ({ rowData = [], gridSizes = [] }) => {
  return (
    <ul
      className={classnames(
        gridSizes.length == 0 && gridClasses[rowData.length],
        gridSizes.length > 0 && 'grid-cols-12',
        'grid w-full items-center',
        'rounded-lg border border-snow bg-white px-2 text-xs'
      )}
    >
      {rowData.map((cell, index) => (
        <li
          key={index}
          className={classnames(
            'p-2',
            gridSizes.length > 0 && colSpanClasses[gridSizes[index]]
          )}
        >
          {cell}
        </li>
      ))}
    </ul>
  );
};

export default TableRow;
