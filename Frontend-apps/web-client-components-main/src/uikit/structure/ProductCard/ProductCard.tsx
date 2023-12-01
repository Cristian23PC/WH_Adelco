import React from 'react';
import classNames from 'classnames';

import { Badge } from '../../feedback/Badge';
import { Button } from '../../actions/Button';
import QuantitySelector from '../../../molecules/QuantitySelector';
import { Chip } from '../../feedback';
import { type OnChangeQuantityFunction } from '../../../molecules/QuantitySelector/QuantitySelector';
import type { LinkRenderer } from '../../../utils/types';

export interface ProductCardProps {
  'data-testid'?: string;
  className?: string;
  brandName: string;
  name: string;
  imageUrl: string;
  price?: string;
  calculatedPrice?: string;
  unitPrice?: string;
  unitSize?: string;
  packUnits?: number;
  discount?: string;
  showPrices?: boolean;
  isInCart?: boolean;
  outOfStock?: boolean;
  loading?: boolean;
  disabled?: boolean;
  slug?: string;
  availableQuantity?: number;
  btnLabelAddToCart?: string;
  btnLabelSeePrices?: string;
  btnLabelOutOfStock?: string;
  onAddToCart?: VoidFunction;
  onSeePrices?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAddProductCount?: VoidFunction;
  onSubstractProductCount?: VoidFunction;
  onClick?: VoidFunction;
  onChange?: OnChangeQuantityFunction;
  units?: number;
  sellUnit: string;
  linkRenderer: LinkRenderer;
  productUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  'data-testid': dataTestId = 'adelco-product-card',
  className,
  name,
  brandName,
  imageUrl,
  price,
  calculatedPrice,
  unitPrice,
  packUnits = 12,
  unitSize = null,
  discount = null,
  availableQuantity,
  btnLabelAddToCart = 'Agregar',
  btnLabelSeePrices = 'Ver Precios',
  btnLabelOutOfStock = 'Agotado',
  showPrices = false,
  isInCart = false,
  outOfStock = false,
  loading = false,
  disabled = false,
  onAddToCart = () => {},
  onSeePrices = () => {},
  onClick,
  onChange = () => null,
  linkRenderer = () => null,
  productUrl = '',
  units = 0,
  sellUnit
}) => {
  const shouldShowQuantitySelector = units > 0;

  const ButtonSelected: React.FC = () => {
    let fn: (
      e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void = () => {};
    let btnLabel = btnLabelSeePrices;
    let classes: string | undefined;

    if (!showPrices) {
      fn = (e) => {
        e?.stopPropagation();
        onSeePrices();
      };
      classes = 'mt-2';
    } else if (showPrices && !isInCart && !outOfStock && calculatedPrice) {
      fn = (e) => {
        e?.stopPropagation();
        onAddToCart();
      };
      btnLabel = btnLabelAddToCart;
    } else if (outOfStock || !calculatedPrice) {
      btnLabel = btnLabelOutOfStock;
    }
    return (
      <div>
        <Button
          onClick={!loading ? fn : () => {}}
          className={classNames(classes, 'tablet:hidden', {
            'hover:cursor-default': loading
          })}
          block
          size="md"
          variant="secondary"
          disabled={outOfStock || (!calculatedPrice && showPrices) || disabled}
          loading={loading}
        >
          {btnLabel}
        </Button>
        <Button
          onClick={!loading ? fn : () => {}}
          className={classNames(classes, 'hidden tablet:flex desktop:flex', {
            'hover:cursor-default': loading
          })}
          block
          size="sm"
          variant="secondary"
          disabled={outOfStock || (!calculatedPrice && showPrices) || disabled}
          loading={loading}
        >
          {btnLabel}
        </Button>
      </div>
    );
  };

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'p-3 desktop:p-4',
        'text-corporative-02',
        'bg-white',
        'rounded-[24px] tablet:rounded-2xl',
        'shadow-card',
        'font-sans text-xs tablet:text-sm',
        'flex flex-col justify-between',
        'hover:cursor-pointer',
        className
      )}
    >
      {linkRenderer(
        productUrl,
        <div>
          <div className="w-100 relative h-0 pb-[104%] desktop:pb-[100%]">
            {discount != null && showPrices && (
              <Badge className="absolute left-0 bottom-0 z-[1] !text-white !bg-black !font-semibold">
                {discount}
              </Badge>
            )}
            <div
              className={classNames(
                'absolute top-0 left-0 right-0 bottom-0 flex items-center',
                {
                  'opacity-30': outOfStock || (!calculatedPrice && showPrices)
                }
              )}
            >
              <img
                src={imageUrl}
                alt={brandName}
                className="border-0 rounded-none max-h-[100%] max-w-100 object-cover mx-auto"
              />
            </div>
          </div>
          <p className="line-clamp-1 font-bold text-corporative-02-hover text-xs mt-2 mb-1">
            {brandName}
          </p>
          <p className="line-clamp-2 text-corporative-03 font-semibold text-sm">
            {name}
          </p>
          {unitSize != null && (
            <p className="text-corporative-02-hover text-xs font-bold">
              {unitSize}
            </p>
          )}
          <div className="my-2">
            <Chip
              label={`${packUnits} x ${sellUnit}`}
              className="!border-corporative-04 !text-corporative-02-hover font-semibold !text-[10px]"
            />
          </div>
          {showPrices && (
            <div className="my-2">
              <div className="flex items-center">
                <span className="pr-[5px] text-base text-corporative-04 font-bold">
                  {calculatedPrice}
                </span>
                {discount != null && (
                  <span className="text-xs font-semibold text-corporative-02-hover line-through">
                    {price}
                  </span>
                )}
              </div>
              {unitPrice && (
                <p className="pb-0">
                  <span className="font-semibold text-xs">{unitPrice} un</span>
                </p>
              )}
              {!calculatedPrice && !unitPrice && <div className="h-4"></div>}
            </div>
          )}
        </div>
      )}
      {shouldShowQuantitySelector && (
        <QuantitySelector
          quantity={units}
          onChange={onChange}
          buttonVariant="secondary"
          availableQuantity={availableQuantity}
          loading={loading}
          disabled={disabled}
        />
      )}

      {!shouldShowQuantitySelector && <ButtonSelected />}
    </div>
  );
};

export default ProductCard;
