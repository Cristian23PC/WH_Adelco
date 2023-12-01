import React from 'react';
import { render, screen } from '@testing-library/react';
import CartChangePriceStockModal from './CartChangePriceStockModal';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onContinue: jest.fn(),
  onDecline: jest.fn()
};

describe('CartChangePriceStockModal', () => {
  it('should render CartChangePriceStockModal with default props and missing stock description', () => {
    render(
      <CartChangePriceStockModal
        {...defaultProps}
        cartUpdates={{
          isQuantityUpdated: true,
          isPriceUpdated: false
        }}
      />
    );

    expect(
      screen.getByTestId('adelco-cart-change-price-stock-modal')
    ).toBeInTheDocument();
    expect(screen.getByText('Actualización')).toBeInTheDocument();
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
    expect(
      screen.getByText('Algunos productos del carrito se encuentran sin stock.')
    ).toBeInTheDocument();
  });

  it('should render CartChangePriceStockModal with price changes description', () => {
    render(
      <CartChangePriceStockModal
        {...defaultProps}
        cartUpdates={{
          isQuantityUpdated: false,
          isPriceUpdated: true
        }}
      />
    );

    expect(
      screen.getByText('Algunos productos del carrito han cambiado de precio.')
    ).toBeInTheDocument();
  });

  it('should render CartChangePriceStockModal with price changes and missing stock description', () => {
    render(
      <CartChangePriceStockModal
        {...defaultProps}
        cartUpdates={{
          isQuantityUpdated: true,
          isPriceUpdated: true
        }}
      />
    );

    expect(
      screen.getByText(
        'Se han actualizado los precios y stock de algunos productos.'
      )
    ).toBeInTheDocument();
  });
});
