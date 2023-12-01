import React, { type FC } from 'react';
import { Icon } from '../../../feedback';
import { type IconName } from '../../../../utils/types';

export interface CategoryItemIconProps {
  iconName: IconName;
  title: string;
  onClick?: VoidFunction;
}
const CategoryItemIcon: FC<CategoryItemIconProps> = ({
  iconName,
  title,
  onClick
}) => {
  return (
    <div
      className="flex flex-col gap-1 justify-center px-1 py-2"
      onClick={onClick}
    >
      <div className="border rounded-full p-1 m-auto">
        <Icon name={iconName} width={32} height={32} />
      </div>
      <span className="text-xs line-clamp-1">{title}</span>
    </div>
  );
};

export default CategoryItemIcon;
