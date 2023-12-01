import { Dispatch, SetStateAction, useState } from 'react';

export const STEPS = {
  RESET_REQUEST: 'Password reset request',
  CODE_VALIDATION: 'Code validation',
  RESET_PASSWORD: 'Reset Password'
};

type StepsValues = (typeof STEPS)[keyof typeof STEPS];
export type Values = any;
export type OnChangeStep = (step: StepsValues, nextValues?: Values) => void;

interface UseStep {
  step: StepsValues;
  onChangeStep: Dispatch<SetStateAction<StepsValues>>;
  values: Values;
}

const useStep = (): UseStep => {
  const [step, setStep] = useState<StepsValues>(STEPS.RESET_REQUEST);
  const [values, setValues] = useState<Values>({});

  const handleOnChangeStep: OnChangeStep = (step, nextValues) => {
    window.scrollTo(0, 0);
    if (!Object.values(STEPS).includes(step)) {
      setStep(STEPS.RESET_REQUEST);
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
