import classNames from 'classnames';
import React, { type FC } from 'react';
import { type IconName } from '../../../utils/types';
import InputMessageIcon from './InputMessageIcon';
import { variantColor, type Variants } from '../../input/TextField/utils';

export interface InputMessageProps {
  'data-testid'?: string;
  className?: string;
  children?: React.ReactNode;
  variant: Variants;
  iconName?: IconName;
}
export const InputMessage: FC<InputMessageProps> = ({
  'data-testid': dataTestId = 'adelco-input-message',
  className = '',
  variant,
  iconName,
  children
}) => {
  if (children === undefined) {
    return null;
  }

  return (
    <div
      className={classNames('flex items-center mt-2', className)}
      data-testid={dataTestId}
    >
      <InputMessageIcon
        className={classNames('mr-1', variantColor[variant])}
        name={iconName}
      />
      <div
        className={classNames(
          'text-xs text-left whitespace-pre-line',
          variantColor[variant]
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default InputMessage;
