import React from 'react';
import { Icon } from '../../feedback';
import classNames from 'classnames';
import { type IconName, type LinkRenderer } from '../../../utils/types';

type LinkVariants = 'primary' | 'secondary';
type Variants = { [key in LinkVariants]: string };

const variants: Variants = {
  primary:
    'text-corporative-03 ring-inset ring-silver ' +
    'focus:ring-corporative-02 ' +
    'disabled:text-corporative-02 disabled:opacity-30',
  secondary:
    'text-white bg-corporative-03 ' +
    'hover:bg-corporative-02-hover ' +
    'active:bg-corporative-02 ' +
    'focus:ring focus:ring-inset focus:ring-corporative-02-hover ' +
    'disabled:bg-corporative-02 disabled:opacity-30'
};

export interface LinkProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
  url: string;
  iconName?: IconName;
  variant?: LinkVariants;
  disabled?: boolean;
  linkRenderer: LinkRenderer;
}

const Link: React.FC<LinkProps> = ({
  'data-testid': dataTestId = 'adelco-link',
  iconName,
  url = '#',
  variant = 'primary',
  children = '',
  disabled = false,
  linkRenderer
}) => {
  const isIconNamePresent = iconName !== undefined;

  const content = (
    <button
      data-testid={dataTestId}
      disabled={disabled}
      className={classNames(
        'flex text-xs w-fit items-center py-1 px-2 gap-2 rounded-[3px] border-0 font-semibold underline',
        variants[variant]
      )}
    >
      {children}
      {isIconNamePresent && (
        <Icon
          name={iconName}
          width={16}
          height={16}
          className={classNames(
            'stroke-2',
            variant === 'secondary' ? 'fill-white' : ''
          )}
        />
      )}
    </button>
  );

  return linkRenderer(url, content);
};
export default Link;
