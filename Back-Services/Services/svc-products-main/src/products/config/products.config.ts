import { registerAs } from '@nestjs/config';

export default registerAs('products', () => ({
  priceCurrency: process.env.CLP_CURRENCY ?? 'CLP',
  priceCountry: process.env.COUNTRY_CL ?? 'CL',
  defaultSupplyChannel: process.env.DEFAULT_SUPPLY_CHANNEL ?? '1800',
  fuzzyThresholdLength: process.env.FUZZY_THRESHOLD_LENGTH ?? 5,
  byCategorySlugCacheTTL: process.env.PRODUCTS_BY_CATEGORY_SLUG_CACHE_TTL ?? 7200000 // 2 hours in milliseconds
}));
