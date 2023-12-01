import { FC } from 'react';

export interface HeaderDataTableProps {
  headerData:
    | {
        title: string;
        value: string | number | undefined;
      }[];
}

const HeaderDataTable: FC<HeaderDataTableProps> = ({ headerData = [] }) => {
  return (
    <>
      <ul className="rounded-lg border-[1px]">
        {headerData.map((row, index) => (
          <li
            key={index}
            className="p-2 text-left [&:not(:last-child)]:border-b-[1px]"
          >
            <p className="text-xs font-semibold">{row.title}</p>
            <p className="text-xs">{row.value}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default HeaderDataTable;
