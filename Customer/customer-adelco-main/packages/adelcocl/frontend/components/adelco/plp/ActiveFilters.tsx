import { Chip } from '@adelco/web-components';
import {
  stockFilterDefaultValue,
  useFilterContext
} from '../../../contexts/Filter/FilterContext';

const ActiveFilters = () => {
  const { activeFilters, removeActiveFilter } = useFilterContext();

  const visibleActiveFilters = activeFilters.filter(
    (filter) =>
      filter.filterSlug !== stockFilterDefaultValue.slug ||
      filter.optionSlug !== 'false'
  );

  return (
    <div className="flex flex-wrap gap-2">
      {visibleActiveFilters.map((filter) => (
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
