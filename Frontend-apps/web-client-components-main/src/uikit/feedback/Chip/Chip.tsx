import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';
type Size = 'small' | 'medium' | 'large';
export interface ChipProps {
  label: string;
  'data-testid'?: string;
  size?: Size;
  active?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
}

const Chip: FC<ChipProps> = ({
  label,
  'data-testid': dataTestId = 'adelco-chip',
  size = 'small',
  active = false,
  onClose,
  onClick,
  className
}) => {
  const sizeClass: Record<string, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };
  const bgColor = active
    ? 'bg-corporative-03 border-corporative-03'
    : 'bg-white border-corporative-02-hover';

  const textColor = active ? 'text-white' : 'text-corporative-03';
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'inline-flex items-center px-2 py-1 rounded-[30px] border font-sans',
        { 'hover:cursor-pointer': onClick != null },
        bgColor,
        textColor,
        sizeClass[size],
        className
      )}
      onClick={onClick}
    >
      {label}
      {onClose != null && (
        <Icon
          name="close"
          width={16}
          height={16}
          color={textColor}
          className={classNames(
            'ml-2 flex-shrink-0 inline-flex items-center justify-center',
            'hover:cursor-pointer fill-current'
          )}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default Chip;
