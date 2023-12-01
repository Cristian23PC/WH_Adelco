import React, { type FC } from 'react';
import { HELP_OUTLINE } from '../iconNames';
import type Props from './IconPropType';

const HelpOutlineIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${HELP_OUTLINE}`,
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
        d="M9.16406 14.9974H10.8307V13.3307H9.16406V14.9974ZM9.9974 1.66406C5.3974 1.66406 1.66406 5.3974 1.66406 9.9974C1.66406 14.5974 5.3974 18.3307 9.9974 18.3307C14.5974 18.3307 18.3307 14.5974 18.3307 9.9974C18.3307 5.3974 14.5974 1.66406 9.9974 1.66406ZM9.9974 16.6641C6.3224 16.6641 3.33073 13.6724 3.33073 9.9974C3.33073 6.3224 6.3224 3.33073 9.9974 3.33073C13.6724 3.33073 16.6641 6.3224 16.6641 9.9974C16.6641 13.6724 13.6724 16.6641 9.9974 16.6641ZM9.9974 4.9974C8.15573 4.9974 6.66406 6.48906 6.66406 8.33073H8.33073C8.33073 7.41406 9.08073 6.66406 9.9974 6.66406C10.9141 6.66406 11.6641 7.41406 11.6641 8.33073C11.6641 9.9974 9.16406 9.78906 9.16406 12.4974H10.8307C10.8307 10.6224 13.3307 10.4141 13.3307 8.33073C13.3307 6.48906 11.8391 4.9974 9.9974 4.9974Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default HelpOutlineIcon;
