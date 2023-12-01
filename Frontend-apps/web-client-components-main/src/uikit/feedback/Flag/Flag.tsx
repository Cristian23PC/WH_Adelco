import React, { type FC, type SVGAttributes } from 'react';
import classnames from 'classnames';
import type FlagProps from './flags/FlagPropType';
import Flags from './Flags';
import { type FlagName } from '../../../utils/types';

export interface Props extends SVGAttributes<SVGElement> {
  name: FlagName;
  'data-testid'?: string;
  height?: number;
  width?: number;
  className?: string;
}

const Flag: FC<Props> = ({
  name,
  'data-testid': dataTestId,
  className,
  height = 20,
  width = 20,
  onClick,
  ...props
}) => {
  const FlagComponent: FC<FlagProps> = Flags[name];

  return (
    <FlagComponent
      data-testid={dataTestId}
      className={classnames(className, { 'cursor-pointer': onClick })}
      onClick={onClick}
      height={height}
      width={width}
      {...props}
    />
  );
};

export default Flag;
