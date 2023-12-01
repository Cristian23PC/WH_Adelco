import React, { type FC } from 'react';
import { TEXT_SNIPPET } from '../iconNames';
import type Props from './IconPropType';

const TextSnippetIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${TEXT_SNIPPET}`,
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
        d="M11.8083 4.16667L15.8333 8.19167V15.8333H4.16667V4.16667H11.8083ZM11.8083 2.5H4.16667C3.25 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V8.19167C17.5 7.75 17.325 7.325 17.0083 7.01667L12.9833 2.99167C12.675 2.675 12.25 2.5 11.8083 2.5ZM5.83333 12.5H14.1667V14.1667H5.83333V12.5ZM5.83333 9.16667H14.1667V10.8333H5.83333V9.16667ZM5.83333 5.83333H11.6667V7.5H5.83333V5.83333Z"
        className={className}
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default TextSnippetIcon;
