import React from 'react';
import {
  toast as hotToast,
  type Toast,
  Toaster,
  type ToastPosition
} from 'react-hot-toast';
import { Icon } from '../Icon';
import { type IconName } from '../../../utils/types';
import classNames from 'classnames';

export interface ToastProps {
  'data-testid'?: string;
  title?: string;
  text: string;
  iconName?: IconName;
  className?: string;
  position?: ToastPosition;
}

export interface ToastComponentProps extends ToastProps {
  type: 'success' | 'warning' | 'failure';
  t: Toast;
}

const bgClassName = {
  success: { normal: 'bg-success', light: 'bg-success-light' },
  warning: { normal: 'bg-warning', light: 'bg-warning-light' },
  failure: { normal: 'bg-failure', light: 'bg-failure-light' }
};
export const ToastComponent: React.FC<ToastComponentProps> = ({
  'data-testid': dataTestId = 'adelco-toast',
  title,
  text,
  iconName,
  className,
  type,
  t
}) => {
  const isIconNamePresent = iconName !== undefined;

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        t.visible ? 'animate-enter' : 'animate-leave',
        bgClassName[type].light,
        ' w-[304px] min-h-[48px] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 items-center',
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
            <p
              className="font-body text-xs"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
          <div className="flex-shrink-0 m-auto">
            <Icon
              data-testid="adelco-toast-close-icon"
              className="m-auto"
              width={20}
              height={20}
              name="close"
              onClick={() => {
                hotToast.remove(t.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const toast = {
  success: ({ position, ...props }: ToastProps) => {
    hotToast.custom((t) => <ToastComponent {...props} type="success" t={t} />, {
      position
    });
  },
  error: ({ position, ...props }: ToastProps) => {
    hotToast.custom((t) => <ToastComponent {...props} type="failure" t={t} />, {
      position
    });
  },
  warning: ({ position, ...props }: ToastProps) => {
    hotToast.custom((t) => <ToastComponent {...props} type="warning" t={t} />, {
      position
    });
  }
};

export { toast, Toaster };
