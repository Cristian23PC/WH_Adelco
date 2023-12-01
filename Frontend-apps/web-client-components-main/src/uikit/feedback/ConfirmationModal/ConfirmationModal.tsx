import React, { type FC } from 'react';
import classNames from 'classnames';
import { Modal } from '../Modal';
import { Button } from '../../actions';
import { Icon } from '../Icon';

export const DEFAULT_LITERALS = {
  confirmButtonLabel: 'Sí',
  cancelButtonLabel: 'No'
};

export interface ConfirmationModalProps {
  open?: boolean;
  message: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  isMobile?: boolean;
  onClose: VoidFunction;
  onSubmit: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  open = false,
  message,
  literals,
  isMobile = false,
  onClose,
  onSubmit
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-100">
        <div className="flex justify-center text-corporative-01">
          <Icon
            name="error"
            width={isMobile ? 50 : 60}
            height={isMobile ? 50 : 60}
            className="fill-current"
          />
        </div>
        <div className="mt-4 tablet:mt-8">
          <p className="font-sans font-semibold text-base">{message}</p>
        </div>
        <div
          className={classNames(
            'grid grid-cols-2 gap-2.5 items-center justify-around',
            'mt-4 tablet:mt-8 w-100 tablet:w-[300px] py-4'
          )}
        >
          <div className="w-100">
            <Button
              variant="tertiary"
              onClick={onClose}
              className="w-full"
              size={isMobile ? 'md' : 'sm'}
            >
              {l.cancelButtonLabel}
            </Button>
          </div>
          <div className="w-100">
            <Button
              onClick={onSubmit}
              variant="secondary"
              className="w-full"
              size={isMobile ? 'md' : 'sm'}
            >
              {l.confirmButtonLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
