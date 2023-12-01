import React, { type FC } from 'react';
import { TIMER } from '../iconNames';
import type Props from './IconPropType';

const TimerIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${TIMER}`,
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
        d="M12.5547 0.84375H7.55469V2.51042H12.5547V0.84375ZM9.22135 11.6771H10.888V6.67708H9.22135V11.6771ZM15.913 6.16042L17.0964 4.97708C16.738 4.55208 16.3464 4.15208 15.9214 3.80208L14.738 4.98542C13.4464 3.95208 11.8214 3.33542 10.0547 3.33542C5.91302 3.33542 2.55469 6.69375 2.55469 10.8354C2.55469 14.9771 5.90469 18.3354 10.0547 18.3354C14.2047 18.3354 17.5547 14.9771 17.5547 10.8354C17.5547 9.07708 16.938 7.45208 15.913 6.16042ZM10.0547 16.6771C6.82969 16.6771 4.22135 14.0688 4.22135 10.8438C4.22135 7.61875 6.82969 5.01042 10.0547 5.01042C13.2797 5.01042 15.888 7.61875 15.888 10.8438C15.888 14.0688 13.2797 16.6771 10.0547 16.6771Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default TimerIcon;
