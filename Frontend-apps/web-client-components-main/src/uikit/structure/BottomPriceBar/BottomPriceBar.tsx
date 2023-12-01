import React from 'react';
import classNames from 'classnames';

import { Button } from '../../actions';

export const DEFAULT_LITERALS = {
  totalToPay: 'Total a pagar',
  submitBtnLabel: 'Crear pedido'
};

export interface BottomPriceBarProps {
  'data-testid'?: string;
  className?: string;
  totalPrice: string;
  createOrderDisabled?: boolean;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onSubmit: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const BottomPriceBar: React.FC<BottomPriceBarProps> = ({
  'data-testid': dataTestId = 'adelco-bottom-price-bar',
  className,
  totalPrice,
  createOrderDisabled = false,
  literals,
  onSubmit
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    literals
  };
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'font-san shadow-bottomFixed bg-white',
        'py-2 px-4 fixed z-20 bottom-2.5',
        'grid grid-cols-min-100-auto gap-1 w-full',
        className
      )}
    >
      <div>
        <p className="m-0 text-xs text-corporative-03">{l.totalToPay}</p>
        <p className="m-0 text-base font-bold text-corporative-02">
          {totalPrice}
        </p>
      </div>
      <div className="flex items-center">
        <Button
          variant="primary"
          className="w-full"
          size="md"
          onClick={onSubmit}
          disabled={createOrderDisabled}
        >
          {l.submitBtnLabel}
        </Button>
      </div>
    </div>
  );
};

export default BottomPriceBar;
