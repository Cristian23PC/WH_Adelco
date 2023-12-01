import React, { type FC } from 'react';
import { MENU } from '../iconNames';
import type Props from './IconPropType';

const MenuIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${MENU}`,
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
        d="M2.5 15H17.5V13.3333H2.5V15ZM2.5 10.8333H17.5V9.16667H2.5V10.8333ZM2.5 5V6.66667H17.5V5H2.5Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default MenuIcon;
