import React, { useEffect, useRef, useState } from 'react';
import { Cart } from '@adelco/web-components';
import useCart from 'frontastic/actions/adelco/cart/useCart/useCart';
import useEmptyCart from 'frontastic/actions/adelco/cart/useEmptyCart/useEmptyCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity/useSetLineItemQuantity';
import { ctCartToCart } from '../../../../helpers/mappers/cartMapper';
import { cartLinkRenderer } from '../../../../helpers/utils/linkRenderer';
import { useModalContext } from '../../../../contexts/modalContext';
import { useRouter } from 'next/router';
import useUser from 'frontastic/actions/adelco/user/useUser';
import useTrackCart from 'helpers/hooks/analytics/useTrackCart';
import NoLoggedModal from './partials/NoLoggedModal';

const CartTastic = () => {
  const { cart } = useCart();
  const { user } = useUser();
  const { openLoginModal } = useModalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    trigger: setQuantity,
    lastItem,
    isLoading
  } = useSetLineItemQuantity();
  const { trigger: emptyCart } = useEmptyCart();
  const router = useRouter();
  const { trackViewCart, trackConfirmCart } = useTrackCart();
  const isViewCartTracked = useRef<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const onLoginButtonClick = () => {
    closeModal();
    openLoginModal();
  };

  const mappedCart = cart && ctCartToCart(cart);

  useEffect(() => {
    if (mappedCart && !isViewCartTracked.current) {
      trackViewCart(mappedCart);
      isViewCartTracked.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappedCart]);

  if (!cart) return null;

  const handleEmptyCart = () => {
    emptyCart();
  };

  const handleConfirm = () => {
    if (!user.loggedIn) {
      openModal();
      return;
    }

    trackConfirmCart(mappedCart);
    router.push('/checkout');
  };

  const handleChangeQuantity = async (
    itemId: string,
    quantity: number,
    currentQuantity?: number
  ) => {
    const response = await setQuantity({
      id: itemId,
      quantity,
      currentQuantity
    });

    return response;
  };

  const DELIVERY_MIN_AMOUNT = user?.minAmount?.centAmount ?? 50000;
  const deliveryError = `Aún no cumples el monto mínimo de compra (${DELIVERY_MIN_AMOUNT.toLocaleString(
    'es-CL',
    {
      style: 'currency',
      currency: user?.minAmount?.currencyCode ?? 'CLP',
      minimumFractionDigits: user?.minAmount?.fractionDigits ?? 0
    }
  )})`;
  const totalPrice = cart.totalDetails?.grossPrice;
  const lineItems = mappedCart?.lineItems?.map((item) => ({
    ...item,
    loading: lastItem?.id === item.id && isLoading,
    disabled: isLoading
  }));

  return (
    <>
      <NoLoggedModal
        onButtonClick={onLoginButtonClick}
        onClose={closeModal}
        open={isModalOpen}
        cart={mappedCart}
      />
      <Cart
        onEmptyCart={handleEmptyCart}
        onConfirm={handleConfirm}
        onChangeItemsQuantity={(itemId, quantity, currentQuantity) =>
          handleChangeQuantity(itemId, quantity, currentQuantity)
        }
        onDeleteItem={(_, itemId) => handleChangeQuantity(itemId, 0)}
        lineItems={lineItems}
        linkRenderer={cartLinkRenderer}
        totalPrice={mappedCart.totalPrice}
        discountTotal={mappedCart.discountTotal}
        subtotal={mappedCart.subtotal}
        taxes={mappedCart.taxes}
        keepBuyingUrl="/"
        freeDelivery={totalPrice >= DELIVERY_MIN_AMOUNT}
        minImportError={deliveryError}
        createOrderDisabled={totalPrice < DELIVERY_MIN_AMOUNT}
        cartUpdates={mappedCart.cartUpdates}
      />
    </>
  );
};

export default CartTastic;
