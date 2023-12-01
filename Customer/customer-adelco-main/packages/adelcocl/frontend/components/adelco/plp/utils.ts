import { CtCategory } from '@Types/adelco/category';
import { Facet, FacetFilter, FacetType } from '@Types/adelco/facet';
import { formatCapitalizeText } from '../../../helpers/utils/formatLocaleName';

export const BRAND: FacetType = 'variants.attributes.brand';
export const CATEGORIES: FacetType = 'variants.categories.id';
export const STOCK: FacetType = 'masterVariant.availability.isOnStock';

export const getQueryParamsWithoutFacets = (queryParams) => {
  const {
    locale,
    [BRAND]: brand,
    [CATEGORIES]: categories,
    [STOCK]: stock,
    ...params
  } = queryParams;

  return params;
};

const facetTypes: FacetFilter = {
  [CATEGORIES]: 'Tipo de producto',
  [BRAND]: 'Marca'
};

export const unwrapFromArray = (value: string | string[]): string => {
  if (Array.isArray(value)) {
    return value.join('","');
  }
  return value;
};

export const getFiltersFromFacets = (
  facets: Facet,
  filters: FacetFilter,
  categoryMap: { [key: string]: { name: string; slug: string } }
) => {
  if (facets === undefined)
    return [
      {
        title: '',
        slug: '',
        options: []
      }
    ];

  return Object.keys(facetTypes).map((key) => {
    return {
      slug: key,
      title: facetTypes[key],
      options:
        facets[key]?.terms
          .map((term) => {
            if (
              categoryMap[term.term]?.name === undefined &&
              key === CATEGORIES
            )
              return null;

            return {
              title: formatCapitalizeText(
                categoryMap[term.term]?.name || term.term
              ),
              slug:
                key === CATEGORIES ? categoryMap[term.term].slug : term.term,
              count: term.count,
              active: filters[key].includes(`"${term.term}"`)
            };
          })
          .filter(Boolean) || []
    };
  });
};

interface CategoryMap {
  [key: string]: {
    name: string;
    slug: string;
  };
}
export const mapCategories = (
  categories: CtCategory,
  deepLevel = 0
): CategoryMap[] => {
  let categoryMap: CategoryMap[] = [{}, {}, {}];

  if (!categories?.children) return categoryMap;

  categories.children.forEach((category) => {
    categoryMap[deepLevel][category.id] = {
      name: category.name['es-CL'],
      slug: category.slug['es-CL']
    };

    const nextDeepLevel = deepLevel + 1;
    const children = mapCategories(category, nextDeepLevel);

    categoryMap = categoryMap.map((cat, i) => ({
      ...cat,
      ...children[i]
    }));
  });

  return categoryMap;
};
