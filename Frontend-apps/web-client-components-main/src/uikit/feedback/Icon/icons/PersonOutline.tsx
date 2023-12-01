import React, { type FC } from 'react';
import { PERSON_OUTLINE } from '../iconNames';
import type Props from './IconPropType';

const PersonOutlineIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${PERSON_OUTLINE}`,
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
        d="M10.0026 4.91927C10.9693 4.91927 11.7526 5.7026 11.7526 6.66927C11.7526 7.63594 10.9693 8.41927 10.0026 8.41927C9.03594 8.41927 8.2526 7.63594 8.2526 6.66927C8.2526 5.7026 9.03594 4.91927 10.0026 4.91927ZM10.0026 12.4193C12.4776 12.4193 15.0859 13.6359 15.0859 14.1693V15.0859H4.91927V14.1693C4.91927 13.6359 7.5276 12.4193 10.0026 12.4193ZM10.0026 3.33594C8.16094 3.33594 6.66927 4.8276 6.66927 6.66927C6.66927 8.51094 8.16094 10.0026 10.0026 10.0026C11.8443 10.0026 13.3359 8.51094 13.3359 6.66927C13.3359 4.8276 11.8443 3.33594 10.0026 3.33594ZM10.0026 10.8359C7.7776 10.8359 3.33594 11.9526 3.33594 14.1693V16.6693H16.6693V14.1693C16.6693 11.9526 12.2276 10.8359 10.0026 10.8359Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default PersonOutlineIcon;
