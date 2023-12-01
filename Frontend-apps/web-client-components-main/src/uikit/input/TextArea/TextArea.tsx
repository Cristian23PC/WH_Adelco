import React, {
  type InputHTMLAttributes,
  useState,
  forwardRef,
  type ChangeEvent
} from 'react';
import classNames from 'classnames';
import type IconName from '../../../utils/types/IconName.type';
import { InputMessage } from '../../feedback/InputMessage';

export interface TextAreaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  'data-testid'?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  disabled?: boolean;
  helperText?: string;
  helperIcon?: IconName;
  variant?: 'warning' | 'failure' | 'success' | 'none';
  maxLength?: number;
  onChange: (value: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      'data-testid': dataTestId = 'adelco-textarea',
      className,
      placeholder,
      value,
      rows = 6,
      disabled = false,
      helperText,
      helperIcon,
      variant = 'none',
      maxLength,
      onChange,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const chars = value?.length ?? 0;
    const counter = `${chars} / ${maxLength ?? 0}`;

    return (
      <div
        className={classNames({ 'opacity-30': disabled })}
        data-testid={dataTestId}
      >
        <div
          className={classNames(
            'relative bg-snow',
            'py-4 pl-4 pr-1 rounded-[10px] border',
            {
              'shadow-lg': focused,
              'border-silver': variant === 'none' && focused,
              'border-snow': variant === 'none' && !focused,
              'border-failure': variant === 'failure',
              'border-warning': variant === 'warning',
              'border-success': variant === 'success'
            },
            className
          )}
        >
          <textarea
            ref={ref}
            placeholder={placeholder}
            value={value}
            rows={rows}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            onChange={(data) => {
              onChange(data);
            }}
            disabled={disabled}
            className={classNames(
              'relative bg-snow font-sans text-xs',
              'resize-none border-none',
              'focus-visible:outline-none',
              'w-full scroll-smooth scrollbar-thin',
              'pr-3 text-corporative-03'
            )}
            {...props}
          />
        </div>
        <div
          className={classNames(
            'flex w-full',
            helperText ? 'justify-between' : 'justify-end'
          )}
        >
          {helperText && (
            <InputMessage variant={variant} iconName={helperIcon ?? 'error'}>
              {helperText}
            </InputMessage>
          )}
          {maxLength && (
            <span
              className={classNames(
                'text-corporative-02-hover text-xs font-semibold',
                'h-7 flex items-center mt-1',
                { 'text-failure': variant === 'failure' }
              )}
            >
              {counter}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
