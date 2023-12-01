import classNames from 'classnames';
import React, { type ReactNode, forwardRef } from 'react';
import { Icon } from '../../feedback/Icon';

export interface AccordionProps {
  title: string;
  open: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'secondary';
  'data-testid'?: string;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      title,
      open,
      onClick,
      className,
      variant = 'default',
      'data-testid': dataTestId = 'adelco-accordion'
    },
    ref
  ) => {
    const isDefaultVariant = variant === 'default';

    return (
      <div
        ref={ref}
        data-testid={dataTestId}
        className={classNames(
          'overflow-hidden transition-all duration-200 ease-in-out',
          {
            'max-h-[46px]': !open && isDefaultVariant,
            'max-h-[30px]': !open && !isDefaultVariant
          },
          { 'max-h-[500vh]': open },
          className
        )}
      >
        <div
          onClick={onClick}
          className={classNames(
            'flex items-center justify-between cursor-pointer rounded-md text-sm desktop:text-xs',
            {
              'font-semibold': open && isDefaultVariant,
              'bg-snow px-4 text-corporative-03 h-[46px]': isDefaultVariant,
              'text-corporative-02-hover h-[30px]': !isDefaultVariant
            }
          )}
        >
          {title}
          <span
            className={classNames('transition-all duration-200 ease-in-out', {
              'rotate-180': open
            })}
          >
            <Icon name="arrow_s_down" width={30} height={30} />
          </span>
        </div>
        {children}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

export default Accordion;
