import React, { type FC } from 'react';
import {
  Breadcrumb,
  type BreadcrumbProps,
  PDPCard,
  type PDPCardProps
} from '../../uikit';

export interface Props extends PDPCardProps, BreadcrumbProps {}

const ProductDetails: FC<Props> = ({
  elements,
  linkRenderer,
  ...pdpCardProps
}) => {
  return (
    <div>
      <Breadcrumb
        className="hidden tablet:flex mb-4"
        elements={elements}
        linkRenderer={linkRenderer}
      />
      <PDPCard
        {...pdpCardProps}
        className="mt-2.5 tablet:mx-[42px] desktop:mx-[99px]"
      />
    </div>
  );
};

export default ProductDetails;
