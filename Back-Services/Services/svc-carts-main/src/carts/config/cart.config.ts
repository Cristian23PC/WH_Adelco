import { anonymousHeaderId } from '@/common/constants/headers';
import { registerAs } from '@nestjs/config';

export default registerAs('cart', () => ({
  currency: process.env.CART_DEFAULT_CURRENCY || 'CLP',
  anonymousHeaderId: process.env.ANONYMOUS_HEADER_ID ?? anonymousHeaderId,
  csrEmail: process.env.CSR_EMAIL ?? 'contactanos@adelco.cl'
}));
