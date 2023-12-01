import { useEffect } from 'react';
import useGTM, { EventNames } from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';
import { usePageInfoContext } from 'contexts/PageInfo/PageInfoContext';

const useTrackSearch = (numberOfResults: number): null => {
  const pageInfo = usePageInfoContext();
  const { sendEvent } = useGTM(pageInfo);

  const pathname = (pageInfo?.query?.path || '') as string;
  const searchedText = (pageInfo?.query?.['text.es-CL'] || '') as string;

  useEffect(() => {
    let eventName: EventNames | null = null;
    let eventPayload = {};

    if (pathname === '/search') {
      if (numberOfResults > 0) {
        eventName = analyticsEvents.EVENT_NAMES.SEARCH_PRODUCTS;
        eventPayload = { searchedText, numberOfResults };
      } else {
        eventName = analyticsEvents.EVENT_NAMES.SEARCH_EMPTY_RESULTS;
        eventPayload = { searchedText };
      }
    }

    if (eventName) {
      sendEvent(eventName, eventPayload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedText, pathname, numberOfResults]);

  return null;
};

export default useTrackSearch;
