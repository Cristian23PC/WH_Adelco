import React, { type FC } from 'react';
import { BOX } from '../iconNames';
import type Props from './IconPropType';

const BoxIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${BOX}`,
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
        d="M10.2092 2.16578C10.0749 2.11196 9.92506 2.11196 9.79075 2.16578L3.07675 4.85116L5.78125 5.93228L12.7045 3.16366L10.2092 2.16578ZM14.2188 3.77003L7.2955 6.53866L10 7.61978L16.9233 4.85116L14.2188 3.77003ZM17.875 5.68253L10.5625 8.60753V17.5198L17.875 14.5948V5.68366V5.68253ZM9.4375 17.5209V8.60641L2.125 5.68253V14.5959L9.4375 17.5209ZM9.37337 1.12066C9.77564 0.959781 10.2244 0.959781 10.6266 1.12066L18.6467 4.32916C18.751 4.37095 18.8404 4.443 18.9034 4.53603C18.9663 4.62907 19 4.73882 19 4.85116V14.5959C18.9999 14.8207 18.9324 15.0403 18.8062 15.2264C18.6801 15.4125 18.5011 15.5565 18.2924 15.6399L10.2092 18.8732C10.0749 18.927 9.92506 18.927 9.79075 18.8732L1.70875 15.6399C1.49978 15.5567 1.32056 15.4127 1.19422 15.2266C1.06788 15.0405 1.00023 14.8208 1 14.5959V4.85116C1.00003 4.73882 1.03369 4.62907 1.09665 4.53603C1.1596 4.443 1.24898 4.37095 1.35325 4.32916L9.37337 1.12066Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default BoxIcon;