import React, {
  type ReactNode,
  type FC,
  type InputHTMLAttributes
} from 'react';
import classNames from 'classnames';

export interface OptionProps extends InputHTMLAttributes<HTMLInputElement> {
  'data-testid'?: string;
  children: ReactNode;
  isSelected?: boolean;
  onClick?: VoidFunction;
  className?: string;
}

const Option: FC<OptionProps> = ({
  'data-testid': dataTestId = 'adelco-dropdown-option',
  children,
  isSelected,
  onClick,
  className
}) => {
  return (
    <li
      data-testid={dataTestId}
      className={classNames(
        'cursor-pointer p-4 tablet:p-2 shadow-list text-sm tablet:text-xs font-sans',
        'bg-white hover:bg-snow hover:font-bold truncate',
        { 'font-bold': isSelected },
        className
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

export default Option;
