import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type TrackOpenSort = () => void;
type TrackSelectSortCriteria = (selectedCriteria: string) => void;

type UseTrackSort = () => {
  trackOpenSort: TrackOpenSort;
  trackSelectSortCriteria: TrackSelectSortCriteria;
};

const useTrackSort: UseTrackSort = () => {
  const { sendEvent } = useGTM();

  const trackOpenSort: TrackOpenSort = () => {
    sendEvent(analyticsEvents.EVENT_NAMES.OPEN_SORTING_TAB);
  };

  const trackSelectSortCriteria: TrackSelectSortCriteria = (
    selectedCriteria
  ) => {
    sendEvent(analyticsEvents.EVENT_NAMES.SELECT_SORT_CRITERIA, {
      selectedCriteria
    });
  };

  return { trackOpenSort, trackSelectSortCriteria };
};

export default useTrackSort;
