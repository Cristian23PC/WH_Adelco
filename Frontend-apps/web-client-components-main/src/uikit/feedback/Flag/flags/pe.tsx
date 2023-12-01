import React, { type FC } from 'react';
import { PE } from '../flagNames';
import type Props from './FlagPropType';

const PeFlag: FC<Props> = ({
  'data-testid': dataTestId = `flag-${PE}`,
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
      <mask id="mask0_2192_5109" maskUnits="userSpaceOnUse" x="0" y="0">
        <path
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2192_5109)">
        <path
          d="M4.98554 -0.0234375H-5.03906V20.0284H4.98554V-0.0234375Z"
          fill="#C00E1A"
        />
        <path
          d="M15.0089 -0.0234375H4.98438V20.0284H15.0089V-0.0234375Z"
          fill="white"
        />
        <path
          d="M25.0402 -0.0234375H15.0156V20.0284H25.0402V-0.0234375Z"
          fill="#C00E1A"
        />
      </g>
    </svg>
  );
};

export default PeFlag;
