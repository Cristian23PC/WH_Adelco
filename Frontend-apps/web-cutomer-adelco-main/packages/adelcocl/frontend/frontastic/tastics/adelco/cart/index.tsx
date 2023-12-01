import React from 'react';
import { Cart } from 'am-ts-components';
import useCart from 'frontastic/actions/adelco/cart/useCart/useCart';
import useEmptyCart from 'frontastic/actions/adelco/cart/useEmptyCart/useEmptyCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity/useSetLineItemQuantity';
import { ctCartToCart } from '../../../../helpers/mappers/cartMapper';
import { cartLinkRenderer } from '../../../../helpers/utils/linkRenderer';

const CartTastic = () => {
  const { cart } = useCart();
  const { trigger: setQuantity } = useSetLineItemQuantity();
  const { trigger: emptyCart } = useEmptyCart();

  if (!cart) return null;

  const mappedCart = ctCartToCart(cart);

  const handleEmptyCart = () => {
    emptyCart(mappedCart.lineItems?.map((item) => item.id));
  };

  const handleConfirm = () => {
    console.log('Creando pedido...');
  };

  const handleChangeQuantity = (itemId: string, quantity: number) => {
    setQuantity({ id: itemId, quantity });
  };

  return (
    <Cart
      onEmptyCart={handleEmptyCart}
      onConfirm={handleConfirm}
      onChangeItemsQuantity={(itemId, quantity) => handleChangeQuantity(itemId, quantity)}
      onDeleteItem={(_, itemId) => handleChangeQuantity(itemId, 0)}
      lineItems={mappedCart.lineItems}
      linkRenderer={cartLinkRenderer}
      totalPrice={mappedCart.totalPrice}
      discountTotal={mappedCart.discountTotal}
      ivaTotal={mappedCart.ivaTotal}
      subtotal={mappedCart.subtotal}
      keepBuyingUrl="/"
    />
  );
};

export default CartTastic;
