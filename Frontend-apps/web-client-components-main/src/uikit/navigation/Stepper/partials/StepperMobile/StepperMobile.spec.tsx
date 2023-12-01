import React, { type FC } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { type StepperProps } from '../../Stepper';
import StepperMobile from './StepperMobile';

const steps = [
  { step: 1, title: 'Step 1', isComplete: true },
  { step: 2, title: 'Step 2', isComplete: false },
  { step: 3, title: 'Step 3', isComplete: false }
];

const Component: FC<Partial<StepperProps>> = (props) => (
  <StepperMobile
    currentStep={1}
    steps={steps}
    currentStepInfo={steps[0]}
    {...props}
  />
);

describe('StepperMobile', () => {
  describe('render', () => {
    it('should render title and label', () => {
      render(<Component />);

      expect(screen.getByText(steps[0].title)).toBeInTheDocument();
      expect(screen.getByText(`Paso ${steps[0].step}`)).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should call onClick when press on botton buton', () => {
      const onClickSpy = jest.fn();
      render(<Component onClick={onClickSpy} />);

      fireEvent.click(screen.getByTestId(`step-item-${steps[2].step}`));

      expect(onClickSpy).toHaveBeenCalledWith(steps[2].step);
    });
  });
});
