/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, type FC, type MouseEvent, useEffect } from 'react';
import { Button, Icon, Tooltip } from '../../uikit';
import classNames from 'classnames';
import useDebounce from '../../utils/hooks/useDebounce';
import useScreen from '../../utils/hooks/useScreen';

export interface OnChangeQuantityError {
  quantity?: number;
  showStockWarning?: boolean;
  error: boolean;
}

export type OnChangeQuantityAsyncFunction = (
  quantity: number
) => Promise<undefined | OnChangeQuantityError> | undefined;

export type OnChangeQuantitySyncFunction = (quantity: number) => void;

export type OnChangeQuantityFunction =
  | OnChangeQuantityAsyncFunction
  | OnChangeQuantitySyncFunction;

export interface QuantitySelectorProps {
  quantity: number;
  onChange: OnChangeQuantityFunction;
  variant?: 'light' | 'dark';
  buttonVariant?: 'primary' | 'secondary' | 'tertiary';
  availableQuantity?: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  variant = 'light',
  buttonVariant,
  availableQuantity,
  loading = false,
  disabled = false,
  className
}) => {
  const [inputQuantity, setInputQuantity] = useState(quantity);
  const [showStockWarning, setShowStockWarning] = useState(false);

  const { isDesktop } = useScreen();

  const exceedsMaximumQuantity =
    typeof availableQuantity === 'number' && quantity >= availableQuantity;
  const exceedsMinimumQuantity = quantity <= 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      showStockWarning && setShowStockWarning(false);
    }, 3000);

    return () => {
      showStockWarning && clearTimeout(timer);
    };
  }, [quantity, showStockWarning]);

  useEffect(() => {
    if (inputQuantity !== quantity) setInputQuantity(quantity);
  }, [quantity]);

  const handleChangeQuantity = async (newQuantity: number): Promise<any> => {
    const shouldShowStockWarning =
      !!availableQuantity && newQuantity > availableQuantity;

    const quantityToApply = shouldShowStockWarning
      ? availableQuantity
      : newQuantity;

    setInputQuantity(quantityToApply);
    setShowStockWarning(shouldShowStockWarning);

    if (quantity !== quantityToApply) {
      const response = await onChange(quantityToApply);

      if (response?.error && response?.quantity) {
        setInputQuantity(response.quantity);
      }

      if (response?.showStockWarning) {
        setShowStockWarning(true);
      }
    }
  };

  const handleOnIncrement = async (e: MouseEvent): Promise<void> => {
    e.stopPropagation();
    if (!exceedsMaximumQuantity && !loading) {
      await handleChangeQuantity(quantity + 1);
    }
  };

  const handleOnDecrement = async (e: MouseEvent): Promise<void> => {
    e.stopPropagation();
    if (!exceedsMinimumQuantity && !loading) {
      await handleChangeQuantity(quantity - 1);
    }
  };

  const debouncedInput = useDebounce({ fn: handleChangeQuantity, delay: 1500 });

  const handleOnInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const sanitizedInputValue = e.target.value.replace(/\D/g, '');
    const value = parseInt(sanitizedInputValue || '0', 10);
    setInputQuantity(value);
    if (!isDesktop) {
      debouncedInput(value);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleOnBlurInput = async (): Promise<void> => {
    await handleChangeQuantity(inputQuantity || 0);
  };

  const btnVariant =
    buttonVariant ?? (variant === 'light' ? 'tertiary' : 'secondary');

  return (
    <div
      className={classNames(
        'flex justify-between desktop:justify-center gap-[3px] tablet:gap-[3.5px] desktop:gap-2.5 items-center min-w-[100px]',
        className
      )}
    >
      <Button
        data-testid="remove-button-mobile"
        iconName="remove"
        variant={btnVariant}
        onClick={handleOnDecrement}
        size="md"
        disabled={exceedsMinimumQuantity || disabled}
        className={classNames('tablet:hidden', {
          'hover:cursor-default': loading
        })}
      />
      <Button
        data-testid="remove-button"
        iconName="remove"
        variant={btnVariant}
        onClick={handleOnDecrement}
        size="sm"
        disabled={exceedsMinimumQuantity || disabled}
        className={classNames('hidden tablet:flex', {
          'hover:cursor-default': loading
        })}
      />

      {!loading && (
        <Tooltip
          text="Máximo de stock alcanzado"
          open={showStockWarning}
          className="!w-[101px]"
        >
          <input
            value={inputQuantity}
            className={classNames(
              'w-[46px] h-[32px] tablet:w-[43px] tablet:h-[36px] desktop:w-[47px] rounded-4xl',
              'font-bold text-center text-sm',
              'outline-none border border-silver bg-transparent',
              'transition-all duration-200 ease-in-out',
              'focus:bg-white focus:shadow-lg focus:border-transparent',
              'disabled:opacity-30'
            )}
            onChange={handleOnInputChange}
            onBlur={handleOnBlurInput}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
              handleOnKeyDown(e);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={disabled}
          />
        </Tooltip>
      )}
      {loading && (
        <span className="w-[46px] tablet:w-[43px] desktop:w-[47px] flex justify-center">
          <Icon name="spinner" />
        </span>
      )}
      <Button
        data-testid="add-button-mobile"
        iconName="add"
        variant={btnVariant}
        onClick={handleOnIncrement}
        size="md"
        disabled={exceedsMaximumQuantity || disabled}
        className={classNames('tablet:hidden', {
          'hover:cursor-default': loading
        })}
      />
      <Button
        data-testid="add-button"
        iconName="add"
        variant={btnVariant}
        onClick={handleOnIncrement}
        size="sm"
        disabled={exceedsMaximumQuantity || disabled}
        className={classNames('hidden tablet:flex', {
          'hover:cursor-default': loading
        })}
      />
    </div>
  );
};

export default QuantitySelector;
