import { Button } from '@adelco/web-components';
import { FC } from 'react';

interface ConfirmDiscardChangesProps {
  onSubmit: VoidFunction;
  onCancel: VoidFunction;
  isLoading: boolean;
  text?: string;
}

const ConfirmDiscardChanges: FC<ConfirmDiscardChangesProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  text
}) => {
  return (
    <div className="w-[300px] grid gap-4">
      <div className="grid gap-2">
        <div className="font-semibold">Existen cambios sin guardar</div>
        <div className="text-sm">
          {text ||
            'Para ver los cambios reflejados en el territorio es necesario guardarlos.'}
        </div>
      </div>
      <div className="flex grow gap-[10px]">
        <Button
          variant="tertiary"
          size="sm"
          className="grow"
          onClick={onCancel}
        >
          Descartar
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="grow"
          onClick={onSubmit}
          loading={isLoading}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDiscardChanges;
