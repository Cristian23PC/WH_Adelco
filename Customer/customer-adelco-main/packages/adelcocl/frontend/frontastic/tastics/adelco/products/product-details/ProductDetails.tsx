import React, { FC, useEffect } from 'react';
import { BreadcrumbItem, Category } from '@Types/adelco/category';
import { CtProduct } from '@Types/adelco/product';
import { SessionData } from '@Types/adelco/SessionData';
import { ProductDetails } from '@adelco/web-components';
import useAddLineItem from 'frontastic/actions/adelco/cart/useAddLineItem/useAddLineItem';
import useCart from 'frontastic/actions/adelco/cart/useCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity';
import { ctProductToProduct } from '../../../../../helpers/mappers/productMapper';
import { linkRenderer } from '../../../../../helpers/utils/linkRenderer';
import { useDetailProduct } from 'frontastic/actions/adelco/products/useDetailProduct';
import Loader from 'components/adelco/Loader';
import useTrackViewPrices from 'helpers/hooks/analytics/useTrackViewPrices';
import useTrackCart from 'helpers/hooks/analytics/useTrackCart';
import { useModalContext } from '../../../../../contexts/modalContext';
import Head from 'components/adelco/Head';
import { MetadataFormat } from 'helpers/utils/metadataFormat';

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
  const { trackViewPrices } = useTrackViewPrices();
  const userAccount = data.data.dataSource.sessionData?.userAccount || {};
  const { cart, getCartItem } = useCart();
  const { openLoginModal } = useModalContext();

  const {
    trigger: setItemQuantity,
    isLoading: isSetLineItemQuantityLoading,
    lastItem: lastChangedItem
  } = useSetLineItemQuantity();
  const {
    trigger: addLineItem,
    isLoading: isAddLineItemLoading,
    lastItem: lastAddedItem
  } = useAddLineItem();
  const isLoading = isSetLineItemQuantityLoading || isAddLineItemLoading;
  const { product: defaultProduct, breadcrumb } = data.data.dataSource;
  const { product, reload, isValidating } = useDetailProduct(
    defaultProduct,
    defaultProduct.slug['es-CL']
  );
  const { trackAddToCard } = useTrackCart();

  useEffect(() => {
    reload();
  }, []);

  if (!data) return <></>;

  const mappedProduct = ctProductToProduct(
    product,
    Boolean(userAccount?.dch && userAccount?.t2z),
    cart,
    'large'
  );
  const lineItem = getCartItem(product.id);
  const itemLoading =
    (isAddLineItemLoading && mappedProduct.sku === lastAddedItem?.sku) ||
    (isSetLineItemQuantityLoading && lineItem?.id === lastChangedItem?.id);
  const disabled = isAddLineItemLoading || isSetLineItemQuantityLoading;

  const handleOnShowPrices = () => {
    trackViewPrices();
    openLoginModal();
  };

  const metadataString = `${mappedProduct.name} ${mappedProduct.brandName}`;

  return (
    <>
      <Head
        title={MetadataFormat.formatTitle(metadataString)}
        description={MetadataFormat.formatDescription(metadataString)}
      />
      {isValidating && <Loader />}
      <div className="grid place-items-center tablet:px-6">
        <div className="grid w-full place-items-center p-4 tablet:px-0 desktop:w-[886px]">
          <ProductDetails
            elements={breadcrumb}
            product={mappedProduct}
            onChangeProductAmount={async (quantity) => {
              const productData = {
                ...mappedProduct,
                category: breadcrumb?.[1]?.label
              };

              if (lineItem && !isLoading) {
                const response = await setItemQuantity({
                  id: lineItem.id,
                  quantity,
                  currentQuantity: lineItem.quantity
                });

                return response;
              } else if (!isLoading) {
                try {
                  await addLineItem({
                    sku: mappedProduct.sku,
                    quantity
                  });
                  trackAddToCard(productData);
                } catch {
                  trackAddToCard(productData, true);
                }
              }
            }}
            showPrice={!!mappedProduct.calculatedPrice}
            amountInCart={lineItem?.quantity}
            linkRenderer={linkRenderer}
            onShowPrices={handleOnShowPrices}
            loading={itemLoading}
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsTastic;
