import { FacetType } from '@Types/adelco/facet';

export const BRAND: FacetType = 'variants.attributes.brand';
export const CATEGORIES: FacetType = 'variants.categories.id';
export const STOCK: FacetType = 'masterVariant.availability.isOnStock';
export const UNDERSCORE_BRAND = BRAND.replace(/\./g, '_');
export const UNDERSCORE_CATEGORIES = CATEGORIES.replace(/\./g, '_');
export const UNDERSCORE_STOCK = STOCK.replace(/\./g, '_');
export const UNDERSCORE_FACETS_USE_COLON = [
  UNDERSCORE_BRAND,
  UNDERSCORE_CATEGORIES
];
export const UNDERSCORE_FACETS_USE_EQUAL = [UNDERSCORE_STOCK];
export const FACETS: FacetType[] = [BRAND, CATEGORIES];
export const FACET_DICTIONARY = {
  [UNDERSCORE_BRAND]: BRAND,
  [UNDERSCORE_CATEGORIES]: CATEGORIES,
  [UNDERSCORE_STOCK]: STOCK
};

export const getQueryParamsWithoutFacets = (queryParams: any) => {
  const {
    [UNDERSCORE_BRAND]: brand,
    [UNDERSCORE_CATEGORIES]: categories,
    [UNDERSCORE_STOCK]: stock,
    ...rest
  } = queryParams;
  return rest;
};

const formatFacet = (queryParams: any, key: string, symbol = ':') => {
  if (queryParams[key]) {
    return `${FACET_DICTIONARY[key]}${symbol}${queryParams[key]}`;
  }
  return '';
};

export const getFacetFilters = (queryParams: any) => {
  const facetsWithColon = UNDERSCORE_FACETS_USE_COLON.map((key) =>
    formatFacet(queryParams, key)
  );

  const facetsWithEqual = UNDERSCORE_FACETS_USE_EQUAL.map((key) =>
    formatFacet(queryParams, key, '=')
  );

  return [
    ...facetsWithColon,
    ...facetsWithEqual,
    'variants.attributes.price:exists'
  ].filter(Boolean);
};
