import React, { type FC } from 'react';
import { MAIL } from '../iconNames';
import type Props from './IconPropType';

const MailIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${MAIL}`,
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
        d="M18.3307 5.0026C18.3307 4.08594 17.5807 3.33594 16.6641 3.33594H3.33073C2.41406 3.33594 1.66406 4.08594 1.66406 5.0026V15.0026C1.66406 15.9193 2.41406 16.6693 3.33073 16.6693H16.6641C17.5807 16.6693 18.3307 15.9193 18.3307 15.0026V5.0026ZM16.6641 5.0026L9.9974 9.16094L3.33073 5.0026H16.6641ZM16.6641 15.0026H3.33073V6.66927L9.9974 10.8359L16.6641 6.66927V15.0026Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default MailIcon;
