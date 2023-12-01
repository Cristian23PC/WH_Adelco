import React, { type FC } from 'react';
import { ARROW_BACK } from '../iconNames';
import type Props from './IconPropType';

const ArrowBackIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_BACK}`,
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
        d="M16.6693 9.16927H6.5276L11.1859 4.51094L10.0026 3.33594L3.33594 10.0026L10.0026 16.6693L11.1776 15.4943L6.5276 10.8359H16.6693V9.16927Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowBackIcon;
