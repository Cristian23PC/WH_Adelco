import { Cart, type LineItem } from '@Types/adelco/Cart';
import { CtProductsPageResult, ProductsPageResult, CtProduct, Product } from '@Types/adelco/product';
import { CurrencyHelpers } from '../../currencyHelpers';
import { formatTitleCase } from '../../utils/formatLocaleName';
import { flatAttributesByName } from '../../utils/products';

const LOCALE = 'es-CL';
const DEFAULT_IMAGE_URL =
  'https://res.cloudinary.com/dlwdq84ig/image/upload/c_fill,f_auto,g_faces:auto,h_626,q_auto,w_626/xma9egai1uydqldyhym3';

export const ctProductToProduct = (ctProduct: CtProduct, hasZone: boolean, cart?: Cart): Product => {
  const { calculatedPrice, images, attributes: ctAttributes, sku, availability } = ctProduct.masterVariant;
  const attributes = flatAttributesByName(ctAttributes);

  const hasDiscount =
    calculatedPrice && !CurrencyHelpers.isEqualCurrency(calculatedPrice.discountedPrice, calculatedPrice.price);

  const imageUrl = images[0]?.url || DEFAULT_IMAGE_URL;
  const discount = hasDiscount ? `-${calculatedPrice.discountRate}%` : undefined;
  const discountPrice = hasDiscount
    ? CurrencyHelpers.formatForCurrency(calculatedPrice?.unitDiscountedPrice)
    : undefined;
  const price = calculatedPrice
    ? CurrencyHelpers.formatForCurrency(calculatedPrice[hasDiscount ? 'discountedPrice' : 'price'])
    : undefined;
  const unitPrice = calculatedPrice ? CurrencyHelpers.formatForCurrency(calculatedPrice.unitPrice) : undefined;
  const unitSize = attributes.netContent?.toLowerCase();
  const packUnits = attributes.operationalUnitPerBox;
  const description = formatTitleCase(ctProduct.description?.[LOCALE]) || '';
  const brandName = formatTitleCase(attributes.brand);
  const showPrices = Boolean(calculatedPrice || hasZone);
  const outOfStock = !availability?.isOnStock;
  const quantity = cart?.lineItems?.find((lineItem: LineItem) => lineItem?.id === ctProduct.id)?.quantity;

  return {
    id: ctProduct.id,
    brandName,
    description,
    imageUrl,
    ...(discount && { discount, discountPrice }),
    price,
    unitPrice,
    unitSize,
    packUnits,
    showPrices,
    outOfStock,
    sku,
    slug: ctProduct.slug[LOCALE],
    quantity,
  };
};

export const ctProductsPageToProductPage = (
  ctProductsPageResult: CtProductsPageResult,
  hasZone: boolean,
  cart?: Cart,
): ProductsPageResult => {
  let results = [];

  if (ctProductsPageResult.results && ctProductsPageResult.results.length > 0) {
    results = ctProductsPageResult.results.map((result) => ctProductToProduct(result, hasZone, cart));
  }

  return {
    ...ctProductsPageResult,
    results,
  };
};
