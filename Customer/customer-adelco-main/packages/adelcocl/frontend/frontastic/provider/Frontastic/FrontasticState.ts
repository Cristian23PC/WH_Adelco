import { UseAccount } from './UseAccount';
import { UseAdyen } from './UseAdyen';
import { UseCart } from './UseCart';
import { UseUserAccount } from './UseUserAccount';
import { UseWishlist } from './UseWishlist';
import {
  getAccount,
  changePassword,
  confirm,
  resendVerificationEmail,
  login as fLogin,
  logout as fLogout,
  register,
  requestPasswordReset,
  resetPassword,
  update,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultBillingAddress,
  setDefaultShippingAddress
} from '../../actions/account';
import { createSession, adyenCheckout } from '../../actions/adyen';
import {
  cartItems,
  addItem,
  orderCart,
  orderHistory,
  removeItem,
  shippingMethods,
  setShippingMethod,
  updateCart,
  updateItem,
  redeemDiscountCode,
  removeDiscountCode,
  getProjectSettings
} from '../../actions/cart';
import { setZone, getUserAccount, logout } from '../../actions/userAccount';
import {
  getWishlist,
  addToWishlist,
  removeLineItem,
  updateLineItem
} from '../../actions/wishlist';

export interface FrontasticState {
  useCart: UseCart;
  useAccount: UseAccount;
  useWishlist: UseWishlist;
  useAdyen: UseAdyen;
  useUserAccount: UseUserAccount;
}

export const getFrontasticState = (): FrontasticState => {
  return {
    useCart: {
      /* ...cartItems(), */
      addItem,
      updateCart,
      setShippingMethod,
      removeItem,
      updateItem,
      /* shippingMethods: shippingMethods(), */
      orderCart,
      orderHistory,
      getProjectSettings,
      redeemDiscountCode,
      removeDiscountCode
    },
    useAccount: {
      ...getAccount(),
      login: fLogin,
      logout: fLogout,
      register,
      confirm,
      resendVerificationEmail,
      changePassword,
      requestPasswordReset,
      resetPassword,
      update,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultBillingAddress,
      setDefaultShippingAddress
    },
    useWishlist: {
      ...getWishlist(),
      addToWishlist,
      removeLineItem,
      updateLineItem
    },
    useAdyen: {
      createSession,
      adyenCheckout
    },
    useUserAccount: {
      userAccount: getUserAccount(),
      setZone,
      logout
    }
  };
};
