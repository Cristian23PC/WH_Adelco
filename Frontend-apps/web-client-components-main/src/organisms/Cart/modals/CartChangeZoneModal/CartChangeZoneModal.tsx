import React from 'react';
import { CartUpdateModal, type CartUpdateModalProps } from '../CartUpdateModal';

const DEFAULT_LITERALS = {
  continueButtonLabel: 'Cambiar ubicación',
  declineButtonLabel: 'Mantener ubicación',
  descriptions: [
    'Al cambiar de ubicación tu carrito será eliminado.',
    '¿Estás seguro de continuar?'
  ]
};

export interface CartChangeZoneModalProps
  extends Omit<CartUpdateModalProps, 'id' | 'data-testid'> {}

const CartChangeZoneModal: React.FC<CartChangeZoneModalProps> = ({
  literals,
  ...props
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <CartUpdateModal
      {...props}
      id="cart-change-zone-modal"
      data-testid="adelco-cart-change-zone-modal"
      literals={l}
    />
  );
};

export default CartChangeZoneModal;
