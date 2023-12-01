import React, { type FC } from 'react';
import { PLACE } from '../iconNames';
import type Props from './IconPropType';

const PlaceIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${PLACE}`,
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
        d="M10.0026 9.9974C9.08594 9.9974 8.33594 9.2474 8.33594 8.33073C8.33594 7.41406 9.08594 6.66406 10.0026 6.66406C10.9193 6.66406 11.6693 7.41406 11.6693 8.33073C11.6693 9.2474 10.9193 9.9974 10.0026 9.9974ZM15.0026 8.4974C15.0026 5.4724 12.7943 3.33073 10.0026 3.33073C7.21094 3.33073 5.0026 5.4724 5.0026 8.4974C5.0026 10.4474 6.6276 13.0307 10.0026 16.1141C13.3776 13.0307 15.0026 10.4474 15.0026 8.4974ZM10.0026 1.66406C13.5026 1.66406 16.6693 4.3474 16.6693 8.4974C16.6693 11.2641 14.4443 14.5391 10.0026 18.3307C5.56094 14.5391 3.33594 11.2641 3.33594 8.4974C3.33594 4.3474 6.5026 1.66406 10.0026 1.66406Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default PlaceIcon;
