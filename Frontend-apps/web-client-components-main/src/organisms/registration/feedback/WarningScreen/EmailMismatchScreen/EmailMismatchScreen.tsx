import React, { type FC } from 'react';
import { type LinkRenderer } from '../../../../../utils/types';
import WarningScreen from '../WarningScreen';

export const DEFAULT_LITERALS = {
  header: (
    <span>
      El correo ingresado no esta asociado <br /> al Rut de la empresa
    </span>
  ),
  helpText: '¿Necesitas ayuda?',
  writeSocialMedia: 'Escríbenos por WhatsApp',
  callUs: 'o llámanos al',
  loginLabel: 'Iniciar Sesión'
};

export interface EmailMismatchScreenProps {
  'data-testid'?: string;
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]: string | React.JSX.Element;
  };
  linkRenderer: LinkRenderer;
  callCenter: string;
  whatsAppLink: string;
}
const EmailMismatchScreen: FC<EmailMismatchScreenProps> = ({
  'data-testid': dataTestId = 'email-mismatch-screen',
  literals,
  linkRenderer,
  whatsAppLink,
  callCenter
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const callCenterText = [l.callUs, callCenter].join(' ');

  return (
    <WarningScreen variant="error" title={l.header} data-testid={dataTestId}>
      <div className="flex flex-col gap-2">
        <span>{l.helpText}</span>
        <span className="font-semibold underline">
          {linkRenderer(whatsAppLink, l.writeSocialMedia, '_blank')}
        </span>
        <span>{callCenterText}</span>
      </div>
    </WarningScreen>
  );
};

export default EmailMismatchScreen;
