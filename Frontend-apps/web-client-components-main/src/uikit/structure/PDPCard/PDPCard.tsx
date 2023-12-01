import React, { type FC } from 'react';
import { Button } from '../../actions';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import { Badge } from '../../feedback/Badge';
import { type Product } from './types';
// import TotalPrice from './partials/TotalPrice';
import ProductPrice from './partials/ProductPrice';
import ProductDescription from './partials/ProductDescription';
import classNames from 'classnames';
import { type OnChangeQuantityFunction } from '../../../molecules/QuantitySelector/QuantitySelector';

const defaultLabels = {
  btnLabelAddToCart: 'Agregar',
  btnLabelSeePrices: 'Ver Precios',
  btnLabelOutOfStock: 'Agotado',
  netTotalLabel: 'Total neto',
  discountLabel: 'Descuento',
  IVALabel: 'IVA',
  totalValueLabel: 'Valor total',
  skuLabel: 'SKU'
};

export interface PDPCardProps {
  product: Product;
  onBack?: VoidFunction;
  onShowPrices?: VoidFunction;
  onChangeProductAmount: OnChangeQuantityFunction;
  showPrice?: boolean;
  amountInCart?: number;
  loading?: boolean;
  disabled?: boolean;
  literals?: { [key in keyof typeof defaultLabels]?: string };
  netTotal?: string;
  discount?: string;
  IVA?: string;
  totalValue?: string;
  className?: string;
  'data-testid'?: string;
}
const PDPCard: FC<PDPCardProps> = ({
  product,
  'data-testid': dataTestId = 'adelco-pdp-card',
  onBack,
  onShowPrices,
  onChangeProductAmount,
  showPrice = false,
  loading = false,
  disabled = false,
  amountInCart = 0,
  literals = {},
  netTotal = '$0',
  discount = '$0',
  IVA = '$0',
  totalValue = '$0',
  className
}) => {
  const { isMobile } = useScreen();
  const labels = {
    ...defaultLabels,
    ...literals
  };

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'flex justify-center tablet:block tablet:max-w-[720px] desktop:block desktop:max-w-[886px] text-corporative-03',
        className
      )}
    >
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6 tablet:gap-12 desktop:gap-[100px]">
        <figure className="flex justify-around relative">
          {Boolean(onBack) && (
            <div className="relative tablet:hidden">
              <Button
                data-testid="adelco-pdp-back-button"
                className="absolute"
                onClick={onBack}
                variant="tertiary"
                iconName="arrow_back"
              />
            </div>
          )}
          <img
            src={product.imageUrl}
            alt={product.brandName}
            className="object-cover"
          />
          {product.discount !== undefined && (
            <Badge className="absolute left-0 bottom-0 tablet:top-0 tablet:bottom-auto z-10">
              {product.discount}
            </Badge>
          )}
        </figure>
        <div className="tablet:mt-2">
          <ProductDescription product={product} literals={labels} />
          {!showPrice && (
            <div className="py-4">
              <Button
                data-testid="adelco-pdp-show-prices-button"
                onClick={onShowPrices}
                size={isMobile ? 'md' : 'sm'}
                className="w-full"
                variant="secondary"
              >
                {labels.btnLabelSeePrices}
              </Button>
            </div>
          )}
          {showPrice && (
            <>
              <ProductPrice
                literals={labels}
                product={product}
                amountInCart={amountInCart}
                onChangeProductAmount={onChangeProductAmount}
                loading={loading}
                disabled={disabled}
              />
              {/* <TotalPrice
                literals={labels}
                netTotal={netTotal}
                discount={discount}
                IVA={IVA}
                totalValue={totalValue}
              /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDPCard;
