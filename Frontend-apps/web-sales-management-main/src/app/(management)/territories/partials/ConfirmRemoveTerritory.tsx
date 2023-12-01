import { Button } from '@adelco/web-components';
import { FC } from 'react';

interface ConfirmRemoveTerritoryProps {
  onSubmit: VoidFunction;
  onCancel: VoidFunction;
  isLoading: boolean;
}

const ConfirmRemoveTerritory: FC<ConfirmRemoveTerritoryProps> = ({
  onCancel,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="w-[300px]">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="font-semibold">Eliminar territorio</div>
          <div className="text-sm">
            Si se elimina este territorio, la acción no se podrá deshacer.
          </div>
        </div>
        <div className="flex grow gap-[10px]">
          <Button
            variant="tertiary"
            size="sm"
            className="grow"
            onClick={onCancel}
          >
            Mantener
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="grow"
            onClick={onSubmit}
            loading={isLoading}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveTerritory;
