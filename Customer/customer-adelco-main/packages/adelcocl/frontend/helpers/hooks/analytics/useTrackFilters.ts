import { Category } from '@Types/product/Category';
import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';
import { ActiveFilter } from 'contexts/Filter/types';
import { getTrackActiveFiltersInfo } from 'helpers/mappers/analyticsMapper/trackFiltersMapper';

type TrackFiltersParams = (
  activeFilters: ActiveFilter[],
  currentCategory: string
) => void;

type TrackOpenFiltersTab = TrackFiltersParams;
type TrackSelectFilters = TrackFiltersParams;

type UseTrackFilters = () => {
  trackOpenFiltersTab: TrackOpenFiltersTab;
  trackSelectFilters: TrackSelectFilters;
};

const useTrackFilters: UseTrackFilters = () => {
  const { sendEvent } = useGTM();

  const trackOpenFiltersTab: TrackOpenFiltersTab = (
    activeFilters,
    currentCategory
  ) => {
    const params = getTrackActiveFiltersInfo(activeFilters, currentCategory);

    sendEvent(analyticsEvents.EVENT_NAMES.OPEN_FILTERS_TAB, params);
  };

  const trackSelectFilters: TrackSelectFilters = (
    activeFilters,
    currentCategory
  ) => {
    const params = getTrackActiveFiltersInfo(activeFilters, currentCategory);

    sendEvent(analyticsEvents.EVENT_NAMES.SELECT_FILTERS, params);
  };

  return { trackOpenFiltersTab, trackSelectFilters };
};

export default useTrackFilters;
