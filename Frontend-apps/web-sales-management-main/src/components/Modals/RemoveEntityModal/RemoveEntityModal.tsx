import { Button } from '@adelco/web-components';
import { FC } from 'react';
import classNames from 'classnames';

const DEFAULT_LITERALS = {
  title: 'Eliminar entidad',
  subtitle: '',
  text: 'Si se elimina esta entidad, la acción no se podrá deshacer.',
  submitButton: 'Eliminar',
  cancelButton: 'Mantener'
};

interface RemoveEntityModalProps {
  onSubmit: VoidFunction;
  onCancel?: VoidFunction;
  isLoading: boolean;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
  className?: string;
}

const RemoveEntityModal: FC<RemoveEntityModalProps> = ({
  onCancel,
  onSubmit,
  isLoading,
  literals,
  className
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  return (
    <div className={classNames('w-[300px]', className)}>
      <h3 className="mb-2 font-semibold">{l.title}</h3>
      {l.subtitle && <h2 className="mb-2 font-semibold">{l.subtitle}</h2>}
      <p className="text-sm mb-4">{l.text}</p>
      <div className="flex gap-2.5">
        {onCancel && (
          <Button
            variant="tertiary"
            size="sm"
            className="grow"
            onClick={onCancel}
          >
            {l.cancelButton}
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="grow"
          onClick={onSubmit}
          loading={isLoading}
        >
          {l.submitButton}
        </Button>
      </div>
    </div>
  );
};

export default RemoveEntityModal;
