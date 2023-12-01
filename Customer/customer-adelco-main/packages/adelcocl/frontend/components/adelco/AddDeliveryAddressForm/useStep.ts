import { Dispatch, SetStateAction, useState } from 'react';

export const STEPS = {
  DELIVERY_ADDRESS_INFORMATION: 'Delivery address information',
  CONTACT_INFORMATION: 'Contact information'
};

const initialStep = STEPS.DELIVERY_ADDRESS_INFORMATION;

type StepsValues = (typeof STEPS)[keyof typeof STEPS];

export type Values = {
  localName: string;
  region: string;
  commune: string;
  locality?: string;
  street: string;
  streetNumber?: string;
  noStreetNumber?: boolean;
  apartment?: string;
  additionalInformation?: string;
  coordinates: {
    lat: number;
    long: number;
  };
  firstName: string;
  surname: string;
  username: string;
  phone: string;
};

export type OnChangeStep = (
  step: StepsValues,
  nextValues?: Partial<Values>
) => void;

interface UseStep {
  step: StepsValues;
  onChangeStep: Dispatch<SetStateAction<StepsValues>>;
  values: Partial<Values>;
}

const useStep = (): UseStep => {
  const [step, setStep] = useState<StepsValues>(initialStep);
  const [values, setValues] = useState<Partial<Values>>({});

  const handleOnChangeStep: OnChangeStep = (step, nextValues) => {
    window.scrollTo(0, 0);
    if (!Object.values(STEPS).includes(step)) {
      setStep(initialStep);
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
