import React, { type FC, type PropsWithChildren } from 'react';
import classnames from 'classnames';
import { Icon } from '../../../feedback';

export const VARIANTS: Record<string, Variant> = {
  NORMAL: 'normal',
  SELECTED: 'selected',
  COMPLETE: 'complete'
};

export type Variant = 'normal' | 'selected' | 'complete';

interface StepCircleProps extends PropsWithChildren {
  variant?: Variant;
}

const StepCircle: FC<StepCircleProps> = ({
  variant = 'selected',
  children
}) => {
  return (
    <div
      className={classnames(
        'rounded-[25px] inline-flex items-center justify-center text-sm font-bold w-10 h-10 tablet:w-[30px] tablet:h-[30px] desktop:w-10 desktop:h-10',
        { 'bg-snow': variant === VARIANTS.NORMAL },
        { 'border-corporative-01 border-2': variant === VARIANTS.SELECTED },
        { 'bg-corporative-01': variant === VARIANTS.COMPLETE }
      )}
    >
      {variant !== VARIANTS.COMPLETE ? children : <Icon name="done" />}
    </div>
  );
};

export default StepCircle;
