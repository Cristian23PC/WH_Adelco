import React, { type FC } from 'react';
import { MICROSOFT } from '../iconNames';
import type Props from './IconPropType';

const MicrosoftIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${MICROSOFT}`,
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
        d="M9.16667 4.16667H4.16667V9.16667H9.16667V4.16667ZM10.8333 4.16667V9.16667H15.8333V4.16667H10.8333ZM15.8333 10.8333H10.8333V15.8333H15.8333V10.8333ZM9.16667 15.8333V10.8333H4.16667V15.8333H9.16667ZM2.5 2.5H17.5V17.5H2.5V2.5Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default MicrosoftIcon;
