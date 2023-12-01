import { ProductProjection } from '@commercetools/platform-sdk';

export const convertProduct = (product: ProductProjection, channelId) => {
  const channelAvailability = product.masterVariant.availability?.channels?.[channelId];
  const isOnStock = channelAvailability ? channelAvailability.isOnStock : false;
  const availableQuantity = channelAvailability?.availableQuantity;
  return {
    ...product,
    masterVariant: {
      ...product.masterVariant,
      availability: {
        isOnStock,
        availableQuantity
      }
    }
  };
};
