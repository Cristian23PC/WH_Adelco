import React, { type FC } from 'react';
import { DONE } from '../iconNames';
import type Props from './IconPropType';

const DoneIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${DONE}`,
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
        d="M7.5026 13.4974L4.0026 9.9974L2.83594 11.1641L7.5026 15.8307L17.5026 5.83073L16.3359 4.66406L7.5026 13.4974Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default DoneIcon;
