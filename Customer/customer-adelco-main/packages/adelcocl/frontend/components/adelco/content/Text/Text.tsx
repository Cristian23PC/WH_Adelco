import React from 'react';
import { variantClasses } from './Text.constants';
import classNames from 'classnames';
import { TextProps } from '../../../../../types/adelco/text/text';

const Text = ({
  variant = 'h1',
  align = 'left',
  hidden = 'false',
  description = ''
}: TextProps) => {
  const isHidden = hidden === 'true';

  const element = variant === 'paragraph1' || 'paragraph2' ? 'p' : variant;

  const defaultStyles = `
  text-${align}
  ${isHidden ? 'opacity-0 absolute' : 'opacity-1 static'}
`;

  return React.createElement(
    element,
    { className: classNames(defaultStyles, variantClasses[variant]) },
    description
  );
};

export default Text;
