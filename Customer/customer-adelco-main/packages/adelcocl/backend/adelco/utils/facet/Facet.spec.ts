import { getFacetFilters, getQueryParamsWithoutFacets } from './Facet';

describe('Facet', () => {
  it('getQueryParamsWithoutFacets', () => {
    const mockQueryParams = {
      variants_attributes_brand: 'Tucapel',
      variants_categories_id: 'CL-1',
      masterVariant_availability_isOnStock: 'true',
      'text_es-CL': 'Arroz'
    };

    const expected = {
      'text_es-CL': 'Arroz'
    };

    expect(getQueryParamsWithoutFacets(mockQueryParams)).toEqual(expected);
  });

  it('getFacetFilters', () => {
    const mockQueryParams = {
      variants_attributes_brand: 'Tucapel',
      variants_categories_id: 'CL-1',
      masterVariant_availability_isOnStock: 'true',
      'text_es-CL': 'Arroz'
    };

    const expected = [
      'variants.attributes.brand:Tucapel',
      'variants.categories.id:CL-1',
      'masterVariant.availability.isOnStock=true',
      'variants.attributes.price:exists'
    ];

    expect(getFacetFilters(mockQueryParams)).toEqual(expected);
  });
});
