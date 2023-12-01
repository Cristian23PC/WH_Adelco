import { Facet, FacetFilter } from '@Types/adelco/facet';
import {
  BRAND,
  CATEGORIES,
  getFiltersFromFacets,
  getQueryParamsWithouFacets,
  mapCategories,
  unwrapFromArray,
} from './utils';

describe('utils', () => {
  describe('getQueryParamsWithoutFacets', () => {
    it('should return query params without facets', () => {
      const mockInputParams = {
        locale: 'es-CL',
        'variants.attributes.brand': 'Tucapel',
        'variants.categories.id': 'C101',
        'text.es-CL': 'Arroz',
      };

      const expectedOutputParams = {
        'text.es-CL': 'Arroz',
      };

      expect(getQueryParamsWithouFacets(mockInputParams)).toEqual(expectedOutputParams);
    });
  });

  describe('getFiltersFromFacets', () => {
    const mockFacets: Facet = {
      'variants.attributes.brand': {
        terms: [
          {
            term: 'Tucapel',
            count: 1,
          },
          {
            term: 'Miraflores',
            count: 2,
          },
          {
            term: 'Arroz',
            count: 2,
          },
        ],
        total: 5,
      },
      'variants.categories.id': {
        terms: [
          {
            term: 'C101',
            count: 1,
          },
          {
            term: 'C102',
            count: 2,
          },
        ],
        total: 3,
      },
    };

    const mockFilters = {
      [BRAND]: '"Tucapel","Miraflores"',
      [CATEGORIES]: '"C101"',
    } as FacetFilter;

    const mockCategoryMap = {
      C101: 'Category 101',
    };

    it('Should return empty filters if facets is undefined', () => {
      expect(getFiltersFromFacets(undefined, mockFilters, mockCategoryMap)).toEqual([
        {
          title: '',
          slug: '',
          options: [],
        },
      ]);
    });

    it('should return filters from facets', () => {
      const expectedOutput = [
        {
          slug: 'variants.categories.id',
          title: 'Tipo de producto',
          options: [
            {
              title: 'Category 101',
              slug: 'C101',
              count: 1,
              active: true,
            },
          ],
        },
        {
          slug: 'variants.attributes.brand',
          title: 'Marca',
          options: [
            {
              title: 'Tucapel',
              slug: 'Tucapel',
              count: 1,
              active: true,
            },
            {
              title: 'Miraflores',
              slug: 'Miraflores',
              count: 2,
              active: true,
            },
            {
              title: 'Arroz',
              slug: 'Arroz',
              count: 2,
              active: false,
            },
          ],
        },
      ];

      expect(getFiltersFromFacets(mockFacets, mockFilters, mockCategoryMap)).toEqual(expectedOutput);
    });
  });

  describe('unwrapFromArray', () => {
    it('should return string if value is string', () => {
      expect(unwrapFromArray('test')).toEqual('test');
    });

    it('should return string if value is array', () => {
      expect(unwrapFromArray(['test', 'test2'])).toEqual('test","test2');
    });
  });

  describe('mapCategories', () => {
    const generateCategory = (id: string, name: string) => ({
      id,
      name: {
        'es-CL': name,
      },
      slug: {
        'es-CL': name,
      },
      children: [],
    });

    const mockCategories = {
      ...generateCategory('C000', 'Category 000'),
      children: [
        {
          ...generateCategory('C101', 'Category 101'),
          children: [
            {
              ...generateCategory('C202', 'Category 202'),
              children: [
                generateCategory('C303', 'Category 303'),
                generateCategory('C304', 'Category 304'),
                generateCategory('C305', 'Category 305'),
              ],
            },
          ],
        },
      ],
    };

    const expectedOutput = [
      {
        C101: 'Category 101',
      },
      {
        C202: 'Category 202',
      },
      {
        C303: 'Category 303',
        C304: 'Category 304',
        C305: 'Category 305',
      },
    ];

    expect(mapCategories(mockCategories)).toEqual(expectedOutput);
  });
});
