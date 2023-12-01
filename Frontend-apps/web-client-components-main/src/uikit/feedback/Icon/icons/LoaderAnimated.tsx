import React, { type FC } from 'react';
import { LOADER_ANIMATED } from '../iconNames';

import type Props from './IconPropType';

const LoaderAnimatedIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${LOADER_ANIMATED}`,
  className,
  width = 20,
  height = 20,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      {...props}
      data-testid={dataTestId}
    >
      <g transform="rotate(0 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.875s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(45 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.75s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(90 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.625s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(135 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(180 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.375s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(225 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.25s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(270 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="-0.125s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
      <g transform="rotate(315 50 50)">
        <rect x="45" y="-0.5" rx="5" ry="6.25" width="10" height="25">
          <animate
            attributeName="opacity"
            values="1;0"
            keyTimes="0;1"
            dur="1s"
            begin="0s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
};

export default LoaderAnimatedIcon;
