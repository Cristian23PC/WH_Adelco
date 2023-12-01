import { userHeaderId } from '@/common/constants/headers';
import { registerAs } from '@nestjs/config';

export default registerAs('orders', () => ({
  userHeaderId: process.env.CUSTOMER_HEADER_ID ?? userHeaderId
}));
