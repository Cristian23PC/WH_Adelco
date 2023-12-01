import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type UseTrackViewPrices = () => {
  trackViewPrices: () => void;
};

const useTrackViewPrices: UseTrackViewPrices = () => {
  const { sendEvent } = useGTM();

  const trackViewPrices = (): void => {
    sendEvent(analyticsEvents.EVENT_NAMES.SEE_PRICES);
  };

  return { trackViewPrices };
};

export default useTrackViewPrices;
