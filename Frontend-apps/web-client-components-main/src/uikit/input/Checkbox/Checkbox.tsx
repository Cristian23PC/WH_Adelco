import classNames from 'classnames';
import React, { type InputHTMLAttributes, type FC } from 'react';
import { Icon } from '../../feedback/Icon';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  'data-testid'?: string;
  variant?: 'sm' | 'md' | 'lg';
}
const Checkbox: FC<CheckboxProps> = ({
  checked,
  variant = 'md',
  className,
  'data-testid': dataTestId = 'adelco-checkbox',
  ...props
}) => {
  const sizeClass = {
    sm: 'w-[18px] h-[18px]',
    md: 'w-[26px] h-[26px]',
    lg: 'w-[34px] h-[34px]'
  };
  const sizeIcon = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  const stateStyles = checked
    ? 'bg-corporative-01 ring-0'
    : 'ring-1 ring-inset ring-silver';
  return (
    <label
      data-testid={dataTestId}
      className={classNames(
        'relative rounded-md cursor-pointer flex justify-center items-center',
        sizeClass[variant],
        stateStyles,
        className
      )}
    >
      <Icon
        data-testid={`${dataTestId}-icon`}
        name="done"
        className={`${sizeIcon[variant]} transition-all ${
          checked ? 'opacity-1' : 'opacity-0'
        }`}
      />
      <input
        type="checkbox"
        className="opacity-0 absolute cursor-pointer"
        checked={checked}
        {...props}
      />
    </label>
  );
};

export default Checkbox;
