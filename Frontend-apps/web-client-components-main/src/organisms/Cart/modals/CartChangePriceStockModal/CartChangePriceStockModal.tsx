/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { CartUpdateModal, type CartUpdateModalProps } from '../CartUpdateModal';

export interface CartChangePriceStockModalProps
  extends Omit<CartUpdateModalProps, 'id' | 'data-testid'> {
  cartUpdates?: {
    isQuantityUpdated?: boolean;
    isPriceUpdated?: boolean;
  };
}

const CartChangePriceStockModal: React.FC<CartChangePriceStockModalProps> = ({
  literals,
  cartUpdates = {},
  ...props
}) => {
  const { isQuantityUpdated, isPriceUpdated } = cartUpdates;

  const DEFAULT_DESCRIPTION =
    isQuantityUpdated && isPriceUpdated
      ? 'Se han actualizado los precios y stock de algunos productos.'
      : isQuantityUpdated
      ? 'Algunos productos del carrito se encuentran sin stock.'
      : 'Algunos productos del carrito han cambiado de precio.';

  const l = {
    descriptions: [DEFAULT_DESCRIPTION],
    ...literals
  };

  return (
    <CartUpdateModal
      {...props}
      id="cart-change-price-stock-modal"
      data-testid="adelco-cart-change-price-stock-modal"
      literals={l}
    />
  );
};

export default CartChangePriceStockModal;
