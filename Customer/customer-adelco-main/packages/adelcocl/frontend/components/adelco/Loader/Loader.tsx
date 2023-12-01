import React, { FC } from 'react';
import { Spinner } from '@adelco/web-components';

type Range_1_100 = '100' | `${Range_1_99}`;
type Range_1_99 = `${Range_1_9}${Range_0_9}` | Range_0_9;
type Range_0_9 = '0' | Range_1_9;
type Range_1_9 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export interface LoaderProps {
  opacity?: number;
  className?: string;
}

const Loader: FC<LoaderProps> = ({ opacity = 100, className }) => (
  <div className={`fixed z-[999] h-full w-full ${className}`}>
    <Spinner opacity={opacity.toString() as Range_1_100} />
  </div>
);

export default Loader;
