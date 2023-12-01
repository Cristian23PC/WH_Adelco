import { FC } from 'react';
import Table from '@/components/Table';
import { Button, Paginator } from '@adelco/web-components';
import { Zone, ZoneManager } from '@/types/Zones';

interface ZonesTableProps {
  zones: Zone[];
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  onViewItem: (item?: any) => void;
}

const ZonesTable: FC<ZonesTableProps> = ({
  zones,
  page,
  setPage,
  totalPages,
  onViewItem
}) => {
  const getManagerFullName = (zoneManager?: ZoneManager) =>
    [zoneManager?.firstName, zoneManager?.lastName].filter(Boolean).join(' ');

  const mapTableRows = (results: Zone[] | undefined) => {
    return results?.map((zone: Zone, index) => [
      zone.name,
      getManagerFullName(zone?.zoneManager),
      zone.branchesCounter,
      <Button
        key={index}
        size="xs"
        variant="tertiary"
        className="ml-auto"
        onClick={() => onViewItem(zone)}
      >
        Ver más
      </Button>
    ]);
  };

  return (
    <div className="mt-6 flex w-m-[999px] flex-col items-center rounded-2xl bg-white p-4">
      <Table
        gridSizes={[4, 4, 2, 2]}
        headerLabels={[
          'Nombre',
          'Gerente',
          'Surcursales',
          '' // actions
        ]}
        tableRows={mapTableRows(zones)}
      />
      <div className="mb-4 mt-14 flex justify-center">
        <Paginator
          totalPages={totalPages}
          currentPage={page}
          onClick={setPage}
        />
      </div>
    </div>
  );
};

export default ZonesTable;
