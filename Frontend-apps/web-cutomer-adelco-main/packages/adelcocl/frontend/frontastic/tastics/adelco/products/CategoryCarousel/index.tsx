import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { CtCategory } from '@Types/adelco/category';
import { CtProductsPageResult } from '@Types/adelco/product';
import { CategoryCarousel } from 'am-ts-components';
import useAddLineItem from 'frontastic/actions/adelco/cart/useAddLineItem/useAddLineItem';
import useCart from 'frontastic/actions/adelco/cart/useCart/useCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity/useSetLineItemQuantity';
import useUser from 'frontastic/actions/adelco/user/useUser';
import { ctProductsPageToProductPage } from '../../../../../helpers/mappers/productMapper';
import { formatCapitalizeText } from '../../../../../helpers/utils/formatLocaleName';
import { LinkRenderer } from '../../../../../helpers/utils/linkRenderer';
import ZoneSelector from '../../zoneSelector';

export const linkRenderer = (link, label) => <LinkRenderer href={link}>{label}</LinkRenderer>;

type Props = {
  data?: {
    data?: {
      dataSource?: CtProductsPageResult & { category: CtCategory };
    };
  };
};

const CategoryCarouselTastic: FC<Props> = ({
  data: {
    data: { dataSource },
  },
}) => {
  const router = useRouter();
  const { getCartItem } = useCart();
  const { trigger: setItemQuantity } = useSetLineItemQuantity();
  const { trigger: addLineItem } = useAddLineItem();
  const { user } = useUser();
  const { category } = dataSource;
  const products = ctProductsPageToProductPage(dataSource, Boolean(user?.dch && user?.t2z));

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  const handleChangeQuantity = (id: string, quantity: number) => {
    setItemQuantity({ id, quantity });
  };

  const productCards = products.results.map((product) => {
    const lineItem = getCartItem(product.id);
    return {
      ...product,
      onSeePrices: () => setIsZoneModalOpen(true),
      units: lineItem?.quantity,
      onChange: (quantity: number) => {
        if (lineItem) {
          handleChangeQuantity(lineItem.id, quantity);
        }
      },
      onAddToCart: () => {
        const quantity = product.quantity || 1;
        addLineItem({ sku: product.sku, quantity });
      },
    };
  });

  const handleOnCloseZoneModal = () => {
    setIsZoneModalOpen(false);
  };

  if (!category) return;

  return (
    <>
      <ZoneSelector open={isZoneModalOpen} onClose={handleOnCloseZoneModal} />
      <CategoryCarousel
        title={formatCapitalizeText(category.name['es-CL'])}
        products={productCards}
        linkButton={{ label: 'Ver más', url: `/category/${category.slug['es-CL']}`, icon: 'arrow_next', linkRenderer }}
        onClick={(slug) => router.push(`/product/${slug}`)}
      />
    </>
  );
};

export default CategoryCarouselTastic;
