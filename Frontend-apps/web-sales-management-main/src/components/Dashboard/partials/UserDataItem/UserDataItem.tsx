import { Icon } from '@adelco/web-components';
import { IconName } from '@adelco/web-components/dist/src/utils/types';
import { FC } from 'react';

export interface UserDataItemProps {
  icon: IconName;
  text: string;
}

const UserDataItem: FC<UserDataItemProps> = ({ icon, text }) => (
  <div className="flex gap-1 items-center w-full">
    <Icon name={icon} className="fill-corporative-01" />
    <span className="text-xs text-corporative-02-hover">{text}</span>
  </div>
);

export default UserDataItem;
