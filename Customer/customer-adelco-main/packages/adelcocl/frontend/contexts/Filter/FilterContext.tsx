import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FilterContextType,
  StockFilter,
  ActiveFilter,
  FilterList
} from './types';
import {
  getActiveFilters,
  getFilterList,
  getFilterListStatus,
  getRouterNewDataWithFilters
} from './utils';
import { BRAND, CATEGORIES, STOCK } from '../../components/adelco/plp/utils';
import useScreen from 'helpers/hooks/useScreen';
import useTrackFilters from 'helpers/hooks/analytics/useTrackFilters';
import { ActiveFilters } from '@adelco/web-components/dist/src/uikit/navigation/FilterDropdownMenu/types';

const filterTitle = 'Filtrar productos';

export const stockFilterDefaultValue = {
  slug: STOCK,
  title: 'Productos con stock',
  active: true
};

const filterContext = createContext<FilterContextType>({
  activeFilters: [],
  filterList: {
    title: filterTitle,
    filters: []
  },
  stockFilter: stockFilterDefaultValue,
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
  trackSelectFilter: () => {
    return undefined;
  }
});

const FilterContext = ({ children, facets, categoryList, currentCategory }) => {
  const router = useRouter();
  const { trackOpenFiltersTab, trackSelectFilters } = useTrackFilters();
  const {
    [BRAND]: brands = '',
    [CATEGORIES]: categories = '',
    [STOCK]: stock = ''
  } = router.query;

  const { isDesktop } = useScreen();
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const [filterList, setFilterList] = useState<FilterList>(
    getFilterList({ brands, categories }, facets, categoryList)
  );
  const [filterListToApply, setFilterListToApply] = useState<FilterList | null>(
    null
  ); // INFO: Used in FilterMenu in mobile/tablet

  const isStockQueryActive = (): boolean =>
    !stock || stock === 'true' || stock === '"true"';

  const [stockFilter, setStockFilter] = useState<StockFilter>({
    ...stockFilterDefaultValue,
    active: isStockQueryActive()
  });

  const [stockFilterToApply, setStockFilterToApply] =
    useState<StockFilter | null>(null); // INFO: Used in FilterMenu in mobile/tablet

  const slug = useMemo(() => {
    if (!router.query.slug) return null;

    return typeof router.query.slug === 'string'
      ? router.query.slug
      : router.query.slug.join('/');
  }, [router.query.slug]);

  const searchText = router.query['text.es-CL'] || null;

  useEffect(() => {
    setFilterList(getFilterList({ brands, categories }, facets, categoryList));
  }, [facets, brands, categories, categoryList]);

  useEffect(() => {
    if (isDesktop && showFilter) {
      closeFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, showFilter]);

  useEffect(() => {
    if (!stock || slug || searchText) {
      handleApplyFiltersFromQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, searchText, stock]);

  useEffect(() => {
    handleActiveFiltersChange(getActiveFilters(filterList, stockFilter));
  }, [filterList, stockFilter]);

  const handleTrackSelectFilters = (
    category: string = currentCategory?.name['es-CL'],
    newFilters: ActiveFilters[] = activeFilters
  ) => {
    trackSelectFilters(newFilters, category);
  };

  const openFilters = () => {
    trackOpenFiltersTab(activeFilters, currentCategory?.name['es-CL']);
    setShowFilter(true);
  };

  const closeFilters = () => {
    setShowFilter(false);
    clearFiltersToApply();
  };

  const handleActiveFiltersChange = (filters: ActiveFilter[]) => {
    setActiveFilters(filters);
  };

  const handleApplyFiltersFromQuery = () => {
    const newStockFilter = {
      ...stockFilterDefaultValue,
      active: isStockQueryActive()
    };
    setStockFilter(newStockFilter);
    handleActiveFiltersChange(getActiveFilters(filterList, newStockFilter));
  };

  // INFO: Used on apply filters in mobile/tablet
  const setFiltersToApply = () => {
    if (filterListToApply) {
      setFilterList(filterListToApply);
      setFilterListToApply(null);
    }
    if (stockFilterToApply) {
      setStockFilter(stockFilterToApply);
      setStockFilterToApply(null);
    }
  };

  const clearFiltersToApply = () => {
    setFilterListToApply(null);
    setStockFilterToApply(null);
  };

  const handleStockFilterClick = (value: boolean, applyChanges: boolean) => {
    const newStockFilter = { ...stockFilter, active: value };

    if (applyChanges) {
      setStockFilter(newStockFilter);
      setStockFilterToApply(null);
    } else {
      setStockFilterToApply(newStockFilter);
    }

    return newStockFilter;
  };

  const handleFilterItemClick = (
    filter: string,
    option: string,
    value: boolean,
    applyChanges: boolean
  ) => {
    let newFilterList = filterList;

    if (applyChanges) {
      newFilterList = getFilterListStatus(filterList, filter, option, value);

      setFilterList(newFilterList);
      setFilterListToApply(null);
    } else {
      newFilterList = getFilterListStatus(
        filterListToApply || filterList,
        filter,
        option,
        value
      );

      setFilterListToApply(newFilterList);
    }

    return newFilterList;
  };

  const handleFilterClick = (
    filter: string,
    option: string,
    value: boolean,
    applyChanges: boolean
  ): ActiveFilter[] => {
    let newFilterList = filterList;
    let newStockFilter = stockFilter;

    if (filter === stockFilter.slug) {
      newStockFilter = handleStockFilterClick(value, applyChanges);
    } else {
      newFilterList = handleFilterItemClick(
        filter,
        option,
        value,
        applyChanges
      );
    }

    return getActiveFilters(newFilterList, newStockFilter);
  };

  const handleApply = (newFilters: ActiveFilter[]) => {
    const routerData = getRouterNewDataWithFilters(newFilters, router.query);
    handleTrackSelectFilters(currentCategory?.name['es-CL'], newFilters);
    setFiltersToApply();
    closeFilters();

    router.replace(routerData);
  };

  const resetFilters = () => {
    const routerData = getRouterNewDataWithFilters([], router.query);

    setStockFilter(stockFilterDefaultValue);
    router.replace(routerData);
  };

  const clearFilters = () => {
    resetFilters();
    closeFilters();
  };

  const removeActiveFilter = (filter: string, option: string): void => {
    const newFilterList = handleFilterClick(filter, option, false, true);

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
        filterList: filterListToApply || filterList,
        stockFilter: stockFilterToApply || stockFilter,
        removeActiveFilter,
        trackSelectFilter: handleTrackSelectFilters
      }}
    >
      {children}
    </filterContext.Provider>
  );
};

export const useFilterContext = () => useContext(filterContext);

export default FilterContext;
