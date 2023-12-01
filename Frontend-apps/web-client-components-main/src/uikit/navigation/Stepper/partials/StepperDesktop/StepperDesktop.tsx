import React, { type FC } from 'react';
import classnames from 'classnames';
import { type StepperProps } from '../../Stepper';
import StepCircle, { VARIANTS, type Variant } from '../StepCircle';

const getVariant = (isSelected: boolean, isComplete: boolean): Variant => {
  if (isSelected) return VARIANTS.SELECTED;
  if (isComplete) return VARIANTS.COMPLETE;
  return VARIANTS.NORMAL;
};

const StepperDesktop: FC<StepperProps> = ({ steps, currentStep, onClick }) => {
  return (
    <div className="flex">
      {steps.map(({ step, title, isComplete }) => {
        const isSelected = step === currentStep;
        return (
          <div
            key={step}
            className={classnames(
              'grid justify-items-center gap-[10px] basis-0 grow content-start',
              { 'cursor-pointer': onClick }
            )}
            onClick={() => {
              onClick?.(step);
            }}
          >
            <StepCircle variant={getVariant(isSelected, Boolean(isComplete))}>
              {step}
            </StepCircle>
            <div
              className={`text-xs text-center ${
                isSelected ? 'font-bold' : 'text-moon'
              }`}
            >
              {title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepperDesktop;
