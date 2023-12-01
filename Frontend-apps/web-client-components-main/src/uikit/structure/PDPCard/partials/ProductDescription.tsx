import React, { type FC } from 'react';
import { type PDPCardProps } from '../PDPCard';

interface ProductDescriptionProps
  extends Pick<PDPCardProps, 'product' | 'literals'> {}

const ProductDescription: FC<ProductDescriptionProps> = ({
  product,
  literals = {}
}) => {
  return (
    <div className="grid gap-1">
      <div className="font-bold text-sm tablet:text-base">
        {product.brandName}
      </div>
      <h1 className="font-semibold tablet:font-normal text-xs desktop:text-sm">
        {product.name}
      </h1>
      <div className="font-semibold tablet:font-normal text-xs desktop:text-sm">
        {product.unitSize}
      </div>
      <div className="font-normal tablet:font-semibold text-xs">
        {literals.skuLabel} {product.sku}
      </div>
    </div>
  );
};

export default ProductDescription;
