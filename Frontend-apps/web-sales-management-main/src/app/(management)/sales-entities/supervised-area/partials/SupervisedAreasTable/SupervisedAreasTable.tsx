import { FC } from 'react';
import Table from '@/components/Table';
import { Button, Paginator } from '@adelco/web-components';
import { SupervisedArea } from '@/types/SupervisedAreas';

interface SupervisedAreasTableProps {
  supervisedAreas: SupervisedArea[];
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  onClickView: (supervisedArea: SupervisedArea) => void;
}

const SupervisedAreasTable: FC<SupervisedAreasTableProps> = ({
  supervisedAreas,
  page,
  setPage,
  totalPages,
  onClickView
}) => {
  return (
    <div className="flex flex-col rounded-[24px] bg-white p-4 gap-10 items-center">
      <Table
        headerLabels={['Nombre', 'Supervisor', 'Sucursal', 'Territorios', '']}
        gridSizes={[3, 3, 3, 2, 1]}
        tableRows={supervisedAreas.map((supervisedArea) => [
          supervisedArea.name,
          supervisedArea.supervisorName,
          supervisedArea.territory,
          supervisedArea.territoriesCounter,
          <Button
            variant="tertiary"
            size="xs"
            className="ml-auto"
            key={supervisedArea.id}
            onClick={() => onClickView(supervisedArea)}
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

export default SupervisedAreasTable;
