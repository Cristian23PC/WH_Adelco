import React, { type FC } from 'react';
import { EMOJI_EVENTS } from '../iconNames';
import type Props from './IconPropType';

const EmojiEventsIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${EMOJI_EVENTS}`,
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
        d="M15.8333 4.16667H14.1667V2.5H5.83333V4.16667H4.16667C3.25 4.16667 2.5 4.91667 2.5 5.83333V6.66667C2.5 8.79167 4.1 10.525 6.15833 10.7833C6.68333 12.0333 7.80833 12.975 9.16667 13.25V15.8333H5.83333V17.5H14.1667V15.8333H10.8333V13.25C12.1917 12.975 13.3167 12.0333 13.8417 10.7833C15.9 10.525 17.5 8.79167 17.5 6.66667V5.83333C17.5 4.91667 16.75 4.16667 15.8333 4.16667ZM4.16667 6.66667V5.83333H5.83333V9.01667C4.86667 8.66667 4.16667 7.75 4.16667 6.66667ZM10 11.6667C8.625 11.6667 7.5 10.5417 7.5 9.16667V4.16667H12.5V9.16667C12.5 10.5417 11.375 11.6667 10 11.6667ZM15.8333 6.66667C15.8333 7.75 15.1333 8.66667 14.1667 9.01667V5.83333H15.8333V6.66667Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default EmojiEventsIcon;
