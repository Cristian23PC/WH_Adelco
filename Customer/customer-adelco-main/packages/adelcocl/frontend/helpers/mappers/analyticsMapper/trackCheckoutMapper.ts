import { User } from '@Types/adelco/user';
import { ctCartToCart } from '../cartMapper';

export type CartReturnType = ReturnType<typeof ctCartToCart>;

export type GetTrackPurchaseDataParams = {
  user?: User;
  cart: CartReturnType;
  order?: any;
  paymentMethod: string;
  deliveryDate: string;
  couponCode: string;
};

export type GetTrackPurchaseDataReturnValue = {
  orderId?: string;
  businessUnitId?: string;
  deliveryZone?: string;
  cartItems?: CartReturnType['lineItems'];
  cartTotalAmount: string;
  cartTotalTaxesAmount: string;
  shippingDate: string;
  paymentMethod: string;
  coupons: string;
  error?: string;
};

export const getTrackPurchaseData = (
  {
    user,
    order,
    cart,
    paymentMethod,
    deliveryDate,
    couponCode
  }: GetTrackPurchaseDataParams,
  error?: string
): GetTrackPurchaseDataReturnValue => {
  return {
    cartTotalAmount: cart?.totalPrice || '$0',
    cartTotalTaxesAmount: cart?.totalTaxesAmount || '$0',
    shippingDate: deliveryDate,
    paymentMethod,
    coupons: couponCode,
    ...(!error
      ? {
          orderId: order?.orderNumber,
          businessUnitId: user?.businessUnitId,
          deliveryZone: user?.zoneLabel,
          cartItems: cart?.lineItems || []
        }
      : { error })
  };
};
