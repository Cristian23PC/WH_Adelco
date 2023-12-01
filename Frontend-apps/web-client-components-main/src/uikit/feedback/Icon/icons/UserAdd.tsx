import React, { type FC } from 'react';
import { USER_ADD } from '../iconNames';
import type Props from './IconPropType';

const UserAddIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${USER_ADD}`,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
      data-testid={dataTestId}
    >
      <path
        d="M8.45871 9.88787V11.3206C8.02972 11.169 7.56817 11.0865 7.08728 11.0865C4.81502 11.0865 2.97299 12.9285 2.97299 15.2008H1.60156C1.60156 12.1711 4.0576 9.71507 7.08728 9.71507C7.56083 9.71507 8.0204 9.77507 8.45871 9.88787ZM7.08728 9.02935C4.81413 9.02935 2.97299 7.18821 2.97299 4.91507C2.97299 2.64192 4.81413 0.800781 7.08728 0.800781C9.36042 0.800781 11.2016 2.64192 11.2016 4.91507C11.2016 7.18821 9.36042 9.02935 7.08728 9.02935ZM7.08728 7.65792C8.60271 7.65792 9.83013 6.4305 9.83013 4.91507C9.83013 3.39964 8.60271 2.17221 7.08728 2.17221C5.57185 2.17221 4.34442 3.39964 4.34442 4.91507C4.34442 6.4305 5.57185 7.65792 7.08728 7.65792ZM11.2016 11.7722V9.71507H12.573V11.7722H14.6301V13.1436H12.573V15.2008H11.2016V13.1436H9.14442V11.7722H11.2016Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default UserAddIcon;
