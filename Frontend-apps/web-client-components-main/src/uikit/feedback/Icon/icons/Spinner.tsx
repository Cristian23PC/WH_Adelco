import React, { type FC } from 'react';
import { SPINNER } from '../iconNames';
import classnames from 'classnames';

import type Props from './IconPropType';

const SpinnerIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${SPINNER}`,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={classnames(className, 'animate-spin')}
      data-testid={dataTestId}
    >
      <path
        d="M15.3033 4.69674L14.125 5.87508C13.1708 4.92074 11.9151 4.3268 10.5721 4.19444C9.22902 4.06209 7.88162 4.39952 6.75945 5.14923C5.63728 5.89895 4.80978 7.01457 4.41795 8.306C4.02612 9.59743 4.09419 10.9848 4.61057 12.2316C5.12695 13.4785 6.05969 14.5078 7.24986 15.144C8.44003 15.7803 9.81399 15.9842 11.1376 15.721C12.4613 15.4578 13.6527 14.7438 14.509 13.7006C15.3652 12.6574 15.8332 11.3496 15.8333 10.0001H17.5C17.5 11.7352 16.8983 13.4167 15.7975 14.758C14.6968 16.0993 13.1649 17.0174 11.4631 17.3559C9.76129 17.6944 7.99475 17.4324 6.46448 16.6144C4.9342 15.7964 3.73489 14.4732 3.07088 12.8701C2.40688 11.267 2.31926 9.48327 2.82296 7.82283C3.32667 6.16238 4.39052 4.72796 5.83327 3.76396C7.27601 2.79997 9.00837 2.36604 10.7352 2.53613C12.462 2.70622 14.0764 3.46979 15.3033 4.69674Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default SpinnerIcon;
