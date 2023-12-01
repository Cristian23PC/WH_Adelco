import React, { type FC } from 'react';
import { Icon } from '../../../feedback';
import { type IconName } from '../../../../utils/types';

interface SocialIconLinkProps {
  link: string;
  iconName: IconName;
}

const SocialIconLink: FC<SocialIconLinkProps> = ({ link, iconName }) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <Icon name={iconName} className="fill-corporative-01" />
    </a>
  );
};

export default SocialIconLink;
