import React, { FC, useState } from 'react';
import { BreadcrumbItem, Category } from '@Types/adelco/category';
import { CtProduct } from '@Types/adelco/product';
import { SessionData } from '@Types/adelco/SessionData';
import { ProductDetails } from 'am-ts-components';
import useAddLineItem from 'frontastic/actions/adelco/cart/useAddLineItem/useAddLineItem';
import useCart from 'frontastic/actions/adelco/cart/useCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity';
import { ctProductToProduct } from '../../../../../helpers/mappers/productMapper';
import { linkRenderer } from '../../../../../helpers/utils/linkRenderer';
import ZoneSelector from '../../zoneSelector';

type Props = {
  data: {
    data: {
      dataSource: {
        product: CtProduct;
        sessionData?: SessionData;
        category?: Category;
        breadcrumb: BreadcrumbItem[];
      };
    };
  };
};

const ProductDetailsTastic: FC<Props> = ({ data }) => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const { cart, getCartItem } = useCart();
  const { trigger: setItemQuantity } = useSetLineItemQuantity();
  const { trigger: addLineItem } = useAddLineItem();

  if (!data) return <></>;

  const { product, breadcrumb } = data.data.dataSource;
  const userAccount = data.data.dataSource.sessionData?.userAccount || {};

  const mappedProduct = ctProductToProduct(product, Boolean(userAccount?.dch && userAccount?.t2z), cart);
  const lineItem = getCartItem(product.id);

  const handleOnCloseZoneModal = () => {
    setIsZoneModalOpen(false);
  };

  return (
    <>
      <ZoneSelector open={isZoneModalOpen} onClose={handleOnCloseZoneModal} />
      <div className="grid place-items-center tablet:px-6">
        <div className="grid w-full place-items-center p-4 tablet:px-0 desktop:w-[886px]">
          <ProductDetails
            elements={breadcrumb}
            product={mappedProduct}
            onChangeProductAmount={(quantity) => {
              if (lineItem) {
                setItemQuantity({ id: lineItem.id, quantity });
              } else {
                addLineItem({ sku: mappedProduct.sku, quantity });
              }
            }}
            showPrice={Boolean(userAccount?.dch && userAccount?.t2z)}
            amountInCart={lineItem?.quantity}
            linkRenderer={linkRenderer}
            onShowPrices={() => setIsZoneModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsTastic;
