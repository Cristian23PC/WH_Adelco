import { Product } from '@Types/adelco/product';
import { User } from '@Types/adelco/user';
import {
  formatCapitalizeText,
  labelizeText
} from '../../../helpers/utils/formatLocaleName';
import { ctCartToCart } from '../cartMapper';

export type GetTrackAddCartItemReturnData = {
  productId: string;
  productName: string;
  productBrand: string;
  productCategory: string;
  discounts: boolean;
  productPrice: string;
  userLoggedIn: boolean;
  location: string;
  deliveryZone: string;
};

export type GetTrackAddCartItemDataProductParam = Product & {
  category?: string;
};

type GetTrackAddCartItemDataParams = (
  product: GetTrackAddCartItemDataProductParam,
  user: User
) => GetTrackAddCartItemReturnData;

export const getTrackAddCartItemData: GetTrackAddCartItemDataParams = (
  product,
  user
) => ({
  productId: product.sku,
  productName: product.name,
  productBrand: product.brandName,
  productCategory: product.category,
  discounts: Boolean(product.discount),
  productPrice: product.calculatedPrice,
  userLoggedIn: user?.loggedIn || false,
  location: formatCapitalizeText(user?.t2z || ''),
  deliveryZone: user?.zoneLabel || ''
});

export type CartReturnType = ReturnType<typeof ctCartToCart>;

const defaultGetTrackCardDataOptions = {
  trackCartItems: true,
  trackFullAddressInfo: false,
  trackLoggedIn: true
};

export const getTrackCardData = (
  cart: CartReturnType,
  user: User,
  options: Partial<typeof defaultGetTrackCardDataOptions> = {}
) => {
  const opt = { ...defaultGetTrackCardDataOptions, ...options };

  return {
    deliveryZone: user?.zoneLabel,
    ...(user.loggedIn ? { businessUnitId: user?.businessUnitId } : {}),
    ...(opt.trackLoggedIn ? { userLoggedIn: user?.loggedIn || false } : {}),
    ...(opt.trackFullAddressInfo
      ? {
          location: labelizeText(user?.t2z),
          commune: user?.zoneLabel?.split(', ')?.[0],
          region: user?.zoneLabel?.split(', ')?.[1],
          dch: user?.dch
        }
      : {}),
    ...(opt.trackCartItems ? { cartItems: cart?.lineItems || [] } : {}),
    cartTotalQuantityOfItems: cart?.totalLineItemQuantity || 0,
    cartNetTotal: cart?.subtotal || '$0',
    cartTotalDiscounts: cart?.discountTotal || '$0',
    cartTotalAmount: cart?.totalPrice || '$0',
    cartTotalTaxesAmount: cart?.totalTaxesAmount || '$0',
    cartDiscountsQuantity: cart?.discountsQuantity
  };
};
