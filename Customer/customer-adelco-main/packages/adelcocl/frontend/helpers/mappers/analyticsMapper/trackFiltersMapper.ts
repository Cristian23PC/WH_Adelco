import { BRAND, STOCK } from '../../../components/adelco/plp/utils';
import { ActiveFilter } from '../../../contexts/Filter/types';
import { formatCapitalizeText } from '../../../helpers/utils/formatLocaleName';

export const getTrackActiveFiltersInfo = (
  activeFilters: ActiveFilter[],
  currentCategory: string
) => {
  const stockFilter = activeFilters.find(
    ({ filterSlug }) => filterSlug === STOCK
  );

  const brandFilter = activeFilters.filter(
    ({ filterSlug }) => filterSlug === BRAND
  );

  const categoryFilter = formatCapitalizeText(currentCategory || '');

  return {
    filterOptions: [
      {
        stock: {
          displayed: true,
          filtered: stockFilter?.optionSlug === 'true'
        },
        discounts: {
          displayed: false, // TODO: Change this when we have discounts filter
          filtered: false
        },
        brand: brandFilter.map(({ title }) => title),
        productType: categoryFilter
      }
    ]
  };
};
