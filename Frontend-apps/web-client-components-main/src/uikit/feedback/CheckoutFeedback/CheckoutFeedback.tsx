import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';

export interface Props {
  title?: string;
  'data-testid'?: string;
  variant?: 'info' | 'success' | 'error';
  className?: string;
  message: string;
}

const CheckoutFeedback: FC<Props> = ({
  title,
  'data-testid': dataTestId = 'adelco-checkout-feedback',
  variant = 'info',
  message,
  className
}) => {
  return (
    <div
      className={classNames(
        'flex gap-2 w-full items-center',
        'border',
        {
          'p-2 rounded-[24px]': variant !== 'info',
          'border-corporative-01 px-4 py-1 rounded-2xl bg-corporative-01 tablet:justify-center':
            variant === 'info',
          'border-success-light p-2 text-success font-semibold items-center justify-center bg-white':
            variant === 'success',
          'border-failure tablet:justify-center bg-white': variant === 'error'
        },
        className
      )}
      data-testid={dataTestId}
    >
      <div className="flex gap-2 items-center">
        <div
          className={classNames({
            'p-1 rounded-2xl border': variant !== 'info',
            'bg-failure border-failure': variant === 'error',
            'bg-success-light border-success': variant === 'success'
          })}
        >
          <Icon
            name={variant === 'success' ? 'done' : 'delivery'}
            width={variant === 'info' ? 24 : 16}
            height={variant === 'info' ? 24 : 16}
            className={classNames({
              'fill-black': variant === 'info',
              'fill-success': variant === 'success',
              'fill-white': variant === 'error'
            })}
          />
        </div>
        <div
          className={classNames(
            'flex flex-col tablet:flex-row tablet:gap-2 tablet:items-baseline'
          )}
        >
          {title && variant === 'info' && (
            <h2 className="text-sm font-bold">{title}</h2>
          )}
          <p className="font-semibold text-xs">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFeedback;
