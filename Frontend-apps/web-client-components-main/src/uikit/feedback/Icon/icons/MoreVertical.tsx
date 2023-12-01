import React, { type FC } from 'react';
import { MORE_VERTICAL } from '../iconNames';
import type Props from './IconPropType';

const MoreVerticalIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${MORE_VERTICAL}`,
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
        d="M10.0026 6.66927C10.9193 6.66927 11.6693 5.91927 11.6693 5.0026C11.6693 4.08594 10.9193 3.33594 10.0026 3.33594C9.08594 3.33594 8.33594 4.08594 8.33594 5.0026C8.33594 5.91927 9.08594 6.66927 10.0026 6.66927ZM10.0026 8.33594C9.08594 8.33594 8.33594 9.08594 8.33594 10.0026C8.33594 10.9193 9.08594 11.6693 10.0026 11.6693C10.9193 11.6693 11.6693 10.9193 11.6693 10.0026C11.6693 9.08594 10.9193 8.33594 10.0026 8.33594ZM10.0026 13.3359C9.08594 13.3359 8.33594 14.0859 8.33594 15.0026C8.33594 15.9193 9.08594 16.6693 10.0026 16.6693C10.9193 16.6693 11.6693 15.9193 11.6693 15.0026C11.6693 14.0859 10.9193 13.3359 10.0026 13.3359Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default MoreVerticalIcon;
