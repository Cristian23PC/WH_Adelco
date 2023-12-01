import React, { type FC } from 'react';
import { MAP } from '../iconNames';
import type Props from './IconPropType';

const MapIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${MAP}`,
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
        d="M17.0833 2.5L16.95 2.525L12.5 4.25L7.5 2.5L2.8 4.08333C2.625 4.14167 2.5 4.29167 2.5 4.48333V17.0833C2.5 17.3167 2.68333 17.5 2.91667 17.5L3.05 17.475L7.5 15.75L12.5 17.5L17.2 15.9167C17.375 15.8583 17.5 15.7083 17.5 15.5167V2.91667C17.5 2.68333 17.3167 2.5 17.0833 2.5ZM8.33333 4.55833L11.6667 5.725V15.4417L8.33333 14.275V4.55833ZM4.16667 5.38333L6.66667 4.54167V14.2917L4.16667 15.2583V5.38333ZM15.8333 14.6167L13.3333 15.4583V5.71667L15.8333 4.75V14.6167Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default MapIcon;
