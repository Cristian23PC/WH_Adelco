import React, { type FC } from 'react';
import { type IconName } from '../../../utils/types';
import { Icon } from '../Icon';

interface InputMessageIconProps {
  name?: IconName;
  className?: string;
}
const InputMessageIcon: FC<InputMessageIconProps> = ({ name, className }) => {
  if (name === undefined) {
    return null;
  }

  return (
    <Icon
      data-testid={`adelco-input-message-icon-${name}`}
      name={name}
      className={className}
    />
  );
};

export default InputMessageIcon;
