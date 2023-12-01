import React, { type FC } from 'react';
import { type RenderLogoProps } from './resources/LogoTypes';
import WhiteLogo from './resources/WhiteLogo';
import BlackLogo from './resources/BlackLogo';
import CorporativeLogo from './resources/CorporativeLogo';
import WhiteIsotype from './resources/WhiteIsotype';
import BlackIsotype from './resources/BlackIsotype';
import CorporativeIsotype from './resources/CorporativeIsotype';

const DEFAULT_HEIGHT = 19;
const DEFAULT_WIDTH = 80;

type LogoVariant =
  | 'white'
  | 'black'
  | 'corporative'
  | 'white-isotype'
  | 'black-isotype'
  | 'corporative-isotype';

type LogoSelector = {
  [key in LogoVariant]: FC<RenderLogoProps>;
};

const Logos: LogoSelector = {
  white: ({ width, height, className }) => (
    <WhiteLogo width={width} height={height} className={className} />
  ),
  black: ({ width, height, className }) => (
    <BlackLogo width={width} height={height} className={className} />
  ),
  corporative: ({ width, height, className }) => (
    <CorporativeLogo width={width} height={height} className={className} />
  ),
  'white-isotype': ({ width, height, className }) => (
    <WhiteIsotype width={width} height={height} className={className} />
  ),
  'black-isotype': ({ width, height, className }) => (
    <BlackIsotype width={width} height={height} className={className} />
  ),
  'corporative-isotype': ({ width, height, className }) => (
    <CorporativeIsotype width={width} height={height} className={className} />
  )
};

export interface LogoProps {
  variant?: LogoVariant;
  width?: number;
  height?: number;
  className?: string;
}
const Logo: FC<LogoProps> = ({
  variant = 'corporative',
  width = DEFAULT_WIDTH,
  height,
  className
}) => {
  const logoHeight = height ?? (width * DEFAULT_HEIGHT) / DEFAULT_WIDTH;
  const SelectedLogo = Logos[variant];

  return (
    <SelectedLogo width={width} height={logoHeight} className={className} />
  );
};

export default Logo;
