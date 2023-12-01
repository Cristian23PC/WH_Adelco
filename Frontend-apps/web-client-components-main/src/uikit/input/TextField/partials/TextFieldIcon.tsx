import React, { type FC } from 'react';
import { type IconName } from '../../../../utils/types';
import { Icon } from '../../../feedback/Icon';

interface TextFieldIconProps {
  name?: IconName;
  showPasswordIcon: boolean;
  visible: boolean;
  className?: string;
  onClick: () => void;
  width?: number;
  height?: number;
}
const TextFieldIcon: FC<TextFieldIconProps> = ({
  name,
  showPasswordIcon,
  visible,
  onClick,
  className,
  width = 20,
  height = 20
}) => {
  if (showPasswordIcon) {
    return (
      <Icon
        data-testid={`input-password-${visible ? 'visible' : 'hidden'}-icon`}
        className={className}
        name={`${visible ? 'visibility' : 'visibility_off'}`}
        onClick={onClick}
        width={width}
        height={height}
      />
    );
  }
  if (name === undefined) {
    return null;
  }

  return (
    <Icon
      data-testid={`input-icon-${name}`}
      name={name}
      className={className}
      onClick={onClick}
      width={width}
      height={height}
    />
  );
};

export default TextFieldIcon;
