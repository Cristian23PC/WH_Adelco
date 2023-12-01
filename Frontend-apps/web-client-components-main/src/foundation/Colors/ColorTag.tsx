/* eslint-disable import/no-extraneous-dependencies */
import React, { type FC } from 'react';

export interface Props {
  color?: string;
  name?: string;
}

export const ColorTag: FC<Props> = ({ color, name }) => (
  <div className="mr-4 my-4 flex flex-col w-[180px]">
    <svg width="70" height="70">
      <rect width="70" height="70" rx="5" fill={color} />
    </svg>
    <div className="my-3">
      <h6>{name}</h6>
      <p className="text-sm text-moon">{color}</p>
    </div>
  </div>
);

export default ColorTag;
