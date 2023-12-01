import React, { type InputHTMLAttributes, type FC } from 'react';
import classNames from 'classnames';

type Size = 'sm' | 'md' | 'lg';
export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Size;
  'data-testid'?: string;
}
const Radio: FC<RadioProps> = ({
  checked = false,
  variant = 'md',
  onChange,
  className,
  value,
  id,
  'data-testid': dataTestId = 'adelco-radio-button',
  ...props
}) => {
  const htmlFor = id !== undefined ? id : String(value);
  const selectionSize: { [key in Size]: string } = {
    sm: 'w-4 h-4',
    md: 'w-[18px] h-[18px]',
    lg: 'w-6 h-6'
  };

  const buttonSize: { [key in Size]: string } = {
    sm: 'w-[26px] h-[26px]',
    md: 'w-[34px] h-[34px]',
    lg: 'w-[42px] h-[42px]'
  };

  return (
    <label
      htmlFor={htmlFor}
      data-testid={dataTestId}
      className={classNames(
        'flex items-center justify-center shrink-0 rounded-full cursor-pointer transition-all',
        { 'bg-corporative-01': checked, 'bg-snow': !checked },
        buttonSize[variant],
        className
      )}
    >
      <div
        className={classNames(
          'rounded-full bg-black transition-all',
          { 'opacity-0': !checked },
          selectionSize[variant]
        )}
      ></div>
      <input
        type="radio"
        className="opacity-0 absolute cursor-pointer w-0 h-0"
        id={htmlFor}
        checked={checked}
        value={value}
        onChange={onChange}
        {...props}
      />
    </label>
  );
};

export default Radio;
