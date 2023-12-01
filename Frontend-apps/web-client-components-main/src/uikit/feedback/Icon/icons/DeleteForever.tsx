import React, { type FC } from 'react';
import { DELETE_FOREVER } from '../iconNames';
import type Props from './IconPropType';

const DeleteForeverIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${DELETE_FOREVER}`,
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
        d="M11.7641 8.725L9.9974 10.4917L8.2224 8.725L7.0474 9.9L8.8224 11.6667L7.05573 13.4333L8.23073 14.6083L9.9974 12.8417L11.7641 14.6083L12.9391 13.4333L11.1724 11.6667L12.9391 9.9L11.7641 8.725ZM12.9141 3.33333L12.0807 2.5H7.91406L7.08073 3.33333H4.16406V5H15.8307V3.33333H12.9141ZM4.9974 15.8333C4.9974 16.75 5.7474 17.5 6.66406 17.5H13.3307C14.2474 17.5 14.9974 16.75 14.9974 15.8333V5.83333H4.9974V15.8333ZM6.66406 7.5H13.3307V15.8333H6.66406V7.5Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default DeleteForeverIcon;
