import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type UserData = {
  businessUnitId: string;
  email: string;
};

type TrackOpenLogin = () => void;
type TrackLoginSuccess = (userData: UserData) => void;
type TrackOpenPasswordRecovery = (userData: Pick<UserData, 'email'>) => void;
type TrackAddEmailPasswordRecovery = (
  userData: Pick<UserData, 'email'>,
  error?: boolean
) => void;

type UseTrackLogin = () => {
  trackOpenLogin: TrackOpenLogin;
  trackLoginSuccess: TrackLoginSuccess;
  trackOpenPasswordRecovery: TrackOpenPasswordRecovery;
  trackAddEmailPasswordRecovery: TrackAddEmailPasswordRecovery;
};

const useTrackLogin: UseTrackLogin = () => {
  const { sendEvent } = useGTM();

  const trackOpenLogin: TrackOpenLogin = () => {
    sendEvent(analyticsEvents.EVENT_NAMES.OPEN_LOGIN);
  };

  const trackLoginSuccess: TrackLoginSuccess = (userData) => {
    sendEvent(analyticsEvents.EVENT_NAMES.LOGIN_SUCCESS, userData);
  };

  const trackOpenPasswordRecovery: TrackLoginSuccess = (userData) => {
    sendEvent(analyticsEvents.EVENT_NAMES.OPEN_PASSWORD_RECOVERY, userData);
  };

  const trackAddEmailPasswordRecovery: TrackAddEmailPasswordRecovery = (
    userData,
    error
  ) => {
    const status = error
      ? analyticsEvents.STATUS.ERROR
      : analyticsEvents.STATUS.SUCCESS;

    sendEvent(
      analyticsEvents.EVENT_NAMES.ADD_EMAIL_PASSWORD_RECOVERY,
      userData,
      status
    );
  };

  return {
    trackOpenLogin,
    trackLoginSuccess,
    trackOpenPasswordRecovery,
    trackAddEmailPasswordRecovery
  };
};

export default useTrackLogin;
