import { OrderContactRequestDto } from '@/carts/dto/orderContactRequest';
import { AdelcoCart, AdelcoLineItem } from '@adelco/price-calc';
import { Attribute } from '@commercetools/platform-sdk';

const formatPrice = (price: number) => {
  return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
};

const getAttribute = (attributes: Attribute[], name: string): Attribute => attributes.find(attr => attr.name === name);

const buildName = (name?: string, lastName?: string): string => {
  let userFullName = 'n/a';

  if (name && lastName) {
    userFullName = `${name} ${lastName}`;
  } else if (name) {
    userFullName = `${name}`;
  } else if (lastName) {
    userFullName = `${lastName}`;
  }

  return userFullName;
};

const buildCartLineItems = (lineItems: AdelcoLineItem[]) => {
  return lineItems.map(lineItem => ({
    image: lineItem.variant?.images[0]?.url,
    productName: `${lineItem.name['es-CL']} ${getAttribute(lineItem.variant.attributes, 'brand')?.value} ${
      getAttribute(lineItem.variant.attributes, 'operationalUnitWeight')?.value
    } ${getAttribute(lineItem.variant.attributes, 'operationalUnitWeightUnit')?.value}`,
    sku: lineItem.variant?.sku,
    unitPrice: `${formatPrice(lineItem.lineDetails.unitPrice)}/${getAttribute(lineItem.variant.attributes, 'sellUnit')?.value.label}`,
    totalPrice: formatPrice(lineItem.lineDetails.lineGrossPrice),
    quantity: `${lineItem.quantity}/${getAttribute(lineItem.variant.attributes, 'sellUnit')?.value.label}`
  }));
};

export const buildTemplateData = (cart: AdelcoCart, orderContactRequest: OrderContactRequestDto, buKey: string) => {
  const date = new Date().toLocaleString('es-CL', {
    timeZone: 'America/Santiago'
  });
  const [datePart, timePart] = date.split(', ');
  const [day, month, year] = datePart.split('-');
  const yyyymmdd = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return {
    cartId: cart.id,
    requestDate: yyyymmdd,
    requestTime: timePart,
    client: {
      name: buildName(orderContactRequest?.firstName, orderContactRequest?.lastName),
      email: orderContactRequest.username,
      phone: orderContactRequest?.phone ?? 'n/a',
      rut: orderContactRequest.rut,
      buKey,
      region: orderContactRequest.address.region,
      commune: orderContactRequest.address.commune,
      streetName: orderContactRequest.address.streetName,
      streetNumber: orderContactRequest.address?.streetNumber ?? 'n/a'
    },
    billingAddress: {
      region: orderContactRequest.billingAddress.region,
      commune: orderContactRequest.billingAddress.commune,
      streetName: orderContactRequest.billingAddress.streetName,
      streetNumber: orderContactRequest.billingAddress?.streetNumber ?? 'n/a'
    },
    items: buildCartLineItems(cart.lineItems),
    subTotal: formatPrice(cart.totalDetails.subtotalPrice),
    discounts: formatPrice(cart.totalDetails.discounts.reduce((acc, discount) => acc + discount.amount, 0)),
    taxes: formatPrice(cart.totalDetails.taxes.reduce((acc, tax) => acc + tax.amount, 0)),
    totalAmount: formatPrice(cart.totalDetails.grossPrice)
  };
};
