import React, { type FC } from 'react';
import classnames from 'classnames';
import type IconProps from './icons/IconPropType';
import Icons from './Icons';
import { type IconName } from '../../../utils/types';

export interface Props {
  name: IconName;
  'data-testid'?: string;
  height?: number;
  width?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
  color?: string;
}

const Icon: FC<Props> = ({
  name,
  'data-testid': dataTestId,
  className,
  height = 20,
  width = 20,
  onClick,
  color
}) => {
  const IconComponent: FC<IconProps> = Icons[name];

  return (
    <IconComponent
      data-testid={dataTestId}
      className={classnames(
        {
          'cursor-pointer': onClick,
          'bg-gray-500': name.includes('dark')
        },
        className
      )}
      onClick={onClick}
      height={height}
      width={width}
      color={color}
    />
  );
};

export default Icon;
