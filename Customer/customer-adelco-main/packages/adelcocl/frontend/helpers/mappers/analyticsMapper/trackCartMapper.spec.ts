import {
  getTrackAddCartItemData,
  getTrackCardData,
  GetTrackAddCartItemDataProductParam,
  GetTrackAddCartItemReturnData,
  CartReturnType
} from './trackCartMapper';

const cart: CartReturnType = {
  totalLineItemQuantity: 2,
  subtotal: '$200',
  discountTotal: '$20',
  totalPrice: '$180',
  totalTaxesAmount: '$10',
  discountsQuantity: 1,
  ivaTotal: '$10',
  lineItems: [
    {
      id: '123',
      brandName: 'Test Brand',
      name: 'Test Product',
      imageUrl: 'https://test.com/image.jpg',
      quantity: 1,
      unitPrice: '$100',
      price: '$100',
      sellUnit: 'Test Sell Unit',
      totalTaxesAmount: '$10',
      discount: '$10'
    }
  ],
  taxes: [
    {
      description: 'IVA',
      amount: '$10'
    }
  ],
  cartUpdates: {
    isPriceUpdated: false,
    isQuantityUpdated: false
  }
};

const user = {
  loggedIn: true,
  zoneLabel: 'Test Commune, Test Region',
  businessUnitId: '123',
  dch: 'Test DCH',
  t2z: 'Test Location'
};

describe('getTrackAddCartItemData', () => {
  it('should generate correct data', () => {
    const product: GetTrackAddCartItemDataProductParam = {
      id: '123',
      description: 'Test Product',
      imageUrl: 'https://test.com/image.jpg',
      price: '$100',
      sellUnit: 'Test Sell Unit',
      unitPrice: '$100',
      unitSize: 'Test Unit Size',
      outOfStock: false,
      packUnits: 1,
      showPrices: true,
      slug: 'test-product',
      availableQuantity: 1,
      sku: '123',
      name: 'Test Product',
      brandName: 'Test Brand',
      category: 'Test Category',
      calculatedPrice: '100',
      discount: '$100'
    };

    const result: GetTrackAddCartItemReturnData = getTrackAddCartItemData(
      product,
      user
    );

    expect(result.productId).toBe('123');
    expect(result.productName).toBe('Test Product');
    expect(result.productBrand).toBe('Test Brand');
    expect(result.productCategory).toBe('Test Category');
    expect(result.discounts).toBe(true);
    expect(result.productPrice).toBe('100');
    expect(result.userLoggedIn).toBe(true);
    expect(result.location).toBe('Test location');
    expect(result.deliveryZone).toBe('Test Commune, Test Region');
  });
});

describe('getTrackCardData', () => {
  it('should generate correct data', () => {
    const options = {
      trackCartItems: true,
      trackFullAddressInfo: true,
      trackLoggedIn: true
    };

    const result = getTrackCardData(cart, user, options);

    expect(result.userLoggedIn).toBe(true);
    expect(result.deliveryZone).toBe('Test Commune, Test Region');
    expect(result.dch).toBe('Test DCH');
    expect(result.location).toBe('Test Location');
    expect(result.commune).toBe('Test Commune');
    expect(result.region).toBe('Test Region');
    expect(result.businessUnitId).toBe('123');
    expect(result.cartItems).toEqual([
      {
        id: '123',
        brandName: 'Test Brand',
        name: 'Test Product',
        imageUrl: 'https://test.com/image.jpg',
        quantity: 1,
        unitPrice: '$100',
        price: '$100',
        sellUnit: 'Test Sell Unit',
        totalTaxesAmount: '$10',
        discount: '$10'
      }
    ]);
    expect(result.cartTotalQuantityOfItems).toBe(2);
    expect(result.cartNetTotal).toBe('$200');
    expect(result.cartTotalDiscounts).toBe('$20');
    expect(result.cartTotalAmount).toBe('$180');
    expect(result.cartTotalTaxesAmount).toBe('$10');
    expect(result.cartDiscountsQuantity).toBe(1);
  });

  it('should generate data without cartItems, loggedIn and fullAddress', () => {
    const options = {
      trackCartItems: false,
      trackFullAddressInfo: false,
      trackLoggedIn: false
    };

    const result = getTrackCardData(cart, user, options);

    expect(result).not.toHaveProperty('cartItems');
    expect(result).not.toHaveProperty('userLoggedIn');
    expect(result).not.toHaveProperty('location');
    expect(result).not.toHaveProperty('region');
    expect(result).not.toHaveProperty('commune');
    expect(result).not.toHaveProperty('dch');
  });
});
