import { VoidFunctionComponent } from 'react';
import { Filters } from 'am-ts-components';
import { useFilterContext } from '../../../contexts/Filter/FilterContext';

const Filter: VoidFunctionComponent = () => {
  const { filterList, handleFilterClick, handleApply, clearFilters, closeFilters, showFilter } = useFilterContext();

  return (
    <Filters
      filterList={filterList}
      className="w-[207px]"
      onChangeFilters={handleFilterClick}
      title=""
      onClose={closeFilters}
      onClear={clearFilters}
      onApply={handleApply}
      onFilterClick={handleFilterClick}
      linkRenderer={(_, label) => <div>{label}</div>}
      open={showFilter}
    />
  );
};

export default Filter;
