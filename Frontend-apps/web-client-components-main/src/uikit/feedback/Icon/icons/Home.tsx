import React, { type FC } from 'react';
import { HOME } from '../iconNames';
import type Props from './IconPropType';

const HomeIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${HOME}`,
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
        d="M9.9974 5.15573L14.1641 8.90573V15.4141H12.4974V10.4141H7.4974V15.4141H5.83073V8.90573L9.9974 5.15573ZM9.9974 2.91406L1.66406 10.4141H4.16406V17.0807H9.16406V12.0807H10.8307V17.0807H15.8307V10.4141H18.3307L9.9974 2.91406Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default HomeIcon;
