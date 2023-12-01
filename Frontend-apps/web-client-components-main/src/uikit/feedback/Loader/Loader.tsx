import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';
import { Logo } from '../../../foundation/Logo';
import useScreen from '../../../utils/hooks/useScreen/useScreen';

export interface LoaderProps {
  label?: string;
  'data-testid'?: string;
  className?: string;
}

const Loader: FC<LoaderProps> = ({
  label = 'Cargando...',
  'data-testid': dataTestId = 'adelco-loader',
  className
}) => {
  const { isDesktop } = useScreen();

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'absolute top-0 right-0 flex items-center justify-center h-screen w-screen z-100 bg-white',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <Icon
          name="loader_animated"
          width={isDesktop ? 60 : 30}
          height={isDesktop ? 60 : 30}
          className="mb-4 fill-corporative-01"
        />
        <Logo width={isDesktop ? 150 : 100} />
        <span className="mt-4 text-xs desktop:text-base font-light">
          {label}
        </span>
      </div>
    </div>
  );
};

export default Loader;
