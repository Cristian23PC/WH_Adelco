import React, { type FC } from 'react';
import { DELETE } from '../iconNames';
import type Props from './IconPropType';

const DeleteIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${DELETE}`,
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
        d="M13.3307 7.5V15.8333H6.66406V7.5H13.3307ZM12.0807 2.5H7.91406L7.08073 3.33333H4.16406V5H15.8307V3.33333H12.9141L12.0807 2.5ZM14.9974 5.83333H4.9974V15.8333C4.9974 16.75 5.7474 17.5 6.66406 17.5H13.3307C14.2474 17.5 14.9974 16.75 14.9974 15.8333V5.83333Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default DeleteIcon;
