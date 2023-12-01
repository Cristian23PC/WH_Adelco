import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CtCategory } from '@Types/adelco/category';
import { CtProductsPageResult } from '@Types/adelco/product';
import { CategoryCarousel } from '@adelco/web-components';
import useAddLineItem from 'frontastic/actions/adelco/cart/useAddLineItem/useAddLineItem';
import useCart from 'frontastic/actions/adelco/cart/useCart/useCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity/useSetLineItemQuantity';
import useGetFiveCategoryProducts from 'frontastic/actions/adelco/products/useGetFiveCategoryProducts';
import useUser from 'frontastic/actions/adelco/user/useUser';
import { ctProductsPageToProductPage } from '../../../../../helpers/mappers/productMapper';
import { formatCapitalizeText } from '../../../../../helpers/utils/formatLocaleName';
import { LinkRenderer } from '../../../../../helpers/utils/linkRenderer';
import Loader from 'components/adelco/Loader';
import useTrackViewPrices from 'helpers/hooks/analytics/useTrackViewPrices';
import useTrackCart from 'helpers/hooks/analytics/useTrackCart';
import { useModalContext } from '../../../../../contexts/modalContext';

export const linkRenderer = (link, label) => (
  <LinkRenderer href={link}>{label}</LinkRenderer>
);

type Props = {
  data?: {
    data?: {
      dataSource?: CtProductsPageResult & { category: CtCategory } & {
        categoryUrl: string;
      };
    };
  };
};

const LOCALE = 'es-CL';

const CategoryCarouselTastic: FC<Props> = ({
  data: {
    data: { dataSource }
  }
}) => {
  const router = useRouter();
  const { trackViewPrices } = useTrackViewPrices();
  const { user } = useUser();
  const { getCartItem } = useCart();
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
  const { trackAddToCard } = useTrackCart();

  const isLoading = isSetLineItemQuantityLoading || isAddLineItemLoading;

  const { category } = dataSource;

  const {
    products: rawProducts,
    reload,
    isValidating
  } = useGetFiveCategoryProducts(category?.slug?.[LOCALE], dataSource);
  const products = ctProductsPageToProductPage(
    rawProducts,
    Boolean(user?.dch && user?.t2z)
  );

  useEffect(() => {
    reload();
  }, []);

  const handleChangeQuantity = async (
    itemId: string,
    quantity: number,
    currentQuantity?: number
  ) => {
    const response = await setItemQuantity({
      id: itemId,
      quantity,
      currentQuantity
    });

    return response;
  };

  const handleOnShowPrices = () => {
    trackViewPrices();
    openLoginModal();
  };

  const productCards = products.results.map((product) => {
    const lineItem = getCartItem(product.id);
    const itemLoading =
      (isAddLineItemLoading && product.sku === lastAddedItem?.sku) ||
      (isSetLineItemQuantityLoading && lineItem?.id === lastChangedItem?.id);
    const disabled = isAddLineItemLoading || isSetLineItemQuantityLoading;

    return {
      ...product,
      productUrl: `/producto/${product.slug}`,
      linkRenderer,
      onSeePrices: handleOnShowPrices,
      units: lineItem?.quantity,
      loading: itemLoading,
      disabled,
      onChange: async (quantity: number) => {
        if (lineItem && !isLoading) {
          const response = await handleChangeQuantity(
            lineItem.id,
            quantity,
            lineItem.quantity
          );

          return response;
        }
      },
      onAddToCart: async () => {
        const productData = {
          ...product,
          category: formatCapitalizeText(category.name[LOCALE])
        };

        if (!isLoading) {
          try {
            await addLineItem({
              sku: product.sku,
              quantity: product.quantity || 1
            });
            trackAddToCard(productData);
          } catch {
            trackAddToCard(productData, true);
          }
        }
      }
    };
  });

  if (!category || isValidating) return;

  return (
    <>
      <CategoryCarousel
        title={formatCapitalizeText(category.name[LOCALE])}
        products={productCards}
        linkButton={{
          label: 'Ver más',
          url: dataSource.categoryUrl,
          icon: 'arrow_next',
          linkRenderer
        }}
        onClick={(slug) => router.push(`/producto/${slug}`)}
      />
    </>
  );
};

export default CategoryCarouselTastic;
