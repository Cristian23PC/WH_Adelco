import useGTM from './useGTM';
import { analyticsEvents } from 'helpers/constants/analyticsEvents';

type UseTrackRegister = () => {
  trackCompanyRegistrationStep1: () => void;
  trackCompanyRegistrationNewCompanySuccess: () => void;
  trackCompanyRegistrationUserValidationSuccess: () => void;
  trackCompanyRegistrationDropOff: () => void;
};

const useTrackRegister: UseTrackRegister = () => {
  const { sendEvent } = useGTM();

  const trackCompanyRegistrationStep1 = (): void => {
    sendEvent(analyticsEvents.EVENT_NAMES.COMPANY_REGISTRATION_STEP1);
  };

  const trackCompanyRegistrationNewCompanySuccess = (): void => {
    sendEvent(
      analyticsEvents.EVENT_NAMES.COMPANY_REGISTRATION_NEW_COMPANY_SUCCESS
    );
  };

  const trackCompanyRegistrationUserValidationSuccess = (): void => {
    sendEvent(
      analyticsEvents.EVENT_NAMES.COMPANY_REGISTRATION_USER_VALIDATION_SUCCESS
    );
  };

  const trackCompanyRegistrationDropOff = (): void => {
    sendEvent(analyticsEvents.EVENT_NAMES.COMPANY_REGISTRATION_DROP_OFF);
  };

  return {
    trackCompanyRegistrationStep1,
    trackCompanyRegistrationNewCompanySuccess,
    trackCompanyRegistrationUserValidationSuccess,
    trackCompanyRegistrationDropOff
  };
};

export default useTrackRegister;
