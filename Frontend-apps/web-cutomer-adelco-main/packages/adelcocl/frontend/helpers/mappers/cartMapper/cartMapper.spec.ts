import cartMock from '../../../../backend/adelco/mocks/cart';
import { ctCartToCart, ctLineItemToLineItem } from './cartMapper';

describe('cart mapper', () => {
  it('should map cart properties to use on ui kit cart component', () => {
    const cart = ctCartToCart(cartMock);
    expect(cart.subtotal).toBe('$597.186');
    expect(cart.totalPrice).toBe('$710.651');
    expect(cart.discountTotal).toBe('$0');
    expect(cart.ivaTotal).toBe('$113.465');
  });

  it('should map the line items for the cartItemCard', () => {
    const lineItemCard = ctLineItemToLineItem(cartMock.lineItems[1]);
    expect(lineItemCard).toEqual({
      id: cartMock.lineItems[1].id,
      brandName: 'SURCO',
      description: 'Esencia vainilla',
      imageUrl: cartMock.lineItems[1].variant.images[0].url,
      quantity: cartMock.lineItems[1].quantity,
      unitPrice: '$793',
      price: '$16.643',
      discount: undefined,
    });
  });

  it('should include discounts', () => {
    const lineItem = {
      ...cartMock.lineItems[1],
      lineDetails: {
        ...cartMock.lineItems[1].lineDetails,
        discounts: [
          {
            description: 'discount',
            amount: 4900,
          },
        ],
      },
    };
    const lineItemCard = ctLineItemToLineItem(lineItem);
    expect(lineItemCard.discount).toEqual('-35%');
  });

  it('should take into account when there is no variant', () => {
    const lineItem = {
      ...cartMock.lineItems[0],
      variant: [],
    };
    const lineItemCard = ctLineItemToLineItem(lineItem);
    expect(lineItemCard.brandName).toBe(undefined);
    expect(lineItemCard.imageUrl).toBe(undefined);
  });
});
