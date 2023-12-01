import React, { type FC } from 'react';
import WarningScreen from '../WarningScreen';
import { type LinkRenderer } from '../../../../../utils/types';
import { Button } from '../../../../../uikit/actions';
import useScreen from '../../../../../utils/hooks/useScreen/useScreen';

export const DEFAULT_LITERALS = {
  header: (
    <span>
      En estos momentos <br /> no es posible crear tu cuenta
    </span>
  ),
  helpText: '¿Necesitas ayuda?',
  writeSocialMedia: 'Escríbenos por WhatsApp',
  callUs: 'o llámanos al',
  tryAgainLabel: 'Volver a intentarlo'
};

export interface UnableCreateAccountScreenProps {
  'data-testid'?: string;
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]: string | React.JSX.Element;
  };
  onTryAgain: VoidFunction;
  linkRenderer: LinkRenderer;
  callCenter: string;
  whatsAppLink: string;
}
const UnableCreateAccountScreen: FC<UnableCreateAccountScreenProps> = ({
  'data-testid': dataTestId = 'unable-create-account-screen',
  literals,
  onTryAgain,
  linkRenderer,
  callCenter,
  whatsAppLink
}) => {
  const { isMobile } = useScreen();

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const callCenterText = [l.callUs, callCenter].join(' ');

  return (
    <WarningScreen variant="error" title={l.header} data-testid={dataTestId}>
      <Button
        variant="secondary"
        onClick={onTryAgain}
        size={isMobile ? 'md' : 'sm'}
      >
        {l.tryAgainLabel}
      </Button>

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

export default UnableCreateAccountScreen;
