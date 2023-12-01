import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import classNames from 'classnames';
import { Icon } from '../../feedback/Icon';
import { type IconName } from '../../../utils/types';

type ButtonVariants = 'primary' | 'secondary' | 'tertiary';
type ButtonSizes = 'xs' | 'sm' | 'md';
type Variants = { [key in ButtonVariants]: string };
type Sizes = { [key in ButtonSizes]: string };

const getIconSize = (onlyIcon: boolean, size: ButtonSizes): string => {
  const smallMobileIcon = onlyIcon ? 'w-3 h-3' : 'w-2.5 w-2.5';
  const sizes: Sizes = {
    xs: `${smallMobileIcon} tablet:w-icon-small tablet:h-icon-small`,
    sm: 'w-4 h-4 tablet:w-5 tablet:h-5',
    md: 'w-4 h-4 tablet:w-5 tablet:h-5'
  };

  return sizes[size];
};

const variants: Variants = {
  primary:
    'text-corporative-02 bg-corporative-01 ' +
    'hover:text-corporative-03 hover:bg-corporative-01-hover ' +
    'active:bg-corporative-01 ' +
    'focus:ring focus:ring-inset focus:ring-corporative-01-hover ' +
    'disabled:bg-corporative-01 disabled:opacity-30',
  secondary:
    'text-white bg-corporative-03 ' +
    'hover:bg-corporative-02-hover ' +
    'active:bg-corporative-02 ' +
    'focus:ring focus:ring-inset focus:ring-corporative-02-hover ' +
    'disabled:bg-corporative-02 disabled:opacity-30',
  tertiary:
    'text-corporative-02 bg-white ring-1 ring-inset ring-silver ' +
    'focus:ring-corporative-02 ' +
    'disabled:text-corporative-02 disabled:opacity-30'
};

const buttonSizes: Sizes = {
  xs: 'px-2 h-btn-xs-mobile tablet:h-btn-xs-tablet desktop:h-btn-xs-desktop rounded-2xl tablet:rounded-4xl text-xs',
  sm: 'px-2 tablet:px-4 h-btn-sm-mobile tablet:h-btn-sm-tablet desktop:h-btn-sm-desktop rounded-3xl tablet:rounded-4xl text-xs tablet:text-sm',
  md: 'px-4 tablet:px-6 h-btn-md-mobile tablet:h-btn-md-tablet desktop:h-btn-md-desktop rounded-3xl tablet:rounded-4xl text-xs tablet:text-base'
};

const roundedButtonSizes: Sizes = {
  xs: 'w-btn-xs-mobile h-btn-xs-mobile tablet:w-btn-xs-tablet tablet:h-btn-xs-tablet desktop:w-btn-xs-desktop desktop:h-btn-xs-desktop',
  sm: 'w-btn-sm-mobile h-btn-sm-mobile tablet:w-btn-sm-tablet tablet:h-btn-sm-tablet desktop:w-btn-sm-desktop desktop:h-btn-sm-desktop',
  md: 'w-btn-md-mobile h-btn-md-mobile tablet:w-btn-md-tablet tablet:h-btn-md-tablet desktop:w-btn-md-desktop desktop:h-btn-md-desktop'
};

const getGap = (useMargin: boolean, marginSize: ButtonSizes): string => {
  if (!useMargin) {
    return '';
  }

  const margins = {
    xs: 'gap-x-0.5 tablet:gap-x-1 desktop:gap-x-1',
    sm: 'gap-x-1 tablet:gap-x-2 desktop:gap-x-2',
    md: 'gap-x-2 tablet:gap-x-2 desktop:gap-x-2'
  };

  return margins[marginSize];
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSizes;
  iconName?: IconName;
  block?: boolean;
  'data-testid'?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  disabled,
  block = false,
  size = 'md',
  loading = false,
  onClick,
  'data-testid': dataTestId = 'adelco-button',
  iconName,
  ...props
}) => {
  const isChildrenPresent =
    children !== null && children !== undefined && children !== '';
  const isIconNamePresent = iconName !== undefined;

  return (
    <button
      data-testid={dataTestId}
      type="button"
      disabled={disabled}
      className={classNames(
        'font-semibold flex justify-center items-center transition-all hover:drop-shadow-md disabled:drop-shadow-none',
        'max-w-full',
        variants[variant],
        isChildrenPresent && buttonSizes[size],
        !isChildrenPresent && 'rounded-full',
        !isChildrenPresent && roundedButtonSizes[size],
        getGap(isIconNamePresent, size),
        block ? 'w-full' : '',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Icon
          name="spinner"
          className={classNames(
            getIconSize(!isChildrenPresent, size),
            'absolute fill-current'
          )}
        />
      )}
      {isChildrenPresent && (
        <span className={classNames({ 'opacity-0': loading }, 'truncate')}>
          {children}
        </span>
      )}
      {isIconNamePresent && (
        <Icon
          className={classNames(
            { 'opacity-0': loading },
            'fill-current shrink-0',
            getIconSize(!isChildrenPresent, size)
          )}
          name={iconName}
        />
      )}
    </button>
  );
};

export default Button;
