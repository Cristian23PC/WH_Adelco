import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../../../uikit';
import { type IconName } from '../../../utils/types';

interface CustomIconProps {
  variant: 'primary' | 'secondary';
  iconName: IconName;
}
const CustomIcon: FC<CustomIconProps> = ({ variant, iconName }) => {
  return (
    <div
      className={classNames(
        'p-1 rounded-lg w-6 h-6 flex justify-center items-center',
        {
          'bg-corporative-01': variant === 'primary',
          'border border-snow': variant === 'secondary'
        }
      )}
    >
      <Icon height={16} width={16} className="shrink-0" name={iconName} />
    </div>
  );
};
export default CustomIcon;
