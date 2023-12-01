import { useEffect } from 'react';
import useGTM, { EventNames } from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';
import { PageInfo } from 'contexts/PageInfo/types';

const useTrackPageView = (pageInfo: PageInfo): null => {
  const { sendEvent } = useGTM(pageInfo);
  const pathname = (pageInfo?.query?.path || '') as string;

  useEffect(() => {
    let eventName: EventNames | null = null;
    let eventPayload = {};

    switch (true) {
      case pathname === '/':
        eventName = analyticsEvents.EVENT_NAMES.VIEW_HOMEPAGE;
        break;
      case pathname.startsWith('/categorias'):
        eventName = analyticsEvents.EVENT_NAMES.VIEW_ITEM_LIST;
        eventPayload = { category: pageInfo?.params?.slug?.[1] };
        break;
      case pathname.startsWith('/producto'):
        eventName = analyticsEvents.EVENT_NAMES.VIEW_ITEM_PAGE;
        break;
      default:
        break;
    }

    if (eventName) {
      sendEvent(eventName, eventPayload);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};

export default useTrackPageView;
