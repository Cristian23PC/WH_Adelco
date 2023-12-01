import { ReactNode } from 'react';
import {
  FilterNoResults,
  Grid,
  ProductCard,
  Spinner
} from '@adelco/web-components';
import { useFilterContext } from 'contexts/Filter/FilterContext';
import useAddLineItem from 'frontastic/actions/adelco/cart/useAddLineItem/useAddLineItem';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity/useSetLineItemQuantity';
import useTrackCart from 'helpers/hooks/analytics/useTrackCart';
import useScreen from 'helpers/hooks/useScreen';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ProductGrid = ({
  isLoading,
  results,
  total,
  getCartItem,
  showPrices,
  breadcrumb,
  category
}) => {
  const { isDesktop } = useScreen();
  const { openFilters } = useFilterContext();
  const router = useRouter();
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

  const linkRenderer = (link: string, label: ReactNode) => (
    <Link href={link}>
      <a>{label}</a>
    </Link>
  );

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

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-92px-250px-166px)] overflow-y-hidden">
        <Spinner className="" backdropClassName="!z-10" opacity="50" />
      </div>
    );
  }

  if (!total) {
    return (
      <div className="m-auto w-full">
        <FilterNoResults onClick={!isDesktop ? openFilters : undefined} />
      </div>
    );
  }

  return (
    <Grid className="w-full desktop:w-[886px]">
      {results.map((item) => {
        const lineItem = getCartItem(item.id);
        const itemLoading =
          (isAddLineItemLoading && item.sku === lastAddedItem?.sku) ||
          (isSetLineItemQuantityLoading &&
            lineItem?.id === lastChangedItem?.id);
        const disabled = isSetLineItemQuantityLoading || isAddLineItemLoading;

        return (
          <ProductCard
            key={item.id}
            linkRenderer={linkRenderer}
            productUrl={`/producto/${item.slug}`}
            onSeePrices={showPrices}
            {...item}
            name={item.name}
            units={lineItem?.quantity}
            onChange={async (quantity: number) => {
              if (lineItem && !isLoading) {
                const response = await handleChangeQuantity(
                  lineItem.id,
                  quantity,
                  lineItem.quantity
                );

                return response;
              }
            }}
            loading={itemLoading}
            disabled={disabled}
            onAddToCart={async () => {
              const productData = {
                ...item,
                category: breadcrumb?.[1]?.label
              };

              if (!isLoading) {
                const quantity = item.quantity || 1;
                try {
                  await addLineItem({
                    sku: item.sku,
                    quantity
                  });
                  trackAddToCard(productData);
                } catch (e) {
                  trackAddToCard(productData, true);
                }
              }
            }}
          />
        );
      })}
    </Grid>
  );
};

export default ProductGrid;
