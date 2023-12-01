import React, { type FC } from 'react';
import { SEARCH } from '../iconNames';
import type Props from './IconPropType';

const SearchIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${SEARCH}`,
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
        d="M13.1276 11.8776H12.4693L12.2359 11.6526C13.0526 10.7026 13.5443 9.46927 13.5443 8.1276C13.5443 5.13594 11.1193 2.71094 8.1276 2.71094C5.13594 2.71094 2.71094 5.13594 2.71094 8.1276C2.71094 11.1193 5.13594 13.5443 8.1276 13.5443C9.46927 13.5443 10.7026 13.0526 11.6526 12.2359L11.8776 12.4693V13.1276L16.0443 17.2859L17.2859 16.0443L13.1276 11.8776ZM8.1276 11.8776C6.0526 11.8776 4.3776 10.2026 4.3776 8.1276C4.3776 6.0526 6.0526 4.3776 8.1276 4.3776C10.2026 4.3776 11.8776 6.0526 11.8776 8.1276C11.8776 10.2026 10.2026 11.8776 8.1276 11.8776Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default SearchIcon;
