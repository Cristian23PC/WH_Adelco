import React, { type FC } from 'react';
import { CO } from '../flagNames';
import type Props from './FlagPropType';

const CoFlag: FC<Props> = ({
  'data-testid': dataTestId = `flag-${CO}`,
  height = 20,
  width = 20,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-testid={dataTestId}
      {...props}
    >
      <mask id="mask0_2192_5106" maskUnits="userSpaceOnUse" x="0" y="0">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2192_5106)">
        <path d="M25 20V15L-4.99727 15V20H25Z" fill="#AD141F" />
        <path d="M25 15V10L-4.99727 10V15L25 15Z" fill="#1A2E81" />
        <path d="M25 10V0L-4.99727 0V10L25 10Z" fill="#F0C932" />
      </g>
    </svg>
  );
};

export default CoFlag;
