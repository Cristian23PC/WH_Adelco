import React, { type FC } from 'react';
import { type StepperProps, type Step } from '../../Stepper';
import classnames from 'classnames';
import StepCircle from '../StepCircle';

export const DEFAULT_LITERALS = {
  stepLabel: 'Paso'
};

interface StepperMobileProps extends Omit<StepperProps, 'literals'> {
  currentStepInfo: Step;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
}

const StepperMobile: FC<StepperMobileProps> = ({
  onClick,
  currentStepInfo,
  currentStep,
  steps,
  literals = {}
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-4 items-center">
        <StepCircle>{currentStepInfo?.step}</StepCircle>
        <div className="text-xs grid">
          <span className="text-moon ">
            {l.stepLabel} {currentStepInfo?.step}
          </span>
          <span className="font-bold">{currentStepInfo?.title}</span>
        </div>
      </div>
      <div className="flex gap-[19px]">
        {steps.map(({ step, isComplete }) => (
          <span
            className={classnames(
              `border-b-4 rounded-3xl grow ${
                step === currentStep || isComplete
                  ? 'border-corporative-01'
                  : 'border-snow'
              }`,
              { 'cursor-pointer': onClick }
            )}
            key={step}
            onClick={() => {
              onClick?.(step);
            }}
            data-testid={`step-item-${step}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepperMobile;
