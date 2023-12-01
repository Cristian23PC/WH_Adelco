import React, { type FC } from 'react';
import { DESKTOP } from '../iconNames';
import type Props from './IconPropType';

const DesktopIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${DESKTOP}`,
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
        d="M17.5026 1.66406H2.5026C1.58594 1.66406 0.835938 2.41406 0.835938 3.33073V13.3307C0.835938 14.2474 1.58594 14.9974 2.5026 14.9974H8.33594V16.6641H6.66927V18.3307H13.3359V16.6641H11.6693V14.9974H17.5026C18.4193 14.9974 19.1693 14.2474 19.1693 13.3307V3.33073C19.1693 2.41406 18.4193 1.66406 17.5026 1.66406ZM17.5026 13.3307H2.5026V3.33073H17.5026V13.3307Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default DesktopIcon;
