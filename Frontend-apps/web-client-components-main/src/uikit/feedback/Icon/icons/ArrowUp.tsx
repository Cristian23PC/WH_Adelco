import React, { type FC } from 'react';
import { ARROW_UP } from '../iconNames';
import type Props from './IconPropType';

const ArrowUpIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_UP}`,
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
        d="M10.8385 16.6693L10.8385 6.5276L15.4969 11.1859L16.6719 10.0026L10.0052 3.33594L3.33854 10.0026L4.51354 11.1776L9.17188 6.5276L9.17188 16.6693L10.8385 16.6693Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowUpIcon;
