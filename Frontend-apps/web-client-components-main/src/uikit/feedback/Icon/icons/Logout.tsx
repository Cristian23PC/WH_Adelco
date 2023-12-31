import React, { type FC } from 'react';
import { LOGOUT } from '../iconNames';
import type Props from './IconPropType';

const LogoutIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${LOGOUT}`,
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
        d="M4.16667 9.16407H10.8333V10.8307H4.16667V13.3307L0 9.9974L4.16667 6.66407V9.16407ZM3.33333 14.9974H5.59C6.55224 15.846 7.73891 16.3989 9.00761 16.5898C10.2763 16.7808 11.5731 16.6015 12.7425 16.0736C13.9119 15.5458 14.9041 14.6917 15.6001 13.6139C16.296 12.5361 16.6663 11.2804 16.6663 9.9974C16.6663 8.71442 16.296 7.45868 15.6001 6.38089C14.9041 5.30309 13.9119 4.44901 12.7425 3.92115C11.5731 3.39328 10.2763 3.21404 9.00761 3.40495C7.73891 3.59585 6.55224 4.14878 5.59 4.9974H3.33333C4.10888 3.96171 5.11528 3.12116 6.27256 2.54252C7.42984 1.96388 8.70612 1.66309 10 1.66406C14.6025 1.66406 18.3333 5.3949 18.3333 9.9974C18.3333 14.5999 14.6025 18.3307 10 18.3307C8.70612 18.3317 7.42984 18.0309 6.27256 17.4523C5.11528 16.8736 4.10888 16.0331 3.33333 14.9974Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default LogoutIcon;
