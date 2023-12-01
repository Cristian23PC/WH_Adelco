import classnames from 'classnames';
import React, { type InputHTMLAttributes, type FC } from 'react';

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  'data-testid'?: string;
  variant?: 'sm' | 'md' | 'lg';
}
const Switch: FC<SwitchProps> = ({
  checked,
  variant = 'md',
  className,
  'data-testid': dataTestId = 'adelco-switch',
  ...props
}) => {
  const sizeClass = {
    sm: 'w-[35px] h-[21px]',
    md: 'w-[45px] h-[25px]',
    lg: 'w-[60px] h-[35px]'
  };
  const sizeHandle = {
    sm: 'after:w-[14.5px] after:h-[14.5px] after:top-[3px] after:left-[3px]',
    md: 'after:w-[19px] after:h-[19px] after:top-[3px] after:left-[3.5px]',
    lg: 'after:w-[25px] after:h-[25px] after:top-[5px] after:left-[5px]'
  };

  return (
    <label
      data-testid={dataTestId}
      className="relative inline-flex items-center cursor-pointer"
    >
      <input
        type="checkbox"
        checked={checked}
        className="sr-only peer"
        {...props}
      />
      <div
        data-testid="adelco-switch-handle"
        className={classnames(
          'relative',
          sizeClass[variant],
          sizeHandle[variant],
          'bg-snow',
          'peer-checked:bg-corporative-01',
          'peer-focus:outline-none ',
          'rounded-full peer',
          "after:content-[''] after:absolute",
          'after:bg-moon after:rounded-full',
          'after:peer-checked:bg-corporative-02',
          'after:peer-checked:drop-shadow-xs-left',
          'after:peer-checked:translate-x-full ',
          'after:transition-all'
        )}
      ></div>
    </label>
  );
};

export default Switch;
