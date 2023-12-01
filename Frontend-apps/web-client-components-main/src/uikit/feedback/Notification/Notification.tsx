import classNames from 'classnames';
import React, { type FC } from 'react';
import { type IconName } from '../../../utils/types';
import { Icon } from '../Icon';

export interface NotificationProps {
  'data-testid'?: string;
  title: string;
  text: string;
  type: 'success' | 'warning' | 'failure';
  className?: string;
  iconName?: IconName;
  withShadow?: boolean;
}

const bgClassName = {
  success: { normal: 'bg-success', light: 'bg-success-light' },
  warning: { normal: 'bg-warning', light: 'bg-warning-light' },
  failure: { normal: 'bg-failure', light: 'bg-failure-light' }
};

const Notification: FC<NotificationProps> = ({
  'data-testid': dataTestId = 'adelco-notification',
  withShadow = false,
  className,
  type,
  iconName,
  title,
  text
}) => {
  const isIconNamePresent = !!iconName;

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        bgClassName[type].light,
        { 'shadow-lg': withShadow },
        'w-[304px] h-[48px] rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 items-center',
        className
      )}
    >
      <div className="relative flex-1 w-0 p-2">
        <div className="relative flex items-center">
          <div className="flex-shrink-0 m-auto">
            <div>
              {isIconNamePresent && (
                <Icon
                  data-testid="adelco-toast-icon"
                  width={24}
                  height={24}
                  name={iconName}
                  color="white"
                  className={classNames(
                    bgClassName[type].normal,
                    'rounded-lg fill-white p-1'
                  )}
                />
              )}
            </div>
          </div>
          <div className="ml-2 flex-1">
            {title && <p className="font-semibold text-xs">{title}</p>}
            <p className="font-body text-xs">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
