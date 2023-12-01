import React, { type ReactNode } from 'react';
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor
} from '@testing-library/react';
import Cart, { DEFAULT_LITERALS } from './Cart';
import examples from './examples.json';
import { type Target } from '../../../utils/types';

const onDeleteMock = jest.fn();
const onChangeQualityMock = jest.fn();
const onEmptyCartMock = jest.fn();
const onConfirmMock = jest.fn();

describe('Cart component', () => {
  const testId = 'adelco-cart';
  const cardTestId = 'adelco-cart-item-card';
  const args = {
    subtotal: '$21.513',
    discountTotal: '$2.437',
    taxes: [
      { description: 'IVA', amount: '$3.624' },
      { description: 'Imp varios', amount: '$1.200' }
    ],
    totalPrice: '$22.700',
    keepBuyingUrl: '#',
    linkRenderer: (link: string, label: ReactNode, target?: Target) => (
      <a data-testid="link-rendered" href={link} target={target}>
        {label}
      </a>
    )
  };
  beforeEach(async () => {
    await act(async () => {
      render(
        <Cart
          lineItems={examples}
          {...args}
          onDeleteItem={onDeleteMock}
          onChangeItemsQuantity={onChangeQualityMock}
          onEmptyCart={onEmptyCartMock}
          onConfirm={onConfirmMock}
        />
      );
    });
  });

  it('should render the component in default resolution', async () => {
    await act(async () => {
      global.innerWidth = 1340;
      global.dispatchEvent(new Event('resize'));
    });
    expect(screen.getByTestId(testId)).toBeInTheDocument();
    expect(screen.getAllByTestId(cardTestId).length).toBe(9);
  });

  it('should display price bar component if it is on mobile resolution', async () => {
    await act(async () => {
      render(
        <Cart
          lineItems={examples}
          {...args}
          onDeleteItem={onDeleteMock}
          onChangeItemsQuantity={onChangeQualityMock}
          onEmptyCart={onEmptyCartMock}
          onConfirm={onConfirmMock}
        />
      );
    });

    await act(async () => {
      global.innerWidth = 320;
      global.dispatchEvent(new Event('resize'));
    });
    expect(
      screen.getAllByTestId('adelco-bottom-price-bar')[0]
    ).toBeInTheDocument();
  });

  it('should call the confirmation modal and call confirm action', async () => {
    const btn = screen.getByText(DEFAULT_LITERALS.emptyCartAction);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    const modal = screen.getByTestId('adelco-modal');
    expect(modal).toBeInTheDocument();
    const confirmBtn = modal.querySelector('button.bg-corporative-03');
    expect(confirmBtn).toBeInTheDocument();
    if (confirmBtn != null) {
      fireEvent.click(confirmBtn);
    }
    expect(onEmptyCartMock).toHaveBeenCalled();
  });

  it('should close the modal', async () => {
    const btn = screen.getByText(DEFAULT_LITERALS.emptyCartAction);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    const modal = screen.getByTestId('adelco-modal');
    expect(modal).toBeInTheDocument();
    const closeBtn = modal
      .querySelector('div[data-testid="adelco-modal-header"]')
      ?.querySelector('svg');
    expect(closeBtn).toBeInTheDocument();
    if (closeBtn != null) {
      fireEvent.click(closeBtn);
    }
    await waitFor(() => {
      expect(screen.queryByTestId('adelco-modal')).not.toBeInTheDocument();
    });
  });

  it('should call changeQuantity fn', () => {
    const btn = screen
      .getAllByText(examples[0].price)[0]
      ?.nextElementSibling?.querySelectorAll('button')[1];
    expect(btn).toBeInTheDocument();
    if (btn != null) {
      fireEvent.click(btn);
    }
    expect(onChangeQualityMock).toHaveBeenCalled();
  });

  it('should have disabled buttons', async () => {
    const card = screen.getAllByTestId('adelco-cart-item-card')[8];
    expect(card).toBeInTheDocument();
    const spinner = card?.querySelector('svg[data-testid="icon-spinner"]');
    expect(spinner).toBeInTheDocument();
    const btns = card?.querySelectorAll('button');
    expect(btns[2]?.querySelector('svg')).toHaveAttribute(
      'data-testid',
      'icon-remove'
    );
    expect(btns[2]).toHaveAttribute('disabled');
    expect(btns[3]?.querySelector('svg')).toHaveAttribute(
      'data-testid',
      'icon-add'
    );
    expect(btns[3]).toHaveAttribute('disabled');
  });

  it('should call the onDelete fn', () => {
    const btn = screen
      .getAllByTestId(cardTestId)[0]
      .querySelector('div.gap-2')
      ?.querySelector('button');

    expect(btn).toBeInTheDocument();
    if (btn != null) {
      fireEvent.click(btn);
    }
    expect(onDeleteMock).toHaveBeenCalled();
  });

  it('should display emptyCart component when there are no lineItems', async () => {
    await act(async () => {
      render(
        <Cart
          {...args}
          onDeleteItem={onDeleteMock}
          onChangeItemsQuantity={onChangeQualityMock}
          onEmptyCart={onEmptyCartMock}
          onConfirm={onConfirmMock}
        />
      );
    });

    expect(screen.getByTestId('adelco-empty-cart')).toBeInTheDocument();
  });

  it('should display checkout feedback error', async () => {
    await act(async () => {
      render(
        <Cart
          {...args}
          lineItems={examples}
          onDeleteItem={onDeleteMock}
          onChangeItemsQuantity={onChangeQualityMock}
          onEmptyCart={onEmptyCartMock}
          onConfirm={onConfirmMock}
          minImportError="Aun no cumple el mínimo de compra"
          freeDelivery={false}
        />
      );
    });
    const errorBanner = screen.getByTestId('adelco-checkout-feedback');
    expect(errorBanner).toBeInTheDocument();
    expect(errorBanner).toHaveClass('border-failure');
  });

  it('should display checkout success', async () => {
    await act(async () => {
      render(
        <Cart
          {...args}
          lineItems={examples}
          onDeleteItem={onDeleteMock}
          onChangeItemsQuantity={onChangeQualityMock}
          onEmptyCart={onEmptyCartMock}
          onConfirm={onConfirmMock}
          freeDelivery={true}
        />
      );
    });
    const banner = screen.getByTestId('adelco-checkout-feedback');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('text-success');
  });

  it('should show update cart warning modal', async () => {
    await act(async () => {
      render(
        <Cart
          lineItems={examples}
          {...args}
          onDeleteItem={onDeleteMock}
          onChangeItemsQuantity={onChangeQualityMock}
          onEmptyCart={onEmptyCartMock}
          onConfirm={onConfirmMock}
          cartUpdates={{ isPriceUpdated: true, isQuantityUpdated: false }}
        />
      );
    });

    expect(
      screen.getByTestId('adelco-cart-change-price-stock-modal')
    ).toBeInTheDocument();
  });
});
