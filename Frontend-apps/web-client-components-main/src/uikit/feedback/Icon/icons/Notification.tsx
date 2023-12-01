import React, { type FC } from 'react';
import { NOTIFICATION } from '../iconNames';
import type Props from './IconPropType';

const NotificationIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${NOTIFICATION}`,
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
        d="M8.34167 17.2974C8.34167 18.2141 9.08333 18.9557 10 18.9557C10.9167 18.9557 11.6583 18.2141 11.6583 17.2974H8.34167ZM10 4.78906C12.3 4.78906 14.1667 6.65573 14.1667 8.95573V14.7891H5.83333V8.95573C5.83333 6.65573 7.7 4.78906 10 4.78906ZM10 1.03906C9.30833 1.03906 8.75 1.5974 8.75 2.28906V3.26406C6.13333 3.83073 4.16667 6.16406 4.16667 8.95573V13.9557L2.5 15.6224V16.4557H17.5V15.6224L15.8333 13.9557V8.95573C15.8333 6.16406 13.8667 3.83073 11.25 3.26406V2.28906C11.25 1.5974 10.6917 1.03906 10 1.03906Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default NotificationIcon;
