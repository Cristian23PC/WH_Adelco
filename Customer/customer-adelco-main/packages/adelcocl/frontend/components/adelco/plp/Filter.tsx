import { VoidFunctionComponent } from 'react';
import { Filters } from '@adelco/web-components';
import { useFilterContext } from '../../../contexts/Filter/FilterContext';
import TypeFilter from './TypeFilter';

const TYPE_FILTER = 'variants.categories.id';

const Filter: VoidFunctionComponent = () => {
  const {
    filterList,
    handleFilterClick,
    handleApply,
    clearFilters,
    closeFilters,
    showFilter,
    stockFilter
  } = useFilterContext();

  const normalFilters = {
    ...filterList,
    filters: filterList.filters.filter(({ slug }) => slug !== TYPE_FILTER)
  };

  const typeFilter = filterList.filters.find(
    ({ slug }) => slug === TYPE_FILTER
  );

  return (
    <Filters
      filterList={normalFilters}
      className="w-[207px]"
      onChangeFilters={handleFilterClick}
      title=""
      onClose={closeFilters}
      onClear={clearFilters}
      onApply={handleApply}
      linkRenderer={(_, label) => <div>{label}</div>}
      open={showFilter}
      stockFilter={stockFilter}
      customFilterComponent={
        <TypeFilter filter={typeFilter} closeFilters={closeFilters} />
      }
    />
  );
};

export default Filter;
