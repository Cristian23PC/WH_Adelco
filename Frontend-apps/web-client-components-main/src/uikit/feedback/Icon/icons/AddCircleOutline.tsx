import React, { type FC } from 'react';
import { ADD_CIRCLE_OUTLINE } from '../iconNames';
import type Props from './IconPropType';

const AddCircleOutlineIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ADD_CIRCLE_OUTLINE}`,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      data-testid={dataTestId}
      className={className}
    >
      <path
        d="M10.8307 5.83073H9.16406V9.16406H5.83073V10.8307H9.16406V14.1641H10.8307V10.8307H14.1641V9.16406H10.8307V5.83073ZM9.9974 1.66406C5.3974 1.66406 1.66406 5.3974 1.66406 9.9974C1.66406 14.5974 5.3974 18.3307 9.9974 18.3307C14.5974 18.3307 18.3307 14.5974 18.3307 9.9974C18.3307 5.3974 14.5974 1.66406 9.9974 1.66406ZM9.9974 16.6641C6.3224 16.6641 3.33073 13.6724 3.33073 9.9974C3.33073 6.3224 6.3224 3.33073 9.9974 3.33073C13.6724 3.33073 16.6641 6.3224 16.6641 9.9974C16.6641 13.6724 13.6724 16.6641 9.9974 16.6641Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default AddCircleOutlineIcon;
