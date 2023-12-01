import React, { type FC } from 'react';
import { ARROW_DOWN } from '../iconNames';
import type Props from './IconPropType';

const ArrowDownIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_DOWN}`,
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
        d="M9.16927 3.33854L9.16927 13.4802L4.51094 8.82188L3.33594 10.0052L10.0026 16.6719L16.6693 10.0052L15.4943 8.83021L10.8359 13.4802L10.8359 3.33854L9.16927 3.33854Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowDownIcon;
