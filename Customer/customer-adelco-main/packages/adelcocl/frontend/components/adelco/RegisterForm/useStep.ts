import { Dispatch, SetStateAction, useState } from 'react';

export const STEPS = {
  HOME: 'home',
  'BU-002': 'Keycloak user already registered.',
  'BU-003': 'User is already associated with another Company.',
  'BU-004': 'RUT is already registered.',
  'BU-006': 'External Rut Verification Service Error',
  'BU-007': 'No Associated Business Unit',
  'BU-010': 'Invalid username',
  REGISTER_PASSWORD: 'Register password',
  CODE_VALIDATION: 'Code validation',
  SUCCESSFUL_REGISTRATION: 'Successful registration',
  BUSINESS_INFORMATION: 'Business information',
  BILLING_INFORMATION: 'Billing information',
  CONFIRMATION_INFORMATION: 'Confirmation information',
  SUCCESSFUL_CREATED_ACCOUNT: 'Successful created account',
  ABORTED_REGISTRATION: 'Aborted registration'
};

type StepsValues = (typeof STEPS)[keyof typeof STEPS];
export type Values = any; // TODO: change for properly values
export type OnChangeStep = (step: StepsValues, nextValues?: Values) => void;

interface UseStep {
  step: StepsValues;
  onChangeStep: Dispatch<SetStateAction<StepsValues>>;
  values: Values;
}

const useStep = (): UseStep => {
  const [step, setStep] = useState<StepsValues>(STEPS.HOME);
  const [values, setValues] = useState<Values>({});

  const handleOnChangeStep: OnChangeStep = (step, nextValues) => {
    window.scrollTo(0, 0);
    if (!Object.values(STEPS).includes(step)) {
      // CHECK FOR NOW IF CODE DOESNT EXIST
      setStep(STEPS['BU-002']);
    } else {
      setStep(step);
    }

    if (nextValues) {
      setValues((prevState) => ({ ...prevState, ...nextValues }));
    }
  };

  return {
    onChangeStep: handleOnChangeStep,
    step,
    values
  };
};

export default useStep;
