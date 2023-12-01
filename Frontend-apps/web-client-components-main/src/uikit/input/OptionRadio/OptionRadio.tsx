import classNames from 'classnames';
import React, { type InputHTMLAttributes, type FC } from 'react';
import { Radio, type RadioProps } from '../Radio';

const RadioButtonViews: FC<RadioProps> = (props) => {
  return (
    <>
      <Radio
        data-testid="adelco-radio-button-sm"
        className="tablet:hidden desktop:flex"
        variant="sm"
        {...props}
      />
      <Radio
        data-testid="adelco-radio-button-md"
        className="mobile:hidden tablet:flex desktop:hidden"
        variant="md"
        {...props}
      />
    </>
  );
};

export interface OptionRadioProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  'data-testid'?: string;
}
const OptionRadio: FC<OptionRadioProps> = ({
  label,
  name,
  id,
  onChange,
  value,
  className,
  'data-testid': dataTestId = 'adelco-option-radio',
  checked,
  ...props
}) => {
  const htmlFor = id !== undefined ? id : String(value);
  return (
    <label
      data-testid={dataTestId}
      htmlFor={htmlFor}
      className={classNames(
        'flex items-center ring-1 ring-inset ring-snow rounded-[10px] p-2 tablet:px-4 gap-2 cursor-pointer',
        checked && 'font-bold',
        className
      )}
    >
      <RadioButtonViews
        name={name}
        id={htmlFor}
        onChange={onChange}
        value={value}
        checked={checked}
        {...props}
      />
      {label}
    </label>
  );
};

export default OptionRadio;
