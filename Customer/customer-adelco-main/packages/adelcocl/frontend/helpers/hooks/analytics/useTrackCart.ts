import useUser from 'frontastic/actions/adelco/user/useUser';
import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';
import {
  getTrackAddCartItemData,
  getTrackCardData,
  type GetTrackAddCartItemDataProductParam,
  type CartReturnType
} from 'helpers/mappers/analyticsMapper';

type TrackAddToCard = (
  params: GetTrackAddCartItemDataProductParam,
  error?: boolean
) => void;
type TrackViewCart = (cart: CartReturnType) => void;
type TrackConfirmCart = (cart: CartReturnType) => void;
type TrackAskForAQuote = (cart: CartReturnType) => void;

type UseTrackCart = () => {
  trackAddToCard: TrackAddToCard;
  trackViewCart: TrackViewCart;
  trackConfirmCart: TrackConfirmCart;
  trackAskForAQuote: TrackAskForAQuote;
};

const useTrackCart: UseTrackCart = () => {
  const { sendEvent } = useGTM();
  const { user } = useUser();

  const trackAddToCard: TrackAddToCard = (product, error) => {
    const params = getTrackAddCartItemData(product, user);
    const status = error
      ? analyticsEvents.STATUS.ERROR
      : analyticsEvents.STATUS.SUCCESS;

    sendEvent(analyticsEvents.EVENT_NAMES.ADD_TO_CART, params, status);
  };

  const trackViewCart: TrackViewCart = (cart) => {
    const params = getTrackCardData(cart, user);

    sendEvent(analyticsEvents.EVENT_NAMES.VIEW_CART, params);
  };

  const trackConfirmCart: TrackConfirmCart = (cart) => {
    const params = getTrackCardData(cart, user);

    sendEvent(analyticsEvents.EVENT_NAMES.CONFIRM_CART, params);
  };

  const trackAskForAQuote: TrackAskForAQuote = (cart) => {
    console.log({ user });
    const params = getTrackCardData(cart, user, {
      trackCartItems: false,
      trackFullAddressInfo: true,
      trackLoggedIn: false
    });

    sendEvent(analyticsEvents.EVENT_NAMES.ASK_FOR_A_QUOTE, params);
  };

  return {
    trackAddToCard,
    trackViewCart,
    trackConfirmCart,
    trackAskForAQuote
  };
};

export default useTrackCart;
