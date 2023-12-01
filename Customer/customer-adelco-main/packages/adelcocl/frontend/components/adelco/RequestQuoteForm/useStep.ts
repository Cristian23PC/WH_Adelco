import { Dispatch, SetStateAction, useState } from 'react';

export enum STEPS {
  HOME,
  BUSINESS_INFORMATION,
  BILLING_ADDRESS,
  CONFIRMATION,
  SUCCESS
}

type StepsValues = (typeof STEPS)[keyof typeof STEPS];
export type Values = any;
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
    setStep(step);

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
