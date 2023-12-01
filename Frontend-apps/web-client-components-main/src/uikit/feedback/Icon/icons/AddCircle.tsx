import React, { type FC } from 'react';
import { ADD_CIRCLE } from '../iconNames';
import type Props from './IconPropType';

const AddCircleIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ADD_CIRCLE}`,
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
        d="M9.9974 1.66406C5.3974 1.66406 1.66406 5.3974 1.66406 9.9974C1.66406 14.5974 5.3974 18.3307 9.9974 18.3307C14.5974 18.3307 18.3307 14.5974 18.3307 9.9974C18.3307 5.3974 14.5974 1.66406 9.9974 1.66406ZM14.1641 10.8307H10.8307V14.1641H9.16406V10.8307H5.83073V9.16406H9.16406V5.83073H10.8307V9.16406H14.1641V10.8307Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default AddCircleIcon;
