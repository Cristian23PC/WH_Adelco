import { getTrackPurchaseData } from './trackCheckoutMapper';

describe('getTrackPurchaseData', () => {
  const cart = {
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
    zoneLabel: 'Test Zone',
    businessUnitId: '123',
    dch: 'Test DCH',
    t2z: 'Test Location'
  };

  const order = {
    orderNumber: 'ORD123'
  };

  const paymentMethod = 'Credit Card';
  const deliveryDate = '2023-10-20';
  const couponCode = 'DISCOUNT123';

  const purchaseData = {
    user,
    cart,
    order,
    paymentMethod,
    deliveryDate,
    couponCode
  };

  it('should return the correct data when no error is provided', () => {
    const result = getTrackPurchaseData(purchaseData);

    expect(result.orderId).toBe(order.orderNumber);
    expect(result.businessUnitId).toBe(user.businessUnitId);
    expect(result.deliveryZone).toBe(user.zoneLabel);
    expect(result.cartItems).toEqual(cart.lineItems);
    expect(result.cartTotalAmount).toBe('$180');
    expect(result.cartTotalTaxesAmount).toBe('$10');
    expect(result.shippingDate).toBe(deliveryDate);
    expect(result.paymentMethod).toBe(paymentMethod);
    expect(result.coupons).toBe(couponCode);
  });

  it('should return an error when an error is provided', () => {
    const error = 'Some error message';

    const result = getTrackPurchaseData(purchaseData, error);

    expect(result.error).toBe(error);
    expect(result.orderId).toBeUndefined();
    expect(result.businessUnitId).toBeUndefined();
    expect(result.deliveryZone).toBeUndefined();
    expect(result.cartItems).toBeUndefined();
  });
});
