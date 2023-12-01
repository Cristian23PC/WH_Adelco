import { convertProduct } from '.';

jest.mock('@adelco/price-calc', () => ({
  ctCalculatePrice: () => ({
    masterVariant: {
      price: undefined,
      calculatedPrice: 'price'
    },
    variants: [
      {
        price: undefined,
        calculatedPrice: 'price'
      }
    ]
  })
}));

const productMock = {
  masterVariant: {
    price: {
      id: '9fb43d7b-3dc6-4efb-8834-de59d90066b2'
    }
  },
  taxCategory: {
    typeId: 'tax-category'
  },
  variants: []
};

const t2zoneValueMock = {
  t2Rate: '1.25'
};

describe('Convert Product', () => {
  let convertedProduct;

  describe('Convert Product with price and without t2zone', () => {
    const expectedConvertedProductResponse = {
      masterVariant: {
        price: undefined
      },
      variants: [],
      taxCategory: undefined
    };

    beforeEach(() => {
      convertedProduct = convertProduct(productMock);
    });

    it('Should return correct coverted product', () => {
      expect(convertedProduct).toEqual(expectedConvertedProductResponse);
    });
  });

  describe('Convert Product with price and t2zone', () => {
    const expectedConvertedProductResponse = {
      masterVariant: {
        price: undefined,
        calculatedPrice: 'price'
      },
      variants: [
        {
          calculatedPrice: 'price',
          price: undefined
        }
      ],
      taxCategory: undefined
    };

    beforeEach(() => {
      convertedProduct = convertProduct(productMock, t2zoneValueMock);
    });

    it('Should return correct coverted product', () => {
      expect(convertedProduct).toEqual(expectedConvertedProductResponse);
    });
  });

  describe('Convert Product without price and t2zone', () => {
    const expectedConvertedProductResponse = {
      masterVariant: {
        price: undefined
      },
      variants: [],
      taxCategory: undefined
    };

    beforeEach(() => {
      convertedProduct = convertProduct({
        ...productMock,
        masterVariant: {}
      });
    });

    it('Should return correct coverted product', () => {
      expect(convertedProduct).toEqual(expectedConvertedProductResponse);
    });
  });
});
