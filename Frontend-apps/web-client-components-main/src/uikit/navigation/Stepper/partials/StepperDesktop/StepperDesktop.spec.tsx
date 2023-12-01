import React, { type FC } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { type StepperProps } from '../../Stepper';
import StepperDesktop from './StepperDesktop';

const steps = [
  { step: 1, title: 'Step 1', isComplete: true },
  { step: 2, title: 'Step 2', isComplete: false },
  { step: 3, title: 'Step 3', isComplete: false }
];

const Component: FC<Partial<StepperProps>> = (props) => (
  <StepperDesktop currentStep={1} steps={steps} {...props} />
);

describe('StepperDesktop', () => {
  describe('render', () => {
    it('should render all steps', () => {
      render(<Component />);

      expect(screen.getByText(steps[0].title)).toBeInTheDocument();
      expect(screen.getByText(steps[1].title)).toBeInTheDocument();
      expect(screen.getByText(steps[2].title)).toBeInTheDocument();
    });

    it('should render complete stepCircle if there is complete and no active', async () => {
      await act(async () => {
        render(<Component currentStep={2} />);
      });

      expect(screen.queryByText(steps[0].step)).not.toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should call onClick with correct values', () => {
      const onClickSpy = jest.fn();
      render(<Component onClick={onClickSpy} />);

      fireEvent.click(screen.getByText(steps[2].title));

      expect(onClickSpy).toHaveBeenCalledWith(steps[2].step);
    });
  });
});
