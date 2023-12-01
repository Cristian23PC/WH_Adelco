import React, { type FC } from 'react';
import { type PDPCardProps } from '../PDPCard';

type TotalPricePick =
  | 'literals'
  | 'netTotal'
  | 'discount'
  | 'IVA'
  | 'totalValue';
interface TotalPriceProps extends Pick<PDPCardProps, TotalPricePick> {}
const TotalPrice: FC<TotalPriceProps> = ({
  literals = {},
  netTotal,
  discount,
  IVA,
  totalValue
}) => {
  return (
    <div className="grid gap-2 py-2">
      <div className="grid gap-0.5 text-xs font-semibold tablet:font-normal desktop:text-sm">
        <div className="flex justify-between">
          <span>{literals.netTotalLabel}</span>
          <span>{netTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>{literals.discountLabel}</span>
          <span>-{discount}</span>
        </div>
        <div className="flex justify-between">
          <span>{literals.IVALabel}</span>
          <span>+{IVA}</span>
        </div>
      </div>
      <hr className="border-snow" />
      <div className="flex justify-between text-sm font-bold desktop:text-base">
        <span>{literals.totalValueLabel}</span>
        <span>{totalValue}</span>
      </div>
    </div>
  );
};

export default TotalPrice;
