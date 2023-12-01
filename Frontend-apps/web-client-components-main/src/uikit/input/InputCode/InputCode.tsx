import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';
import { type InputHTMLAttributes } from 'react';
import { InputMessage } from '../../feedback/InputMessage';

export interface InputCodeProps extends InputHTMLAttributes<HTMLInputElement> {
  'data-testid'?: string;
  className?: string;
  size?: number;
  placeHolder?: string;
  errorMessage?: string;
  onSubmit: (e: any) => void;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeHolder?: string;
  hasError: boolean;
}

const Input: React.FC<InputProps> = ({
  placeHolder = '·',
  hasError = false
}) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.repeat) return;

      const target = event.target as HTMLInputElement;
      const form = target.form;

      if (form != null) {
        const isNumber = /^[0-9]$/i.test(event.key);
        const isDelete = event.key === 'Backspace' || event.key === 'Delete';
        const index = Array.from(form).indexOf(event.target as Element);
        const lastIndex = form.length - 1;

        if (isDelete) {
          target.value = '';
          (form.elements[index - 1] as HTMLElement)?.focus();
        } else if (isNumber) {
          target.value = event.key;

          if (index === lastIndex) {
            form.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
            (form.elements[index] as HTMLElement)?.blur();
          } else {
            (form.elements[index + 1] as HTMLElement)?.focus();
          }
        }
      }
      event.preventDefault();
    },
    []
  );

  return (
    <input
      className={classNames(
        'flex w-[48px] h-[48px] py-2 px-4 border-solid  bg-snow rounded-md text-center',
        hasError
          ? 'border-2 border-failure text-failure'
          : 'border-1 border-snow'
      )}
      type="text"
      maxLength={1}
      placeholder={placeHolder}
      onKeyDown={handleKeyDown}
    />
  );
};

const InputCode: React.FC<InputCodeProps> = ({
  'data-testid': dataTestId = 'adelco-input-code',
  className,
  size = 4,
  placeHolder = '·',
  errorMessage = '',
  onSubmit
}) => {
  const formContainer = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formContainer.current !== null) {
      (formContainer.current.elements[0] as HTMLElement)?.focus();
    }
  }, [errorMessage]);

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const code = Array.from(form.elements)
      .filter((el) => el instanceof HTMLInputElement)
      .map((el) => (el as HTMLInputElement).value)
      .join('');

    onSubmit(code);
  };

  return (
    <div
      data-testid={dataTestId}
      className={classNames('text-center', className)}
    >
      <form
        ref={formContainer}
        className="flex gap-3 justify-center "
        onSubmit={handleSubmit}
      >
        {[...Array(size)].map((e, i) => (
          <Input
            key={i}
            placeHolder={placeHolder}
            hasError={Boolean(errorMessage)}
          />
        ))}
      </form>

      {errorMessage && (
        <InputMessage
          className="justify-center"
          variant="failure"
          iconName="error"
        >
          {errorMessage}
        </InputMessage>
      )}
    </div>
  );
};

export default InputCode;
