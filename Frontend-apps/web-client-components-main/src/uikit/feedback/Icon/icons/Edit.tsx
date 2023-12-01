import React, { type FC } from 'react';
import { EDIT } from '../iconNames';
import type Props from './IconPropType';

const EditIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${EDIT}`,
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
        d="M2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833L2.5 14.375ZM4.93333 15.8333H4.16667V15.0667L11.7167 7.51667L12.4833 8.28333L4.93333 15.8333ZM17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5C14.5 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default EditIcon;
