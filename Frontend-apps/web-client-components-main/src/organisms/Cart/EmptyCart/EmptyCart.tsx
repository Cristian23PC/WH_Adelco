import React, { type FC } from 'react';
import { Button } from '../../../uikit/actions';
import EmptyCartImage from './resources/EmptyCartImage';
import useScreen from '../../../utils/hooks/useScreen/useScreen';
import { type LinkRenderer } from '../../../utils/types';

const DEFAULT_LITERALS = {
  title: 'Tu carro está vacio',
  mobileText: 'Puedes añadir productos que necesites comprar.',
  text: 'No tienes productos en tu carro, puedes añadir los productos que necesites comprar.',
  buttonLabel: 'Seleccionar Productos'
};

export interface EmptyCartProps {
  'data-testid'?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
  linkRenderer: LinkRenderer;
  link?: string;
}

const EmptyCart: FC<EmptyCartProps> = ({
  'data-testid': dataTestId = 'adelco-empty-cart',
  literals,
  link = '/',
  linkRenderer
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div data-testid={dataTestId} className="grid gap-y-4 text-center">
      <EmptyCartImage className="m-auto" />
      <h1 className="font-title font-bold text-xl">{l.title}</h1>

      <p className="font-body text-sm">{isMobile ? l.mobileText : l.text}</p>
      <Button
        className="m-auto font-body whitespace-nowrap"
        size={isMobile ? 'md' : 'sm'}
      >
        {linkRenderer(link, l.buttonLabel)}
      </Button>
    </div>
  );
};

export default EmptyCart;
