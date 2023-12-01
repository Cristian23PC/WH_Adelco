import React from 'react';
import classNames from 'classnames';

import { Icon } from '../Icon';
import { Button } from '../../actions';

export interface FlyoutTooltipProps {
  message: string;
  'data-testid'?: string;
  onClose: VoidFunction;
  className?: string;
  onClick?: VoidFunction;
  buttonLabel?: string;
}

const FlyoutTooltip: React.FC<FlyoutTooltipProps> = ({
  message,
  'data-testid': dataTestId = 'adelco-flyout-tooltip',
  onClose,
  className,
  onClick,
  buttonLabel
}) => {
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'absolute',
        'top-[12.5px]',
        'w-[calc(100%-32px)]',
        'tablet:w-[282px]',
        'rounded-md',
        'flex flex-col',
        'p-4',
        'bg-snow',
        'z-10',
        'text-xs font-sans font-semibold text-corporative-03',
        'before:w-0 before:h-0',
        'before:border-x-transparent before:border-x-[12.5px]',
        'before:border-b-snow before:border-b-[12.5px]',
        'before:absolute before:-top-[12px] before:left-4',
        className
      )}
    >
      <div
        className={classNames('flex flex-row justify-between', {
          'pb-4': onClick
        })}
      >
        <span>{message}</span>
        <div>
          <Icon
            name="close"
            className="hidden tablet:block desktop:block"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          />
          <Icon
            name="close"
            className="tablet:hidden"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          />
        </div>
      </div>
      {onClick != null && (
        <Button
          onClick={(event) => {
            event.stopPropagation();
            onClose();
            onClick();
          }}
          variant="secondary"
          className="w-full text-xs tablet:text-xs"
          size="sm"
          iconName="person_pin_circle"
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default FlyoutTooltip;
