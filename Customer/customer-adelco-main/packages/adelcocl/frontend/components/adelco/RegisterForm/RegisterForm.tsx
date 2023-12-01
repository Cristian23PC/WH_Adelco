import { useRouter } from 'next/router';
import AccountSuccesfulCreated from './steps/AccountSuccesfulCreated';
import BillingInformationStep from './steps/BillingInformationStep';
import BusinessInformationStep from './steps/BusinessInformationStep';
import CodeValidationStep from './steps/CodeValidationStep';
import ConfirmationInformationStep from './steps/ConfirmationInformationStep';
import EmailMismatchstep from './steps/EmailMismatchStep';
import HomeStep from './steps/HomeStep';
import RegisteredWithBuStep from './steps/RegisteredWithBuStep';
import RegisterPasswordStep from './steps/RegisterPasswordStep';
import SuccesfulCreatedStep from './steps/SuccessfulCreatedStep';
import UnableCreateAccount from './steps/UnableCreateAccount';
import useStep, { STEPS } from './useStep';
import AbortedRegistrationStep from './steps/AbortedRegistration';
import { useEffect } from 'react';
import classNames from 'classnames';

const RegisterForm = () => {
  const route = useRouter();
  const { step, onChangeStep, values } = useStep();

  useEffect(() => {
    if (route.query.incompleteRegistration === 'true') {
      onChangeStep(STEPS.ABORTED_REGISTRATION);
    }
  }, []);

  const stepComponents = {
    [STEPS.HOME]: <HomeStep onChangeStep={onChangeStep} />,
    [STEPS['BU-002']]: <RegisteredWithBuStep />,
    [STEPS['BU-003']]: <EmailMismatchstep values={values} />,
    [STEPS['BU-004']]: <EmailMismatchstep values={values} />,
    [STEPS['BU-006']]: (
      <UnableCreateAccount onChangeStep={onChangeStep} values={values} />
    ),
    [STEPS['BU-007']]: (
      <UnableCreateAccount onChangeStep={onChangeStep} values={values} />
    ),
    [STEPS['BU-010']]: (
      <UnableCreateAccount onChangeStep={onChangeStep} values={values} />
    ),
    [STEPS['REGISTER_PASSWORD']]: (
      <RegisterPasswordStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS['CODE_VALIDATION']]: (
      <CodeValidationStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS['SUCCESSFUL_REGISTRATION']]: (
      <AccountSuccesfulCreated values={values} />
    ),
    [STEPS['BUSINESS_INFORMATION']]: (
      <BusinessInformationStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS['BILLING_INFORMATION']]: (
      <BillingInformationStep values={values} onChangeStep={onChangeStep} />
    ),
    [STEPS['CONFIRMATION_INFORMATION']]: (
      <ConfirmationInformationStep
        values={values}
        onChangeStep={onChangeStep}
      />
    ),
    [STEPS['SUCCESSFUL_CREATED_ACCOUNT']]: <SuccesfulCreatedStep />,
    [STEPS['ABORTED_REGISTRATION']]: (
      <AbortedRegistrationStep onChangeStep={onChangeStep} />
    )
  };

  if (!stepComponents[step]) {
    throw new Error(`Step "${step}" not found`);
  }

  return (
    <div
      className={classNames('p-4 tablet:m-auto tablet:py-8', {
        'tablet:w-[340px]': step !== STEPS.ABORTED_REGISTRATION
      })}
    >
      {stepComponents[step]}
    </div>
  );
};

export default RegisterForm;
