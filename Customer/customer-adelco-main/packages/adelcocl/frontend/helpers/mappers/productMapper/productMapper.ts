import { Cart, type LineItem } from '@Types/adelco/cart';
import {
  CtProductsPageResult,
  ProductsPageResult,
  CtProduct,
  Product
} from '@Types/adelco/product';
import { getImageUrl } from '../../../helpers/utils/getImageUrl';
import { CurrencyHelpers } from '../../currencyHelpers';
import { formatTitleCase } from '../../utils/formatLocaleName';
import { flatAttributesByName } from '../../utils/products';

const LOCALE = 'es-CL';
const DEFAULT_IMAGE_URL =
  'https://res.cloudinary.com/dlwdq84ig/image/upload/c_fill,f_auto,g_faces:auto,h_626,q_auto,w_626/xma9egai1uydqldyhym3';

export const ctProductToProduct = (
  ctProduct: CtProduct,
  hasZone: boolean,
  cart?: Cart,
  imageSize?: 'medium' | 'large'
): Product => {
  const {
    calculatedPrice,
    images,
    attributes: ctAttributes,
    sku,
    availability
  } = ctProduct.masterVariant;
  const attributes = flatAttributesByName(ctAttributes);

  const hasDiscount =
    calculatedPrice &&
    !CurrencyHelpers.isEqualCurrency(
      calculatedPrice.discountedPrice,
      calculatedPrice.price
    );

  const imageUrl = getImageUrl(images[0]?.url || DEFAULT_IMAGE_URL, imageSize);
  const discount = hasDiscount
    ? `-${calculatedPrice.discountRate}%`
    : undefined;
  const price = calculatedPrice
    ? CurrencyHelpers.formatForCurrency(calculatedPrice['price'])
    : undefined;
  const calcPrice = calculatedPrice
    ? CurrencyHelpers.formatForCurrency(
        calculatedPrice[hasDiscount ? 'discountedPrice' : 'price']
      )
    : undefined;
  const unitPrice = calculatedPrice
    ? CurrencyHelpers.formatForCurrency(calculatedPrice.unitDiscountedPrice)
    : undefined;
  const unitSize = attributes.netContent?.toLowerCase();
  const packUnits = attributes.operationalUnitPerBox;
  const name = formatTitleCase(ctProduct.name?.[LOCALE]) || '';
  const description = formatTitleCase(ctProduct.description?.[LOCALE]) || '';
  const brandName = formatTitleCase(attributes.brand);
  const showPrices = Boolean(calculatedPrice || hasZone);
  const isOnStock =
    availability?.isOnStock &&
    calculatedPrice?.price?.centAmount !== 0 &&
    !(calculatedPrice?.price?.centAmount === undefined && hasZone);
  const quantity = cart?.lineItems?.find(
    (lineItem: LineItem) => lineItem?.id === ctProduct.id
  )?.quantity;
  const sellUnit = attributes.sellUnit?.label?.toLowerCase();

  return {
    id: ctProduct.id,
    brandName,
    name,
    description,
    imageUrl,
    ...(discount && { discount }),
    price,
    calculatedPrice: calcPrice,
    unitPrice,
    unitSize,
    packUnits,
    showPrices,
    outOfStock: !isOnStock,
    sku,
    slug: ctProduct.slug[LOCALE],
    quantity,
    availableQuantity: availability?.availableQuantity,
    sellUnit
  };
};

export const ctProductsPageToProductPage = (
  ctProductsPageResult: CtProductsPageResult,
  hasZone: boolean,
  cart?: Cart
): ProductsPageResult => {
  let results = [];

  if (ctProductsPageResult.results && ctProductsPageResult.results.length > 0) {
    results = ctProductsPageResult.results.map((result) =>
      ctProductToProduct(result, hasZone, cart, 'medium')
    );
  }

  return {
    ...ctProductsPageResult,
    results
  };
};
