import React from 'react';
import classNames from 'classnames';

export interface BadgeProps {
  size?: 'sm' | 'md';
  children: any;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ size = 'md', children, className }) => {
  return (
    <div
      className={classNames(
        'font-bold',
        'text-xs',
        'leading-4',
        'rounded-md',
        'w-fit',
        'font-sans',
        'bg-corporative-01',
        {
          'p-1': size === 'md'
        },
        className
      )}
      data-testid="adelco-badge"
    >
      <span className="px-0.5">{children}</span>
    </div>
  );
};

export default Badge;
