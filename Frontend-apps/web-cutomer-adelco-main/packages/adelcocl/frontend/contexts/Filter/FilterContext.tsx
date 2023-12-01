import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { FacetFilter } from '@Types/adelco/facet';
import { ActiveFilters } from 'am-ts-components/dist/src/uikit/navigation/FilterDropdownMenu/types';
import {
  BRAND,
  CATEGORIES,
  getFiltersFromFacets,
  getQueryParamsWithouFacets,
  mapCategories,
  unwrapFromArray,
} from '../../components/adelco/plp/utils';
import { FilterContextType } from './types';
import { getActiveFilters } from './utils';

const filterTitle = 'Filtrar productos';

const filterContext = createContext<FilterContextType>({
  activeFilters: [],
  filterList: {
    title: filterTitle,
    filters: [],
  },
  showFilter: false,
  handleApply: () => {
    return undefined;
  },
  clearFilters: () => {
    return undefined;
  },
  openFilters: () => {
    return undefined;
  },
  closeFilters: () => {
    return undefined;
  },
  removeActiveFilter: () => {
    return undefined;
  },
  handleActiveFiltersChange: () => {
    return undefined;
  },
  handleFilterClick: () => {
    return [];
  },
});

const FilterContext = ({ children, facets, categoryList }) => {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const closeFilters = () => setShowFilter(false);
  const openFilters = () => setShowFilter(true);
  const categoryMap = useMemo(() => mapCategories(categoryList), [categoryList]);

  const { [BRAND]: brands = '', [CATEGORIES]: categories = '' } = router.query;

  const filters: FacetFilter = useMemo(() => {
    return {
      [CATEGORIES]: unwrapFromArray(categories),
      [BRAND]: unwrapFromArray(brands),
    } as FacetFilter;
  }, [brands, categories]);

  const productTypes = categoryMap[2];
  const [filterList, setFilterList] = useState({
    title: filterTitle,
    filters: getFiltersFromFacets(facets, filters, productTypes),
  });

  useEffect(() => {
    setActiveFilters(getActiveFilters(filterList));
  }, []);

  useEffect(() => {
    setFilterList({
      title: filterTitle,
      filters: getFiltersFromFacets(facets, filters, productTypes),
    });
  }, [facets, filters]);

  const handleActiveFiltersChange = (filters: ActiveFilters[]) => {
    setActiveFilters(filters);
  };

  const handleFilterClick = (filter: string, option: string, value: boolean): ActiveFilters[] => {
    const newFilterList = {
      ...filterList,
      filters: filterList.filters.map((filterItem) => {
        if (filterItem.slug === filter) {
          return {
            ...filterItem,
            options: filterItem.options.map((optionItem) => {
              if (optionItem.slug === option) {
                return { ...optionItem, active: value };
              }
              return optionItem;
            }),
          };
        }
        return filterItem;
      }),
    };
    setFilterList(newFilterList);

    return getActiveFilters(newFilterList);
  };

  const handleApply = (newFilters: ActiveFilters[]) => {
    const { path, ...params } = getQueryParamsWithouFacets(router.query);

    const filters = {};
    newFilters.forEach((filter) => {
      if (filters[filter.filterSlug]) {
        filters[filter.filterSlug] += `,"${filter.optionSlug}"`;
      } else {
        filters[filter.filterSlug] = `"${filter.optionSlug}"`;
      }
    });

    closeFilters();

    handleActiveFiltersChange(newFilters);
    router.replace({
      pathname: Array.isArray(path) ? path.join('/') : path,
      query: { ...params, ...filters },
    });
  };

  const clearFilters = () => {
    const { path, ...params } = getQueryParamsWithouFacets(router.query);

    setActiveFilters([]);
    closeFilters();

    router.replace({
      pathname: Array.isArray(path) ? path.join('/') : path,
      query: params,
    });
  };

  const removeActiveFilter = (filter: string, option: string): void => {
    const newFilterList = handleFilterClick(filter, option, false);
    handleApply(newFilterList);
  };

  return (
    <filterContext.Provider
      value={{
        activeFilters,
        handleActiveFiltersChange,
        showFilter,
        openFilters,
        closeFilters,
        handleFilterClick,
        handleApply,
        clearFilters,
        filterList,
        removeActiveFilter,
      }}
    >
      {children}
    </filterContext.Provider>
  );
};

export const useFilterContext = () => useContext(filterContext);

export default FilterContext;
