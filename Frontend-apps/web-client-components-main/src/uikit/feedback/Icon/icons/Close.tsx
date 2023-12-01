import React, { type FC } from 'react';
import { CLOSE } from '../iconNames';
import type Props from './IconPropType';

const CloseIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${CLOSE}`,
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
        d="M15.8307 5.33906L14.6557 4.16406L9.9974 8.8224L5.33906 4.16406L4.16406 5.33906L8.8224 9.9974L4.16406 14.6557L5.33906 15.8307L9.9974 11.1724L14.6557 15.8307L15.8307 14.6557L11.1724 9.9974L15.8307 5.33906Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default CloseIcon;
