import React, { type FC } from 'react';
import { ARROW_S_RIGHT } from '../iconNames';
import type Props from './IconPropType';

const ArrowSRightIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_S_RIGHT}`,
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
        d="M8.08906 5L6.91406 6.175L10.7307 10L6.91406 13.825L8.08906 15L13.0891 10L8.08906 5Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowSRightIcon;
