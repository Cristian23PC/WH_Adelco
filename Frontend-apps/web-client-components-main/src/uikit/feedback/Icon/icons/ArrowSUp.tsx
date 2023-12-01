import React, { type FC } from 'react';
import { ARROW_S_UP } from '../iconNames';
import type Props from './IconPropType';

const ArrowSUpIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_S_UP}`,
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
        d="M10 6.91406L5 11.9141L6.175 13.0891L10 9.2724L13.825 13.0891L15 11.9141L10 6.91406Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowSUpIcon;
