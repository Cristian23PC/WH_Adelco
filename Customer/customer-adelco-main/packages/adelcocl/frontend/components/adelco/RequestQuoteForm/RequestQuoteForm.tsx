import BillingAddressStep from './steps/BillingAddressStep';
import BusinessInformationStep from './steps/BusinessInformationStep';
import ConfirmationStep from './steps/ConfirmationStep';
import HomeStep from './steps/HomeStep';
import SuccessStep from './steps/SuccessStep';
import useStep, { STEPS } from './useStep';

const RequestQuoteForm = () => {
  const { step, onChangeStep, values } = useStep();

  const stepComponents = {
    [STEPS.HOME]: <HomeStep onChangeStep={onChangeStep} />,
    [STEPS.BUSINESS_INFORMATION]: (
      <BusinessInformationStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS.BILLING_ADDRESS]: (
      <BillingAddressStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS.CONFIRMATION]: (
      <ConfirmationStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS.SUCCESS]: <SuccessStep />
  };
  return stepComponents[step];
};

export default RequestQuoteForm;
