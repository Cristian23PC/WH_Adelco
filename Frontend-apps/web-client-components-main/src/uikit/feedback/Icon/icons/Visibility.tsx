import React, { type FC } from 'react';
import { VISIBILITY } from '../iconNames';
import type Props from './IconPropType';

const VisibilityIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${VISIBILITY}`,
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
        d="M10.0026 5.41667C13.1609 5.41667 15.9776 7.19167 17.3526 10C15.9776 12.8083 13.1609 14.5833 10.0026 14.5833C6.84427 14.5833 4.0276 12.8083 2.6526 10C4.0276 7.19167 6.84427 5.41667 10.0026 5.41667ZM10.0026 3.75C5.83594 3.75 2.2776 6.34167 0.835938 10C2.2776 13.6583 5.83594 16.25 10.0026 16.25C14.1693 16.25 17.7276 13.6583 19.1693 10C17.7276 6.34167 14.1693 3.75 10.0026 3.75ZM10.0026 7.91667C11.1526 7.91667 12.0859 8.85 12.0859 10C12.0859 11.15 11.1526 12.0833 10.0026 12.0833C8.8526 12.0833 7.91927 11.15 7.91927 10C7.91927 8.85 8.8526 7.91667 10.0026 7.91667ZM10.0026 6.25C7.93594 6.25 6.2526 7.93333 6.2526 10C6.2526 12.0667 7.93594 13.75 10.0026 13.75C12.0693 13.75 13.7526 12.0667 13.7526 10C13.7526 7.93333 12.0693 6.25 10.0026 6.25Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default VisibilityIcon;
