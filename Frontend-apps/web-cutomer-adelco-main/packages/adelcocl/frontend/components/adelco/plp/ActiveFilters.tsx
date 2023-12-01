import { Chip } from 'am-ts-components';
import { useFilterContext } from '../../../contexts/Filter/FilterContext';

const ActiveFilters = () => {
  const { activeFilters, removeActiveFilter } = useFilterContext();

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map((filter) => (
        <Chip
          key={filter.optionSlug}
          label={filter.title}
          onClose={() => {
            removeActiveFilter(filter.filterSlug, filter.optionSlug);
          }}
        />
      ))}
    </div>
  );
};

export default ActiveFilters;
