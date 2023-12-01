import React, { type FC, type HTMLAttributes } from 'react';
import classnames from 'classnames';

export interface CartIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  quantity: number;
  size?: 'sm' | 'md';
}

const CartIndicator: FC<CartIndicatorProps> = ({
  quantity,
  size = 'sm',
  className,
  ...rest
}) => {
  const normalizeQuantity = quantity > 99 ? '99+' : quantity;
  return (
    <span
      className={classnames(
        'inline-block bg-corporative-01 text-center font-bold',
        { 'p-[1px] text-xs min-w-[18px] rounded-3xl': size === 'sm' },
        {
          'p-1 text-xl min-w-[38px] rounded-[40px] leading-[30px]':
            size === 'md'
        },
        className
      )}
      {...rest}
    >
      {normalizeQuantity}
    </span>
  );
};

export default CartIndicator;
