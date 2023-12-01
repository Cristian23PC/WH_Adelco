import { registerAs } from '@nestjs/config';

export default registerAs('products', () => ({
  priceCurrency: process.env.CLP_CURRENCY ?? 'CLP',
  priceCountry: process.env.COUNTRY_CL ?? 'CL'
}));
