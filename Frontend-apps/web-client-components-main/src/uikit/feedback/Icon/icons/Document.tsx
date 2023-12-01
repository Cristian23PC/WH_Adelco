import React, { type FC } from 'react';
import { DOCUMENT } from '../iconNames';
import type Props from './IconPropType';

const DocumentIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${DOCUMENT}`,
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
        d="M16.1667 18.6667H2.83333C2.61232 18.6667 2.40036 18.5789 2.24408 18.4226C2.0878 18.2663 2 18.0543 2 17.8333V2.83333C2 2.61232 2.0878 2.40036 2.24408 2.24408C2.40036 2.0878 2.61232 2 2.83333 2H16.1667C16.3877 2 16.5996 2.0878 16.7559 2.24408C16.9122 2.40036 17 2.61232 17 2.83333V17.8333C17 18.0543 16.9122 18.2663 16.7559 18.4226C16.5996 18.5789 16.3877 18.6667 16.1667 18.6667ZM15.3333 17V3.66667H3.66667V17H15.3333ZM5.33333 5.33333H8.66667V8.66667H5.33333V5.33333ZM5.33333 10.3333H13.6667V12H5.33333V10.3333ZM5.33333 13.6667H13.6667V15.3333H5.33333V13.6667ZM10.3333 6.16667H13.6667V7.83333H10.3333V6.16667Z"
        fill="#1D1D1B"
        className={className}
      />
    </svg>
  );
};

export default DocumentIcon;
