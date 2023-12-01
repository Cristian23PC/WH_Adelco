import React, { type FC } from 'react';
import StepperMobile, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_STEPPER_MOBILE
} from './partials/StepperMobile';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import StepperDesktop from './partials/StepperDesktop';

const DEFAULT_LITERALS = {
  ...DEFAULT_LITERALS_STEPPER_MOBILE
};

export interface Step {
  title: string;
  step: number;
  isComplete?: boolean;
}

export interface StepperProps {
  currentStep: number;
  steps: Step[];
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onClick?: (step: number) => void;
}

const Stepper: FC<StepperProps> = ({
  currentStep,
  steps,
  onClick,
  literals = {}
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const { isMobile } = useScreen();

  const currentStepInfo = steps.find(({ step }) => step === currentStep);

  if (currentStepInfo == null) {
    throw Error(`Step ${currentStep} is not found on steps`);
  }

  const Component = isMobile ? StepperMobile : StepperDesktop;

  return (
    <Component
      currentStep={currentStep}
      currentStepInfo={currentStepInfo}
      onClick={onClick}
      steps={steps}
      literals={l}
    />
  );
};

export default Stepper;
