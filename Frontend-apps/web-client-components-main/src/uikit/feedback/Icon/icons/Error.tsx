import React, { type FC } from 'react';
import { ERROR } from '../iconNames';
import type Props from './IconPropType';

const ErrorIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${ERROR}`,
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
        d="M9.9974 18.3307C5.3949 18.3307 1.66406 14.5999 1.66406 9.9974C1.66406 5.3949 5.3949 1.66406 9.9974 1.66406C14.5999 1.66406 18.3307 5.3949 18.3307 9.9974C18.3307 14.5999 14.5999 18.3307 9.9974 18.3307ZM9.9974 16.6641C11.7655 16.6641 13.4612 15.9617 14.7114 14.7114C15.9617 13.4612 16.6641 11.7655 16.6641 9.9974C16.6641 8.22929 15.9617 6.53359 14.7114 5.28335C13.4612 4.03311 11.7655 3.33073 9.9974 3.33073C8.22929 3.33073 6.53359 4.03311 5.28335 5.28335C4.03311 6.53359 3.33073 8.22929 3.33073 9.9974C3.33073 11.7655 4.03311 13.4612 5.28335 14.7114C6.53359 15.9617 8.22929 16.6641 9.9974 16.6641ZM9.16406 12.4974H10.8307V14.1641H9.16406V12.4974ZM9.16406 5.83073H10.8307V10.8307H9.16406V5.83073Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default ErrorIcon;
