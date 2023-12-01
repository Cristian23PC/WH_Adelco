import React, { type FC } from 'react';
import { ARROW_S_LEFT } from '../iconNames';
import type Props from './IconPropType';

const ArrowSLeftIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_S_LEFT}`,
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
        d="M13.0891 6.175L11.9141 5L6.91406 10L11.9141 15L13.0891 13.825L9.2724 10L13.0891 6.175Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowSLeftIcon;
