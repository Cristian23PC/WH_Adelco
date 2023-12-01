/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { CartItemCard } from '../../../uikit/structure/CartItem/CartItemCard';

import { DEFAULT_LITERALS as MODAL_LITERALS } from '../../../uikit/feedback/ConfirmationModal/ConfirmationModal';
import BottomPriceBar, {
  DEFAULT_LITERALS as PRICE_BAR_LITERALS
} from '../../../uikit/structure/BottomPriceBar/BottomPriceBar';
import { Button } from '../../../uikit/actions';
import { ConfirmationModal, CheckoutFeedback } from '../../../uikit/feedback';
import { EmptyCart } from '../EmptyCart';
import type { LinkRenderer } from '../../../utils/types';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import { CartChangePriceStockModal } from '../modals';
import { type OnChangeQuantityError } from '../../../molecules/QuantitySelector/QuantitySelector';

export const DEFAULT_LITERALS = {
  cartHeader: 'Carro de Compra',
  emptyCartAction: 'Vaciar carro',
  summaryTitle: 'Resumen de tu pedido',
  totalProducts: 'Total productos',
  discount: 'Descuento',
  subtotal: 'Subtotal',
  totalToPay: 'Total a pagar',
  keepBuying: 'Seguir comprando',
  modalConfirmButtonLabel: 'Vaciar carro',
  modalMessage: '¿Estás seguro de vaciar tu carro?',
  priceBarButtonLabel: 'Crear pedido',
  freeDelivery: 'Despacho gratis'
};

interface LineItem {
  id: string;
  brandName: string;
  name: string;
  unitPrice: string;
  discount?: string;
  price: string;
  imageUrl: string;
  quantity: number;
  sellUnit: string;
  loading?: boolean;
  disabled?: boolean;
}

type OnChangeCartItemQuantityAsyncFunction = (
  id: string,
  units: number,
  currentUnits: number
) => Promise<undefined | OnChangeQuantityError> | undefined;

type OnChangeCartItemQuantitySyncFunction = (id: string, units: number) => void;

export type OnChangeCartItemQuantityFunction =
  | OnChangeCartItemQuantityAsyncFunction
  | OnChangeCartItemQuantitySyncFunction;

export interface CartProps {
  'data-testid'?: string;
  className?: string;
  lineItems?: LineItem[];
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  subtotal?: string;
  discountTotal?: string;
  taxes: Array<{
    description: string;
    amount: string;
  }>;
  totalPrice: string;
  minImportError?: string;
  freeDelivery?: boolean;
  createOrderDisabled?: boolean;
  onEmptyCart: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onConfirm: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDeleteItem: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    itemSku: string
  ) => void;
  onChangeItemsQuantity: OnChangeCartItemQuantityFunction;
  linkRenderer: LinkRenderer;
  keepBuyingUrl: string;
  cartUpdates?: {
    isQuantityUpdated?: boolean;
    isPriceUpdated?: boolean;
  };
  onAcceptCartUpdateWarning?: () => void;
}

const Cart: React.FC<CartProps> = ({
  'data-testid': dataTestId = 'adelco-cart',
  className,
  lineItems = [],
  literals,
  subtotal,
  discountTotal,
  taxes = [],
  totalPrice,
  minImportError,
  freeDelivery = false,
  createOrderDisabled = false,
  keepBuyingUrl,
  onEmptyCart,
  onConfirm,
  onDeleteItem,
  onChangeItemsQuantity,
  linkRenderer,
  cartUpdates,
  onAcceptCartUpdateWarning
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const ml = {
    ...MODAL_LITERALS,
    confirmButtonLabel: l.modalConfirmButtonLabel
  };

  const bl = {
    ...PRICE_BAR_LITERALS,
    submitBtnLabel: l.priceBarButtonLabel
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [updateWarningModalOpen, setUpdateWarningModalOpen] = useState(false);

  const showCartUpdateWarning =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    cartUpdates?.isQuantityUpdated || cartUpdates?.isPriceUpdated;

  useEffect(() => {
    setUpdateWarningModalOpen(Boolean(showCartUpdateWarning));
  }, [showCartUpdateWarning]);

  return (
    <>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSubmit={() => {
          onEmptyCart();
          setModalOpen(false);
        }}
        message={l.modalMessage}
        literals={ml}
      />
      <CartChangePriceStockModal
        open={updateWarningModalOpen}
        onClose={() => {
          setUpdateWarningModalOpen(false);
        }}
        onContinue={() => {
          setUpdateWarningModalOpen(false);
          onAcceptCartUpdateWarning?.();
        }}
        cartUpdates={cartUpdates}
      />
      <div
        data-testid={dataTestId}
        className={classNames(
          'w-100 px-4 py-2.5 bg-page font-sans text-corporative-03',
          'tablet:px-6 tablet:py-4',
          'desktop:w-[886px] desktop:mx-auto destkop:px-0',
          className
        )}
      >
        {/* header */}
        <div
          className={classNames(
            'grid grid-cols-1 items-center pb-2 relative',
            'tablet:grid-cols-[1fr_229px] tablet:pb-4 tablet:gap-4',
            'desktop:grid-cols-[1fr_317px] desktop:gap-5'
          )}
        >
          <div className="flex justify-between items-center">
            <span className="text-base tablet:text-lg font-bold">
              {l.cartHeader}
            </span>
            {lineItems.length > 0 && (
              <span
                className="text-xs underline hover:cursor-pointer font-semibold"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                {l.emptyCartAction}
              </span>
            )}
          </div>
        </div>
        {/* Items & summary */}
        {lineItems.length > 0 && (
          <div
            className={classNames(
              'grid grid-cols-1',
              'tablet:grid-cols-[1fr_229px] tablet:gap-4',
              'desktop:grid-cols-[1fr_317px] desktop:gap-5'
            )}
          >
            {/* Items */}
            <div className={classNames('flex flex-col py-4 gap-4')}>
              {lineItems.map((item: LineItem) => (
                <CartItemCard
                  lineItem={item}
                  key={item.id}
                  onChangeQuantity={onChangeItemsQuantity}
                  onDelete={onDeleteItem}
                  loading={item.loading}
                  disabled={item.disabled}
                />
              ))}
            </div>
            {/* summary */}
            <div className="py-4 relative">
              <div className="w-100 flex flex-col gap-2 tablet:gap-0 tablet:sticky tablet:top-4 tablet:w-[229px] desktop:w-[317px]">
                <div
                  className={classNames(
                    'border border-snow rounded-2xl bg-white',
                    'w-100 p-4 flex flex-col gap-2 mb-4'
                  )}
                >
                  <div className="py-1 text-sm tablet:text-base desktop:text-xs font-bold">
                    <span>{l.summaryTitle}</span>
                  </div>
                  <div className="text-xs">
                    <div className="flex justify-between">
                      <span>{l.subtotal}</span>
                      <span>{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{l.discount}</span>
                      <span>{discountTotal}</span>
                    </div>
                    {taxes.map((tax) => (
                      <div
                        key={tax.description}
                        className="flex justify-between"
                      >
                        <span>{tax.description}</span>
                        <span>{tax.amount}</span>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="text-xs tablet:text-sm desktop:text-xs font-bold">
                      {l.totalToPay}
                    </span>
                    <span className="text-sm desktop:text-xs font-bold">
                      {totalPrice}
                    </span>
                  </div>
                </div>
                {!isMobile && minImportError && !freeDelivery && (
                  <div className="flex items-center justify-center pb-4">
                    <CheckoutFeedback
                      variant="error"
                      message={minImportError}
                    />
                  </div>
                )}
                {!isMobile && freeDelivery && (
                  <div className="flex items-center justify-center pb-4">
                    <CheckoutFeedback
                      variant="success"
                      message={l.freeDelivery}
                    />
                  </div>
                )}
                {!isMobile && (
                  <div className="w-100 mb-4">
                    <Button
                      onClick={onConfirm}
                      size={isMobile ? 'md' : 'sm'}
                      disabled={createOrderDisabled}
                      className="w-full"
                    >
                      {bl.submitBtnLabel}
                    </Button>
                  </div>
                )}
                <div
                  className={classNames(
                    'flex items-center justify-center',
                    'tablet:py-0',
                    !minImportError && !freeDelivery ? 'py-5' : 'py-1'
                  )}
                >
                  <span
                    className={classNames(
                      'text-xs font-semibold underline hover:cursor-pointer',
                      { 'mb-16': !minImportError && !freeDelivery }
                    )}
                  >
                    {linkRenderer(keepBuyingUrl, l.keepBuying)}
                  </span>
                </div>
                {isMobile && minImportError && !freeDelivery && (
                  <div className="flex items-center justify-center pt-2 mb-16">
                    <CheckoutFeedback
                      variant="error"
                      message={minImportError}
                    />
                  </div>
                )}
                {isMobile && freeDelivery && (
                  <div className="flex items-center justify-center pt-2 mb-16">
                    <CheckoutFeedback
                      variant="success"
                      message={l.freeDelivery}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {lineItems.length === 0 && (
          <div className="w-[266px] mx-auto mt-8 tablet:mt-4">
            <EmptyCart linkRenderer={linkRenderer} />
          </div>
        )}
      </div>
      {isMobile && lineItems.length > 0 && (
        <BottomPriceBar
          totalPrice={totalPrice}
          onSubmit={onConfirm}
          createOrderDisabled={createOrderDisabled}
        />
      )}
    </>
  );
};

export default Cart;
