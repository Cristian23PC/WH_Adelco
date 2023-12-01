import React, { type FC } from 'react';
import { SENTIMENT_NEUTRAL } from '../iconNames';
import type Props from './IconPropType';

const SentimentNeutralIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${SENTIMENT_NEUTRAL}`,
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
        d="M7.4974 11.6641H12.4974V12.9141H7.4974V11.6641Z"
        className={className}
        fill="#1D1D1B"
      />
      <path
        d="M12.9141 9.16406C13.6044 9.16406 14.1641 8.60442 14.1641 7.91406C14.1641 7.22371 13.6044 6.66406 12.9141 6.66406C12.2237 6.66406 11.6641 7.22371 11.6641 7.91406C11.6641 8.60442 12.2237 9.16406 12.9141 9.16406Z"
        className={className}
        fill="#1D1D1B"
      />
      <path
        d="M7.08073 9.16406C7.77109 9.16406 8.33073 8.60442 8.33073 7.91406C8.33073 7.22371 7.77109 6.66406 7.08073 6.66406C6.39037 6.66406 5.83073 7.22371 5.83073 7.91406C5.83073 8.60442 6.39037 9.16406 7.08073 9.16406Z"
        className={className}
        fill="#1D1D1B"
      />
      <path
        d="M9.98906 1.66406C5.38906 1.66406 1.66406 5.3974 1.66406 9.9974C1.66406 14.5974 5.38906 18.3307 9.98906 18.3307C14.5974 18.3307 18.3307 14.5974 18.3307 9.9974C18.3307 5.3974 14.5974 1.66406 9.98906 1.66406ZM9.9974 16.6641C6.31406 16.6641 3.33073 13.6807 3.33073 9.9974C3.33073 6.31406 6.31406 3.33073 9.9974 3.33073C13.6807 3.33073 16.6641 6.31406 16.6641 9.9974C16.6641 13.6807 13.6807 16.6641 9.9974 16.6641Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default SentimentNeutralIcon;
