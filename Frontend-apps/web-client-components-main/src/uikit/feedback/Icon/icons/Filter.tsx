import React, { type FC } from 'react';
import { FILTER } from '../iconNames';
import type Props from './IconPropType';

const FilterIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${FILTER}`,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
      data-testid={dataTestId}
    >
      <path
        d="M17.5 3.33594V5.0026H16.6667L12.5 11.2526V18.3359H7.5V11.2526L3.33333 5.0026H2.5V3.33594H17.5ZM5.33667 5.0026L9.16667 10.7476V16.6693H10.8333V10.7476L14.6633 5.0026H5.33667Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default FilterIcon;
