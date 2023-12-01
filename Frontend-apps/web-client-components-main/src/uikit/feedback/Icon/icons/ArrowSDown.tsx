import React, { type FC } from 'react';
import { ARROW_S_DOWN } from '../iconNames';
import type Props from './IconPropType';

const ArrowSDownIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_S_DOWN}`,
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
        d="M13.825 6.91406L10 10.7307L6.175 6.91406L5 8.08906L10 13.0891L15 8.08906L13.825 6.91406Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowSDownIcon;
