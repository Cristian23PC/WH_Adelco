import React, { type FC } from 'react';
import { ARROW_NEXT } from '../iconNames';
import type Props from './IconPropType';

const ArrowNextIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ARROW_NEXT}`,
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
        d="M3.33854 10.8385L13.4802 10.8385L8.82188 15.4969L10.0052 16.6719L16.6719 10.0052L10.0052 3.33854L8.83021 4.51354L13.4802 9.17187L3.33854 9.17187L3.33854 10.8385Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ArrowNextIcon;
