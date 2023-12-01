import classNames from 'classnames';
import React, { type FC } from 'react';

export interface FilterIndicatorProps {
  quantity: number;
  label?: string;
  className?: string;
}

const FilterIndicator: FC<FilterIndicatorProps> = ({
  quantity,
  label = '',
  className
}) => {
  const isLabelPresent = label !== '';
  const normalizeLabel = isLabelPresent ? `${quantity} ${label}` : quantity;

  return (
    <span
      className={classNames(
        `inline-block rounded-3xl bg-success min-w-[18px] text-center text-xs font-bold text-white ${
          isLabelPresent ? 'py-[1px] px-2' : 'p-[1px]'
        }`,
        className
      )}
    >
      {normalizeLabel}
    </span>
  );
};

export default FilterIndicator;
