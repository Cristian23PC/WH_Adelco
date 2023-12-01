import React, { type FC } from 'react';
import { ADD } from '../iconNames';
import type Props from './IconPropType';

const AddIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ADD}`,
  fill,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
      data-testid={dataTestId}
    >
      <path
        d="M15.8307 10.8307H10.8307V15.8307H9.16406V10.8307H4.16406V9.16406H9.16406V4.16406H10.8307V9.16406H15.8307V10.8307Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default AddIcon;
