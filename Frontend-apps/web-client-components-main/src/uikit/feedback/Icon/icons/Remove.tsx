import React, { type FC } from 'react';
import { REMOVE } from '../iconNames';
import type Props from './IconPropType';

const RemoveIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${REMOVE}`,
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
        d="M15.8307 10.8307H4.16406V9.16406H15.8307V10.8307Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default RemoveIcon;
