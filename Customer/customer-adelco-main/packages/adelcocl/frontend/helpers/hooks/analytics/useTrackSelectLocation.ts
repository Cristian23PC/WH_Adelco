import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type Location = {
  region: string;
  commune: string;
  locality: string;
};

type TrackSelectLocation = (location: Location, error?: boolean) => void;

type UseTrackSelectLocation = () => {
  trackSelectLocation: TrackSelectLocation;
};

const useTrackSelectLocation: UseTrackSelectLocation = () => {
  const { sendEvent } = useGTM();

  const trackSelectLocation: TrackSelectLocation = (location, error): void => {
    const status = error
      ? analyticsEvents.STATUS.ERROR
      : analyticsEvents.STATUS.SUCCESS;

    sendEvent(analyticsEvents.EVENT_NAMES.SELECT_LOCATION, location, status);
  };

  return { trackSelectLocation };
};

export default useTrackSelectLocation;
