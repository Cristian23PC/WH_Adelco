import { Cart, LineItem } from '@Types/adelco/cart';
import { Image, type CtTax, Money } from '@Types/adelco/general';
import { type CtDiscount } from '@Types/adelco/product';
import { formatTitleCase } from '../../../helpers/utils/formatLocaleName';
import { CurrencyHelpers } from '../../currencyHelpers';
import { getImageUrl } from '../../../helpers/utils/getImageUrl';

const IVA_DISCOUNT = 'IVA';
const LOCALE = 'es-CL';
const DEFAULT_IMAGE_URL =
  'https://res.cloudinary.com/dlwdq84ig/image/upload/c_fill,f_auto,g_faces:auto,h_626,q_auto,w_626/xma9egai1uydqldyhym3';

export const numberToMoney = (amount: number): Money => ({
  type: 'centPrecision',
  currencyCode: 'CLP',
  centAmount: amount,
  fractionDigits: 0
});

export const ctLineItemToLineItem = (item: LineItem) => {
  const { discountRate, taxes, unitPrice, lineGrossPrice } = item.lineDetails;
  const attributes = !Array.isArray(item.variant)
    ? item.variant.attributes
    : [];
  const images: Image[] = !Array.isArray(item.variant)
    ? item.variant.images
    : [];

  const totalItemTaxesAmount = taxes
    .map((tax) => tax?.amount || 0)
    .reduce((acc: number, taxAmount) => acc + (taxAmount || 0), 0);

  return {
    id: item.id,
    brandName: attributes.find((attr) => attr.name === 'brand')?.value,
    sellUnit: formatTitleCase(
      attributes.find((attr) => attr.name === 'sellUnit')?.value?.label
    ),
    name: formatTitleCase(
      `${item.name[LOCALE]} ${
        attributes.find((attr) => attr.name === 'brand')?.value
      } ${attributes.find((attr) => attr.name === 'netContent')?.value}`
    ),
    imageUrl: getImageUrl(images[0]?.url || DEFAULT_IMAGE_URL, 'medium'),
    quantity: item.quantity,
    unitPrice: CurrencyHelpers.formatForCurrency(numberToMoney(unitPrice)),
    price: CurrencyHelpers.formatForCurrency(numberToMoney(lineGrossPrice)),
    discount: discountRate > 0 ? `-${discountRate}%` : undefined,
    totalTaxesAmount: CurrencyHelpers.formatForCurrency(
      numberToMoney(totalItemTaxesAmount)
    )
  };
};

export const ctCartToCart = (cart: Cart) => {
  const discounts: CtDiscount[] = cart.totalDetails?.discounts || [];
  const totalDiscount = discounts?.reduce(
    (acc: number, discount: CtDiscount) => acc + discount.amount,
    0
  );

  const totalTaxAmount = (cart.totalDetails?.taxes || []).reduce(
    (total, tax) => {
      return total + (tax.amount || 0);
    },
    0
  );

  const taxes = [
    {
      description: 'Impuestos',
      amount: CurrencyHelpers.formatForCurrency(numberToMoney(totalTaxAmount))
    }
  ];

  const ivaDiscounts: CtTax[] =
    cart.totalDetails?.taxes?.filter(
      (tax: CtTax) => tax.description === IVA_DISCOUNT
    ) || [];
  const totalIva = ivaDiscounts.reduce(
    (acc: number, tax: CtTax) => tax.amount + acc,
    0
  );

  const items = cart?.lineItems?.map((item: LineItem) =>
    ctLineItemToLineItem(item)
  );

  const totalTaxesAmount = (cart?.totalDetails?.taxes || [])
    .map((tax) => tax?.amount || 0)
    .reduce((acc: number, taxAmount) => acc + (taxAmount || 0), 0);

  return {
    subtotal: CurrencyHelpers.formatForCurrency(
      numberToMoney(cart.totalDetails?.subtotalPrice || 0)
    ),
    totalPrice: CurrencyHelpers.formatForCurrency(
      numberToMoney(cart.totalDetails?.grossPrice || 0)
    ),
    discountTotal: CurrencyHelpers.formatForCurrency(
      numberToMoney(totalDiscount || 0)
    ),
    discountsQuantity: discounts?.length || 0,
    ivaTotal: CurrencyHelpers.formatForCurrency(numberToMoney(totalIva || 0)),
    taxes,
    totalTaxesAmount: CurrencyHelpers.formatForCurrency(
      numberToMoney(totalTaxesAmount)
    ),
    lineItems: items,
    totalLineItemQuantity: cart.totalLineItemQuantity,
    cartUpdates: cart.cartUpdates
  };
};
