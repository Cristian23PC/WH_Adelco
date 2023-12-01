import React from 'react';
import { Button, Icon, Modal } from '../../../../uikit';
import { type ModalProps } from '../../../../uikit/feedback/Modal/Modal';
import useScreen from '../../../../utils/hooks/useScreen';

const DEFAULT_LITERALS = {
  title: 'Actualización',
  descriptions: ['Se ha actualizado el carrito de compras'],
  continueButtonLabel: 'Aceptar',
  declineButtonLabel: ''
};

export interface CartUpdateModalProps extends ModalProps {
  id?: string;
  'data-testid'?: string;
  onContinue?: () => void;
  onDecline?: () => void;
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]?: (typeof DEFAULT_LITERALS)[key];
  };
  isLoading?: boolean;
}

const CartUpdateModal: React.FC<CartUpdateModalProps> = ({
  open,
  onContinue,
  onDecline,
  onClose,
  isLoading,
  literals = {},
  id = 'cart-update-modal',
  'data-testid': testId = 'adelco-cart-update-modal',
  ...props
}) => {
  const { isMobile } = useScreen();

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <Modal
      data-testid={testId}
      id={id}
      onClose={() => {
        !isLoading && onClose();
      }}
      open={open}
      {...props}
    >
      <div className="flex flex-col items-center gap-8 text-sm pb-4 w-64 tablet:w-[300px]">
        <Icon
          name="update_cart"
          width={50}
          height={51}
          className="fill-corporative-01"
        />

        <div className="flex flex-col items-center gap-2.5">
          <h3 className="text-base font-semibold">{l.title}</h3>
          <div className="flex flex-col items-center gap-4">
            {l.descriptions.map((description) => (
              <p key={description}>{description}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          {l.declineButtonLabel && (
            <Button
              size={isMobile ? 'md' : 'sm'}
              onClick={onDecline}
              variant="tertiary"
              data-testid="adelco-cart-update-modal-decline-button"
              disabled={isLoading}
            >
              {l.declineButtonLabel}
            </Button>
          )}
          {l.continueButtonLabel && (
            <Button
              size={isMobile ? 'md' : 'sm'}
              onClick={onContinue}
              variant="secondary"
              data-testid="adelco-cart-update-modal-continue-button"
              loading={isLoading}
              disabled={isLoading}
            >
              {l.continueButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CartUpdateModal;
