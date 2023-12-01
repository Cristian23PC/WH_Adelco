import { usePageInfoContext } from 'contexts/PageInfo/PageInfoContext';
import { PageInfo } from 'contexts/PageInfo/types';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type ValueOf<T> = T[keyof T];

export type EventNames = ValueOf<typeof analyticsEvents.EVENT_NAMES>;
export type EventStatus = ValueOf<typeof analyticsEvents.STATUS>;

type SendEvent = (
  eventName: EventNames,
  eventParams?: Record<string, any>,
  status?: EventStatus,
  options?: Partial<typeof DEFAULT_OPTIONS>
) => void;

type UseGTM = (pageInfo?: PageInfo) => {
  sendEvent: SendEvent;
};

const DEFAULT_OPTIONS = {
  trackReferrer: true,
  trackTime: true,
  trackStatus: true
};

export const isGTMDefined = () => {
  return typeof window !== 'undefined' && window.gtag;
};

export const useGTM: UseGTM = (pageInfoParam) => {
  const pageInfo = usePageInfoContext() || pageInfoParam;

  const sendEvent: SendEvent = (
    eventName,
    eventParams = {},
    status = analyticsEvents.STATUS.SUCCESS,
    options = {}
  ) => {
    if (!isGTMDefined()) return null;

    const opt = { ...DEFAULT_OPTIONS, ...options };

    const time = new Date();
    const referrer = pageInfo?.referrer;
    const eventData = {
      ...(opt.trackTime ? { time } : {}),
      ...(opt.trackStatus ? { status } : {}),
      ...(opt.trackReferrer ? { referrer } : {}),
      ...eventParams
    };

    window.gtag('event', eventName, eventData);
  };

  return { sendEvent };
};

export default useGTM;
