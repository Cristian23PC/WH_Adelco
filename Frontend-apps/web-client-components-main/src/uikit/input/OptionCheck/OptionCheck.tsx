import classNames from 'classnames';
import React, { type InputHTMLAttributes, type FC } from 'react';
import { Checkbox } from '../Checkbox';
import useScreen from '../../../utils/hooks/useScreen/useScreen';

export interface OptionCheckProps
  extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  label: string;
  'date-testid'?: string;
}
const OptionCheck: FC<OptionCheckProps> = ({
  checked,
  'date-testid': dataTestId = 'adelco-option-check',
  label,
  disabled,
  className,
  ...props
}) => {
  const { isDesktop } = useScreen();

  return (
    <label
      data-testid={dataTestId}
      className={classNames(
        'flex items-center gap-2 text-sm p-2 ring-1 ring-inset ring-snow rounded-[10px] cursor-pointer w-full',
        { 'opacity-30': disabled },
        className
      )}
    >
      <Checkbox
        variant={isDesktop ? 'sm' : 'md'}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <span
        className={classNames(
          'text-md desktop:text-xs cursor-pointer text-corporative-03 whitespace-normal',
          {
            'font-bold': checked
          }
        )}
      >
        {label}
      </span>
    </label>
  );
};

export default OptionCheck;
