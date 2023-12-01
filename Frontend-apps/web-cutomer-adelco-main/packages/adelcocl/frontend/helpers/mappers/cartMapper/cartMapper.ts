import { Cart, LineItem } from '@Types/adelco/Cart';
import { Image, type CtTax, Money } from '@Types/adelco/general';
import { type CtDiscount } from '@Types/adelco/product';
import { formatTitleCase } from '../../../helpers/utils/formatLocaleName';
import { CurrencyHelpers } from '../../currencyHelpers';

const IVA_DISCOUNT = 'IVA';
const LOCALE = 'es-CL';

export const numberToMoney = (amount: number): Money => ({
  type: 'centPrecision',
  currencyCode: 'CLP',
  centAmount: amount,
  fractionDigits: 0,
});

export const ctLineItemToLineItem = (item: LineItem) => {
  const attributes = !Array.isArray(item.variant) ? item.variant.attributes : [];
  const images: Image[] = !Array.isArray(item.variant) ? item.variant.images : [];
  const discounts = item.lineDetails.discounts;
  const discounted = discounts?.reduce((acc: number, discount: CtDiscount) => acc + discount.amount, 0);
  const percent = Math.trunc(100 / (item.lineDetails.lineSubtotalPrice / discounted));
  const formattedDiscount = `-${percent}%`;

  return {
    id: item.id,
    brandName: attributes.find((attr) => attr.name === 'brand')?.value,
    sellUnit: formatTitleCase(attributes.find((attr) => attr.name === 'sellUnit')?.value?.label),
    description: formatTitleCase(`${item.name[LOCALE]} ${attributes.find((attr) => attr.name === 'brand')?.value} ${attributes.find((attr) => attr.name === 'netContent')?.value}` ),
    imageUrl: images[0]?.url,
    quantity: item.quantity,
    unitPrice: CurrencyHelpers.formatForCurrency(numberToMoney(item.lineDetails.unitPrice)),
    price: CurrencyHelpers.formatForCurrency(numberToMoney(item.lineDetails.lineGrossPrice)),
    discount: discounted > 0 ? formattedDiscount : undefined,
  };
};

export const ctCartToCart = (cart: Cart) => {
  const discounts: CtDiscount[] = cart.totalDetails?.discounts || [];
  const totalDiscount = discounts?.reduce((acc: number, discount: CtDiscount) => acc + discount.amount, 0);
  const ivaDiscounts: CtTax[] =
    cart.totalDetails?.taxes?.filter((tax: CtTax) => tax.description === IVA_DISCOUNT) || [];
  const totalIva = ivaDiscounts.reduce((acc: number, tax: CtTax) => tax.amount + acc, 0);

  const items = cart.lineItems?.map((item: LineItem) => ctLineItemToLineItem(item));

  return {
    subtotal: CurrencyHelpers.formatForCurrency(numberToMoney(cart.totalDetails?.subtotalPrice || 0)),
    totalPrice: CurrencyHelpers.formatForCurrency(numberToMoney(cart.totalDetails?.grossPrice || 0)),
    discountTotal: CurrencyHelpers.formatForCurrency(numberToMoney(totalDiscount || 0)),
    ivaTotal: CurrencyHelpers.formatForCurrency(numberToMoney(totalIva || 0)),
    lineItems: items,
  };
};
