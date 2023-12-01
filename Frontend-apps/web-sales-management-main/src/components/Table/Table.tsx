import { FC, ReactNode } from 'react';
import TableHeader from './partials/TableHeader';
import TableRow from './partials/TableRow';

export interface TableProps {
  headerLabels?: string[];
  gridSizes?: number[];
  tableRows?: (string | ReactNode)[][];
}

const Header: FC<TableProps> = ({
  headerLabels = [],
  tableRows = [],
  gridSizes = []
}) => {
  return (
    <div className="flex w-full flex-col gap-y-[10px] bg-white">
      <TableHeader headerLabels={headerLabels} gridSizes={gridSizes} />
      {tableRows.map((row, key) => (
        <TableRow key={key} rowData={row} gridSizes={gridSizes} />
      ))}
    </div>
  );
};

export default Header;
