import React, { type FC } from 'react';
import { Button } from '../../../../uikit/actions';
import ThankYouScreenImage from './resources/ThankYouScreenImage';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { type LinkRenderer } from '../../../../utils/types';
import classNames from 'classnames';

const DEFAULT_LITERALS = {
  title: '¡Gracias por elegir Adelco!',
  text: 'Tu pedido se está procesando, te enviaremos un correo de confirmación.',
  buttonLabel: 'Aceptar'
};

export interface ThankYouScreenProps {
  'data-testid'?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
  linkRenderer: LinkRenderer;
  link?: string;
  className?: string;
}

const ThankYouScreen: FC<ThankYouScreenProps> = ({
  'data-testid': dataTestId = 'adelco-thank-you-page',
  literals,
  link = '/',
  linkRenderer,
  className
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div
      data-testid={dataTestId}
      className={classNames('grid gap-y-8 text-center mt-20 mb-4', className)}
    >
      <ThankYouScreenImage className="m-auto" />
      <h1 className="font-body font-semibold text-base text-corporative-03">
        {l.title}
      </h1>

      <p className="font-body font-normal text-sm text-corporative-03">
        {l.text}
      </p>

      <Button
        className="m-auto font-body whitespace-nowrap w-[130px] tablet:w-[100px]"
        size={isMobile ? 'md' : 'sm'}
        variant="secondary"
      >
        {linkRenderer(link, l.buttonLabel)}
      </Button>
    </div>
  );
};

export default ThankYouScreen;
