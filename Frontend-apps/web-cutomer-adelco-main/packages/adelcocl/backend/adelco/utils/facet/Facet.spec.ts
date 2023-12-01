import { getFacetFilters, getQueryParamsWithouFacets } from './Facet';

describe('Facet', () => {
  it('getQueryParamsWithouFacets', () => {
    const mockQueryParams = {
      variants_attributes_brand: 'Tucapel',
      variants_categories_id: 'CL-1',
      'text_es-CL': 'Arroz',
    };

    const expected = {
      'text_es-CL': 'Arroz',
    };

    expect(getQueryParamsWithouFacets(mockQueryParams)).toEqual(expected);
  });

  it('getFacetFilters', () => {
    const mockQueryParams = {
      variants_attributes_brand: 'Tucapel',
      variants_categories_id: 'CL-1',
      'text_es-CL': 'Arroz',
    };

    const expected = ['variants.attributes.brand:Tucapel', 'variants.categories.id:CL-1'];

    expect(getFacetFilters(mockQueryParams)).toEqual(expected);
  });
});
