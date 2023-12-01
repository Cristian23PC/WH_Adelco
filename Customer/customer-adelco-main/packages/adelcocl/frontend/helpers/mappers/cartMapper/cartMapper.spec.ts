import cartMock from '../../../../backend/adelco/mocks/cart';
import { ctCartToCart, ctLineItemToLineItem } from './cartMapper';
import { getImageUrl } from '../../../helpers/utils/getImageUrl';

const DEFAULT_IMAGE_URL =
  'https://res.cloudinary.com/dlwdq84ig/image/upload/c_fill,f_auto,g_faces:auto,h_626,q_auto,w_626/xma9egai1uydqldyhym3';

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
      name: 'Esencia Vainilla Surco 60ml',
      imageUrl: getImageUrl(
        cartMock.lineItems[1].variant.images[0].url,
        'medium'
      ),
      quantity: cartMock.lineItems[1].quantity,
      unitPrice: '$793',
      price: '$16.643',
      sellUnit: 'Display',
      totalTaxesAmount: '$2.657',
      discount: undefined
    });
  });

  it('should include discounts', () => {
    const lineItem = {
      ...cartMock.lineItems[1],
      lineDetails: {
        ...cartMock.lineItems[1].lineDetails,
        discountRate: 35,
        discounts: [
          {
            description: 'discount',
            amount: 4900
          }
        ]
      }
    };
    const lineItemCard = ctLineItemToLineItem(lineItem);
    expect(lineItemCard.discount).toEqual('-35%');
  });

  it('should take into account when there is no variant', () => {
    const lineItem = {
      ...cartMock.lineItems[0],
      variant: []
    };
    const lineItemCard = ctLineItemToLineItem(lineItem);
    expect(lineItemCard.brandName).toBe(undefined);
    expect(lineItemCard.imageUrl).toBe(
      getImageUrl(DEFAULT_IMAGE_URL, 'medium')
    );
  });
});
