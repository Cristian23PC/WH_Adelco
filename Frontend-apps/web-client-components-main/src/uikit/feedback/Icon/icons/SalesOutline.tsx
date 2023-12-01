import React, { type FC } from 'react';
import { SALES_OUTLINE } from '../iconNames';
import type Props from './IconPropType';

const SalesOutlineIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${SALES_OUTLINE}`,
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
        d="M11.6641 5.41927V3.7526H8.33073V5.41927H11.6641ZM3.33073 7.08594V16.2526H16.6641V7.08594H3.33073ZM16.6641 5.41927C17.5891 5.41927 18.3307 6.16094 18.3307 7.08594V16.2526C18.3307 17.1776 17.5891 17.9193 16.6641 17.9193H3.33073C2.40573 17.9193 1.66406 17.1776 1.66406 16.2526L1.6724 7.08594C1.6724 6.16094 2.40573 5.41927 3.33073 5.41927H6.66406V3.7526C6.66406 2.8276 7.40573 2.08594 8.33073 2.08594H11.6641C12.5891 2.08594 13.3307 2.8276 13.3307 3.7526V5.41927H16.6641Z"
        className={className}
        fill="#1D1D1B"
      />
      <path
        d="M12 10.8H9.33333V11.4H11.3333C11.7 11.4 12 11.67 12 12V13.8C12 14.13 11.7 14.4 11.3333 14.4H10.6667V15H9.33333V14.4H8V13.2H10.6667V12.6H8.66667C8.3 12.6 8 12.33 8 12V10.2C8 9.87 8.3 9.6 8.66667 9.6H9.33333V9H10.6667V9.6H12V10.8Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default SalesOutlineIcon;
