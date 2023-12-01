import {
  GetTrackPurchaseDataParams,
  getTrackPurchaseData
} from 'helpers/mappers/analyticsMapper/trackCheckoutMapper';
import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type CartData = {
  businessUnitId: string;
  deliveryZone: string;
  cartTotalQuantityOfItems: number;
  cartNetTotal: number;
  cartTotalDiscounts: number;
  cartTotalAmount: number;
};

type TrackViewCheckout = (cartData: CartData) => void;
type TrackPurchase = (purchaseData: GetTrackPurchaseDataParams) => void;
type TrackPurchaseFailed = (
  purchaseData: GetTrackPurchaseDataParams,
  error: string
) => void;

type UseTrackCheckout = () => {
  trackViewCheckout: TrackViewCheckout;
  trackPurchase: TrackPurchase;
  trackPurchaseFailed: TrackPurchaseFailed;
};

const useTrackCheckout: UseTrackCheckout = () => {
  const { sendEvent } = useGTM();

  const trackViewCheckout: TrackViewCheckout = (cartData) => {
    sendEvent(analyticsEvents.EVENT_NAMES.VIEW_CHECKOUT, cartData);
  };

  const trackPurchase: TrackPurchase = (purchaseData) => {
    const purchaseFormattedData = getTrackPurchaseData(purchaseData);

    sendEvent(analyticsEvents.EVENT_NAMES.PURCHASE, purchaseFormattedData);
  };

  const trackPurchaseFailed: TrackPurchaseFailed = (purchaseData, error) => {
    const purchaseFormattedData = getTrackPurchaseData(purchaseData, error);

    sendEvent(
      analyticsEvents.EVENT_NAMES.PURCHASE_FAILED,
      purchaseFormattedData,
      analyticsEvents.STATUS.ERROR
    );
  };

  return { trackViewCheckout, trackPurchase, trackPurchaseFailed };
};

export default useTrackCheckout;
