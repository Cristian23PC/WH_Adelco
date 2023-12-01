import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type AddressInfo = {
  deliveryZone: string;
  businessUnitId: string;
  t2z: string;
  dch: string;
};

type TrackOpenChangeAddress = (addressInfo: AddressInfo) => void;

type UseTrackOpenChangeAddress = () => {
  trackOpenChangeAddress: TrackOpenChangeAddress;
};

const useTrackOpenChangeAddress: UseTrackOpenChangeAddress = () => {
  const { sendEvent } = useGTM();

  const trackOpenChangeAddress: TrackOpenChangeAddress = (addressInfo) => {
    sendEvent(analyticsEvents.EVENT_NAMES.OPEN_CHANGE_ADDRESS, addressInfo);
  };

  return { trackOpenChangeAddress };
};

export default useTrackOpenChangeAddress;
