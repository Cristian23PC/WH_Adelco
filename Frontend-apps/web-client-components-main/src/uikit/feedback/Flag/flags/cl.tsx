import React, { type FC } from 'react';
import { CL } from '../flagNames';
import type Props from './FlagPropType';

const ClFlag: FC<Props> = ({
  'data-testid': dataTestId = `flag-${CL}`,
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
      <mask id="mask0_2192_5101" maskUnits="userSpaceOnUse" x="0" y="0">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2192_5101)">
        <path d="M30.0374 10H-0.0390625V20.0246H30.0374V10Z" fill="#C00E1A" />
        <path
          d="M30.0374 -0.0234375H-0.0390625V10.0011H30.0374V-0.0234375Z"
          fill="white"
        />
        <path
          d="M9.98551 -0.0234375H-0.0390625V10.0011H9.98551V-0.0234375Z"
          fill="#322C7F"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.97261 2.71875L5.53241 4.45551L7.35655 4.45278L5.87922 5.52323L6.44722 7.25725L4.97261 6.18134L3.49801 7.25725L4.066 5.52323L2.58594 4.45278L4.41281 4.45551L4.97261 2.71875Z"
          fill="white"
        />
        <path
          d="M30.0363 -0.0234375H9.98438V0.0175237H30.0363V-0.0234375Z"
          fill="#6F6F6E"
        />
      </g>
    </svg>
  );
};

export default ClFlag;
