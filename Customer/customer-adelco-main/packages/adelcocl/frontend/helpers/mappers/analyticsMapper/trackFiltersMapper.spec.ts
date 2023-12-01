import { getTrackActiveFiltersInfo } from './trackFiltersMapper';
import { BRAND, STOCK } from '../../../components/adelco/plp/utils';

describe('getTrackActiveFiltersInfo', () => {
  it('should generate correct filter options when filters are applied', () => {
    const activeFilters = [
      { filterSlug: STOCK, optionSlug: 'true', title: 'Stock' },
      { filterSlug: BRAND, optionSlug: 'brand1', title: 'Brand 1' },
      { filterSlug: BRAND, optionSlug: 'brand2', title: 'Brand 2' }
    ];
    const currentCategory = 'category name';

    const result = getTrackActiveFiltersInfo(activeFilters, currentCategory);

    expect(result.filterOptions).toEqual([
      {
        stock: {
          displayed: true,
          filtered: true
        },
        discounts: {
          displayed: false,
          filtered: false
        },
        brand: ['Brand 1', 'Brand 2'],
        productType: 'Category name'
      }
    ]);
  });

  it('should generate correct filter options when no filters are applied', () => {
    const activeFilters = [];
    const currentCategory = 'category name';

    const result = getTrackActiveFiltersInfo(activeFilters, currentCategory);

    expect(result.filterOptions).toEqual([
      {
        stock: {
          displayed: true,
          filtered: false
        },
        discounts: {
          displayed: false,
          filtered: false
        },
        brand: [],
        productType: 'Category name'
      }
    ]);
  });

  it('should generate correct filter options when only one filter is applied', () => {
    const activeFilters = [
      { filterSlug: STOCK, optionSlug: 'true', title: 'Stock' }
    ];

    const currentCategory = 'category name';

    const result = getTrackActiveFiltersInfo(activeFilters, currentCategory);

    expect(result.filterOptions).toEqual([
      {
        stock: {
          displayed: true,
          filtered: true
        },
        discounts: {
          displayed: false,
          filtered: false
        },
        brand: [],
        productType: 'Category name'
      }
    ]);
  });
});
