import { CtProduct } from '@Types/adelco/product';
import { ctProductToProduct } from './productMapper';

const ctProduct: CtProduct = {
  id: '123',
  name: {
    'es-CL': 'Name'
  },
  description: {
    'es-CL': 'Description'
  },
  masterVariant: {
    attributes: [
      { name: 'brand', value: 'TestBrand' },
      { name: 'netContent', value: '500g' },
      { name: 'operationalUnitPerBox', value: '12' },
      { name: 'sellUnit', value: { label: 'CAJAS' } }
    ],
    images: [{ url: 'https://example.com/image.png' }],
    calculatedPrice: {
      price: {
        centAmount: 1000,
        currencyCode: 'CLP',
        fractionDigits: 0,
        type: 'centPrecision'
      },
      discountedPrice: {
        centAmount: 800,
        currencyCode: 'CLP',
        fractionDigits: 0,
        type: 'centPrecision'
      },
      unitPrice: {
        centAmount: 200,
        currencyCode: 'CLP',
        fractionDigits: 0,
        type: 'centPrecision'
      },
      unitDiscountedPrice: {
        centAmount: 160,
        currencyCode: 'CLP',
        fractionDigits: 0,
        type: 'centPrecision'
      },
      discountRate: 20
    },
    sku: 'sku-123'
  },
  slug: {
    'es-CL': 'slug'
  }
};

describe('ctProductToProduct', () => {
  it('should convert a ctProduct to a Product', () => {
    const product = ctProductToProduct(ctProduct, true);

    expect(product).toEqual({
      id: '123',
      availableQuantity: undefined,
      brandName: 'Testbrand',
      calculatedPrice: '$800',
      name: 'Name',
      description: 'Description',
      imageUrl: 'https://example.com/image-medium.png',
      discount: '-20%',
      price: '$1.000',
      quantity: undefined,
      sellUnit: 'cajas',
      unitPrice: '$160',
      unitSize: '500g',
      packUnits: '12',
      showPrices: true,
      outOfStock: true,
      sku: 'sku-123',
      slug: 'slug'
    });
  });

  it('should handle ctProducts without a calculatedPrice', () => {
    const productWithoutPrice = {
      ...ctProduct,
      masterVariant: {
        ...ctProduct.masterVariant,
        calculatedPrice: undefined
      }
    };
    const product = ctProductToProduct(productWithoutPrice, true);

    expect(product).toEqual({
      id: '123',
      brandName: 'Testbrand',
      name: 'Name',
      availableQuantity: undefined,
      description: 'Description',
      imageUrl: 'https://example.com/image-medium.png',
      price: undefined,
      calculatedPrice: undefined,
      unitPrice: undefined,
      quantity: undefined,
      sellUnit: 'cajas',
      unitSize: '500g',
      packUnits: '12',
      showPrices: true,
      outOfStock: true,
      slug: 'slug',
      sku: 'sku-123'
    });
  });
});
