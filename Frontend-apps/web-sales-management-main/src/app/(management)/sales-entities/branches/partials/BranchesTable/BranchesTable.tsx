import { FC } from 'react';
import Table from '@/components/Table';
import { Button, Paginator } from '@adelco/web-components';
import { Branch } from '@/types/Branch';

interface BranchesTableProps {
  branches: Branch[];
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  onClickView: (branch: Branch) => void;
}

const BranchesTable: FC<BranchesTableProps> = ({
  branches,
  page,
  setPage,
  totalPages,
  onClickView
}) => {
  return (
    <div className="flex flex-col rounded-[24px] bg-white p-4 gap-10 items-center">
      <Table
        headerLabels={['Nombre', 'Zona', 'Areas Supervisadas', '']}
        gridSizes={[4, 5, 2, 1]}
        tableRows={branches.map((branch) => [
          branch.name,
          branch.zone?.name,
          branch.supervisedAreasCounter,
          <Button
            variant="tertiary"
            size="xs"
            className="ml-auto"
            key={branch.id}
            onClick={() => onClickView(branch)}
          >
            Ver más
          </Button>
        ])}
      />
      {totalPages > 1 && (
        <Paginator
          totalPages={totalPages}
          currentPage={page}
          onClick={setPage}
        />
      )}
    </div>
  );
};

export default BranchesTable;
