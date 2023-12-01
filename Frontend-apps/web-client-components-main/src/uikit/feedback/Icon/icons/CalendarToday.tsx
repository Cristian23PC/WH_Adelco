import React, { type FC } from 'react';
import { CALENDAR_TODAY } from '../iconNames';
import type Props from './IconPropType';

const CalendarTodayIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${CALENDAR_TODAY}`,
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
        d="M16.6641 2.5026H15.8307V0.835938H14.1641V2.5026H5.83073V0.835938H4.16406V2.5026H3.33073C2.41406 2.5026 1.66406 3.2526 1.66406 4.16927V17.5026C1.66406 18.4193 2.41406 19.1693 3.33073 19.1693H16.6641C17.5807 19.1693 18.3307 18.4193 18.3307 17.5026V4.16927C18.3307 3.2526 17.5807 2.5026 16.6641 2.5026ZM16.6641 17.5026H3.33073V8.33594H16.6641V17.5026ZM16.6641 6.66927H3.33073V4.16927H16.6641V6.66927Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default CalendarTodayIcon;
