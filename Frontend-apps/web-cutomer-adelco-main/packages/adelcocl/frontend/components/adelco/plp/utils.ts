import { CtCategory } from '@Types/adelco/category';
import { Facet, FacetFilter, FacetType } from '@Types/adelco/facet';
import { formatCapitalizeText } from '../../../helpers/utils/formatLocaleName';

export const BRAND: FacetType = 'variants.attributes.brand';
export const CATEGORIES: FacetType = 'variants.categories.id';

export const getQueryParamsWithouFacets = (queryParams) => {
  const { locale, [BRAND]: brand, [CATEGORIES]: categories, ...params } = queryParams;

  return params;
};

const facetTypes: FacetFilter = {
  [CATEGORIES]: 'Tipo de producto',
  [BRAND]: 'Marca',
};

export const unwrapFromArray = (value: string | string[]): string => {
  if (Array.isArray(value)) {
    return value.join('","');
  }
  return value;
};

export const getFiltersFromFacets = (facets: Facet, filters: FacetFilter, categoryMap: { [key: string]: string }) => {
  if (facets === undefined)
    return [
      {
        title: '',
        slug: '',
        options: [],
      },
    ];

  return Object.keys(facetTypes).map((key) => {
    return {
      slug: key,
      title: facetTypes[key],
      options:
        facets[key]?.terms
          .map((term) => {
            if (categoryMap[term.term] === undefined && key === CATEGORIES) return null;

            return {
              title: formatCapitalizeText(categoryMap[term.term] || term.term),
              slug: term.term,
              count: term.count,
              active: filters[key].includes(`"${term.term}"`),
            };
          })
          .filter(Boolean) || [],
    };
  });
};

interface CategoryMap {
  [key: string]: string;
}
export const mapCategories = (categories: CtCategory, deepLevel = 0): CategoryMap[] => {
  let categoryMap: CategoryMap[] = [{}, {}, {}];

  if (!categories?.children) return categoryMap;

  categories.children.forEach((category) => {
    categoryMap[deepLevel][category.id] = category.name['es-CL'];

    const nextDeepLevel = deepLevel + 1;
    const childrens = mapCategories(category, nextDeepLevel);

    categoryMap = categoryMap.map((cat, i) => ({ ...cat, ...childrens[i] }));
  });

  return categoryMap;
};
