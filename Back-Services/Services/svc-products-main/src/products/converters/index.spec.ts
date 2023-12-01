import productWithStock from './fixtures/product-with-stock.json';
import productNotStock from './fixtures/product-not-stock.json';
import productAvailabilityUndefined from './fixtures/product-availability-undefined.json';

import { convertProduct } from './index';

describe('convertProduct function', () => {
  let product;

  it('returns the expected object with isOnStock set to true', () => {
    product = productWithStock;
    const convertedProduct = convertProduct(product, '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1');
    expect(convertedProduct).toEqual({
      ...product,
      masterVariant: {
        ...product.masterVariant,
        availability: {
          isOnStock: true,
          availableQuantity: 10
        }
      }
    });
  });

  it('returns the expected object with isOnStock set to false', () => {
    product = productNotStock;
    const convertedProduct = convertProduct(product, '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1');
    expect(convertedProduct).toEqual({
      ...product,
      masterVariant: {
        ...product.masterVariant,
        availability: {
          isOnStock: false,
          availableQuantity: 0
        }
      }
    });
  });

  it('returns the expected object with isOnStock set to false when availability is undefined', () => {
    product = productAvailabilityUndefined;
    const convertedProduct = convertProduct(product, '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b1');
    expect(convertedProduct).toEqual({
      ...product,
      masterVariant: {
        ...product.masterVariant,
        availability: {
          isOnStock: false
        }
      }
    });
  });
});
