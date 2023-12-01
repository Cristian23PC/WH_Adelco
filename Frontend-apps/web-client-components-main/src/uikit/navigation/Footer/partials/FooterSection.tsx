import React, { type FC, type PropsWithChildren } from 'react';
import { type IconName } from '../../../../utils/types';
import { Icon } from '../../../feedback';

interface FooterSectionProps extends PropsWithChildren {
  iconName?: IconName;
}

const FooterSection: FC<FooterSectionProps> = ({ children, iconName }) => (
  <div className="flex gap-2 items-center">
    {iconName !== undefined && (
      <Icon width={18} name={iconName} className="fill-corporative-01" />
    )}
    <span>{children}</span>
  </div>
);

export default FooterSection;
