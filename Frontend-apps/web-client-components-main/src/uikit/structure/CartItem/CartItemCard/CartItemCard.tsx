import React from 'react';
import classNames from 'classnames';

import { Badge } from '../../../feedback';
import { Button } from '../../../actions';
import QuantitySelector from '../../../../molecules/QuantitySelector';
import { type OnChangeCartItemQuantityFunction } from '../../../../organisms/Cart/Cart/Cart';

export const DEFAULT_LITERALS = {
  unitLiteral: 'un'
};
export interface CartItemCardProps {
  'data-testid'?: string;
  className?: string;
  lineItem: {
    id: string;
    brandName: string;
    name: string;
    unitPrice: string;
    discount?: string;
    price: string;
    imageUrl: string;
    quantity: number;
    sellUnit: string;
    availableQuantity?: number;
  };
  isMobile?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onDelete: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  onChangeQuantity: OnChangeCartItemQuantityFunction;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  'data-testid': dataTestId = 'adelco-cart-item-card',
  className,
  lineItem,
  isMobile = false,
  loading = false,
  disabled = false,
  onDelete,
  onChangeQuantity
}) => {
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'bg-snow p-2 tablet:p-4 rounded-2xl',
        'grid grid-cols-[50px_1fr] tablet:grid-cols-[80px_1fr] gap-2 tablet:gap-4',
        'font-sans text-corporative-03',
        className
      )}
    >
      {/* left side */}
      <div>
        {/* image & discount */}
        <img
          src={lineItem.imageUrl}
          alt={lineItem.name}
          className="border-0 w-100"
        />
        {lineItem.discount != null && (
          <Badge size="sm" className="mx-auto mt-1 text-corporative-02">
            {lineItem.discount}
          </Badge>
        )}
      </div>
      {/* right side */}
      <div>
        {/* description, close btn and unit price */}
        <div className="grid gap-2 grid-cols-[1fr_20px] tablet:grid-cols-[1fr_24px]">
          <div>
            <div className="line-clamp-2">
              <p className="text-xs tablet:text-sm">{lineItem.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold mt-1 text-corporative-02">
                {lineItem.unitPrice}
                {'/'}
                {lineItem.sellUnit}
              </p>
            </div>
          </div>
          <div>
            <Button
              variant="tertiary"
              iconName="close"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, lineItem.id);
              }}
            />
          </div>
        </div>
        {/* total price and quantity */}
        <div className="flex justify-between mt-1 items-center">
          <div className="text-base font-bold">{lineItem.price}</div>
          <QuantitySelector
            quantity={lineItem.quantity}
            onChange={async (quantity) => {
              const result = await onChangeQuantity(
                lineItem.id,
                quantity,
                lineItem.quantity
              );
              return result;
            }}
            availableQuantity={lineItem.availableQuantity}
            loading={loading}
            disabled={disabled}
            className="gap-1 tablet:!gap-[13.5px] desktop:!gap-3"
          />
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
