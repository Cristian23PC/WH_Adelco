import { FacetType } from '@Types/adelco/facet';

export const BRAND: FacetType = 'variants.attributes.brand';
export const CATEGORIES: FacetType = 'variants.categories.id';
export const UNDERSCORE_BRAND = BRAND.replace(/\./g, '_');
export const UNDERSCORE_CATEGORIES = CATEGORIES.replace(/\./g, '_');
export const UNDERSCORE_FACETS = [UNDERSCORE_BRAND, UNDERSCORE_CATEGORIES];
export const FACETS: FacetType[] = [BRAND, CATEGORIES];
export const FACET_DICCIONARY = {
  [UNDERSCORE_BRAND]: BRAND,
  [UNDERSCORE_CATEGORIES]: CATEGORIES,
};

export const getQueryParamsWithouFacets = (queryParams: any) => {
  const { [UNDERSCORE_BRAND]: brand, [UNDERSCORE_CATEGORIES]: categories, ...rest } = queryParams;
  return rest;
};

export const getFacetFilters = (queryParams: any) => {
  return UNDERSCORE_FACETS.map((key) => {
    if (queryParams[key]) {
      return `${FACET_DICCIONARY[key]}:${queryParams[key]}`;
    }
    return '';
  }).filter(Boolean);
};
