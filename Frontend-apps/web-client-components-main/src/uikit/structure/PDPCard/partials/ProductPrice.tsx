/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { type FC } from 'react';
import { type PDPCardProps } from '../PDPCard';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import classNames from 'classnames';
import { Button } from '../../../actions';
import QuantitySelector from '../../../../molecules/QuantitySelector';

type PricePick =
  | 'literals'
  | 'product'
  | 'amountInCart'
  | 'loading'
  | 'disabled'
  | 'onChangeProductAmount';
interface ProductPriceProps extends Pick<PDPCardProps, PricePick> {}

const ProductPrice: FC<ProductPriceProps> = ({
  literals = {},
  product,
  loading,
  disabled,
  amountInCart = 0,
  onChangeProductAmount
}) => {
  const { isMobile } = useScreen();

  return (
    <div className="flex justify-between gap-2.5 border-y border-snow py-2 my-2 tablet:mb-4 tablet:mt-6 desktop:pb-[18px]">
      <div>
        <div className="text-sm font-semibold">
          {Boolean(product.unitPrice) && (
            <span
              className={classNames('mr-2', {
                'line-through text-failure': product.discountPrice !== undefined
              })}
            >
              {product.unitPrice}/un
            </span>
          )}
          {product.discountPrice !== undefined && (
            <span>{product.discountPrice}/un</span>
          )}
        </div>
        <div>
          <span className="font-bold text-lg mr-[5px]">
            {product?.calculatedPrice}
          </span>
          <span className="text-sm">x {product.packUnits}/un</span>
        </div>
      </div>
      <div className="flex items-center">
        {amountInCart === 0 && (
          <Button
            data-testid="adelco-pdp-add-button"
            size={isMobile ? 'md' : 'sm'}
            onClick={async () => {
              if (!product.outOfStock && !loading) {
                await onChangeProductAmount(1);
              }
            }}
            variant="secondary"
            block
            disabled={product.outOfStock ?? disabled}
            loading={loading}
          >
            {product.outOfStock === true
              ? literals.btnLabelOutOfStock
              : literals.btnLabelAddToCart}
          </Button>
        )}
        {amountInCart > 0 && (
          <QuantitySelector
            variant="dark"
            onChange={onChangeProductAmount}
            quantity={amountInCart}
            availableQuantity={product.availableQuantity}
            loading={loading}
            disabled={disabled}
            className="gap-[7px] tablet:!gap-[13.5px] desktop:!gap-3"
          />
        )}
      </div>
    </div>
  );
};

export default ProductPrice;
