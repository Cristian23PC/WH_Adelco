import classNames from 'classnames';
import React, {
  type FocusEvent,
  type InputHTMLAttributes,
  useState,
  useEffect,
  forwardRef
} from 'react';
import type IconName from '../../../utils/types/IconName.type';
import { InputMessage } from '../../feedback/InputMessage';
import TextFieldIcon from './partials/TextFieldIcon';
import { variantColor, type Variants } from './utils';

const voidFn = (): null => null;
export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  iconName?: IconName;
  label?: string;
  helperText?: string;
  helperIcon?: IconName;
  disabled?: boolean;
  onClickIcon?: () => void;
  variant?: Variants;
  'data-testid'?: string;
  isDropdownSearchable?: boolean;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      onFocus,
      onBlur,
      placeholder,
      iconName,
      type = 'text',
      onClickIcon,
      disabled,
      helperText,
      variant = 'none',
      helperIcon,
      'data-testid': dataTestId = 'adelco-textfield',
      id,
      isDropdownSearchable = false,
      ...props
    },
    ref
  ) => {
    const isLabelPresent = label !== '' && label !== undefined;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(
      !isLabelPresent
    );

    useEffect(() => {
      setIsPlaceholderVisible(!isLabelPresent);
    }, [isLabelPresent]);

    const togglePlaceholder = (): void => {
      if (!isLabelPresent) return;

      if (placeholder !== undefined) {
        setIsPlaceholderVisible((visible) => !visible);
      }
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
      togglePlaceholder();
      if (onFocus !== undefined) {
        onFocus(event);
      }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
      togglePlaceholder();
      if (onBlur !== undefined) {
        onBlur(event);
      }
    };

    const inputClassNames = classNames(
      'peer w-full h-full bg-snow text-corporative-03 focus:border-[1px] focus:border-silver focus:outline-none px-4 rounded-[5px] focus:drop-shadow-md transition-colors',
      {
        'pr-11': iconName !== undefined || type === 'password',
        'pt-4': isLabelPresent,
        'text-sm placeholder:text-corporative-03 placeholder:text-sm placeholder:font-normal font-bold text-sm':
          isDropdownSearchable,
        'text-xs font-semibold': !isDropdownSearchable,
        'border-b-failure focus:border-b-failure': variant === 'failure',
        'border-b-warning focus:border-b-warning': variant === 'warning',
        'border-b-success focus:border-b-success': variant === 'success'
      },
      variantColor[variant],
      'invalid:text-failure'
    );
    const labelClassNames = classNames(
      'text-xs leading-[19px] peer-focus:text-xs peer-placeholder-shown:text-sm absolute select-none left-4 right-4 truncate top-2 peer-focus:top-2 transition-all',
      { 'peer-placeholder-shown:top-3.5': !isPlaceholderVisible },
      { 'peer-placeholder-shown:top-2': isPlaceholderVisible }
    );

    const iconClassNames = classNames(
      'absolute ',
      isDropdownSearchable ? 'right-4 top-2' : 'right-3.5 top-3.5'
    );

    const placeholderToShow = placeholder ?? ' ';

    const toggleVisibility = (): void => {
      setIsPasswordVisible((visibility) => !visibility);
    };

    const fn = onClickIcon ?? voidFn;
    const onClickIconFn = type === 'password' ? toggleVisibility : fn;

    return (
      <div className="text-left">
        <div
          data-testid={dataTestId}
          className={classNames('relative h-12', {
            'opacity-30': disabled,
            'border rounded-md': variant !== 'none',
            'border-failure': variant === 'failure',
            'border-warning': variant === 'warning',
            'border-success': variant === 'success'
          })}
        >
          <input
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={isPasswordVisible ? 'text' : type}
            className={inputClassNames}
            disabled={disabled}
            placeholder={isPlaceholderVisible ? placeholderToShow : ' '}
            id={id}
            {...props}
          />
          {isLabelPresent && (
            <label className={labelClassNames} htmlFor={id}>
              {label}
            </label>
          )}
          <TextFieldIcon
            className={iconClassNames}
            name={iconName}
            showPasswordIcon={type === 'password'}
            visible={isPasswordVisible}
            onClick={onClickIconFn}
            width={isDropdownSearchable ? 32 : 20}
            height={isDropdownSearchable ? 32 : 20}
          />
        </div>
        <InputMessage variant={variant} iconName={helperIcon}>
          {helperText}
        </InputMessage>
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
