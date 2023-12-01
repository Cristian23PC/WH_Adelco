import React, { type FC } from 'react';
import { LOGIN } from '../iconNames';
import type Props from './IconPropType';

const LoginIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${LOGIN}`,
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
        d="M8.5 9.5V7L12.6667 10.3333L8.5 13.6667V11.1667H1V9.5H8.5ZM2.215 12.8333H3.985C4.5667 14.2659 5.62809 15.4518 6.9876 16.1883C8.3471 16.9247 9.92026 17.1659 11.438 16.8706C12.9557 16.5753 14.3236 15.7618 15.3078 14.5694C16.292 13.3769 16.8312 11.8795 16.8333 10.3333C16.8342 8.78555 16.2965 7.28569 15.3124 6.09102C14.3284 4.89634 12.9593 4.0813 11.44 3.78568C9.92068 3.49006 8.34587 3.73228 6.98565 4.47081C5.62542 5.20934 4.56456 6.39815 3.985 7.83333H2.215C3.27667 4.4525 6.435 2 10.1667 2C14.7692 2 18.5 5.73083 18.5 10.3333C18.5 14.9358 14.7692 18.6667 10.1667 18.6667C6.435 18.6667 3.27667 16.2142 2.215 12.8333Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default LoginIcon;
