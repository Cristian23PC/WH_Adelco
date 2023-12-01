import React, { type FC } from 'react';
import { DIRECTIONS_WALK } from '../iconNames';
import type Props from './IconPropType';

const DirectionsWalkIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${DIRECTIONS_WALK}`,
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
        d="M10.8359 4.3724C11.7526 4.3724 12.5026 3.6224 12.5026 2.70573C12.5026 1.78906 11.7526 1.03906 10.8359 1.03906C9.91927 1.03906 9.16927 1.78906 9.16927 2.70573C9.16927 3.6224 9.91927 4.3724 10.8359 4.3724ZM7.7526 7.20573L5.41927 18.9557H7.16927L8.66927 12.2891L10.4193 13.9557V18.9557H12.0859V12.7057L10.3359 11.0391L10.8359 8.53906C11.9193 9.78906 13.5859 10.6224 15.4193 10.6224V8.95573C13.8359 8.95573 12.5026 8.1224 11.8359 6.95573L11.0026 5.6224C10.5359 4.88073 9.6026 4.58073 8.79427 4.9224L4.58594 6.70573V10.6224H6.2526V7.78906L7.7526 7.20573Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default DirectionsWalkIcon;
