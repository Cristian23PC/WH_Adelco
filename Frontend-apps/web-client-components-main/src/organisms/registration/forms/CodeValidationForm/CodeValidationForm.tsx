import React, { type FC } from 'react';
import { InputCode } from '../../../../uikit/input';
import RequestNewCode from './partials/RequestNewCode';
import ResendCode from './partials/ResendCode';

const DEFAULT_LITERALS = {
  bodyMessage:
    'Por favor ingrese el código de validación que fue enviado a su correo:',
  notSentMessage: '¿No recibiste el código?',
  resendText: 'Enviar de nuevo',
  requestNewCode: 'Solicitar nuevo código'
};

export type Literals = {
  [key in keyof typeof DEFAULT_LITERALS]?: string;
};

export interface CodeValidationFormProps {
  'data-testid'?: string;
  literals?: Literals;
  emailAddress: string;
  errorMessage?: string;
  limitExceeded?: boolean;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onRequestNewCode?: () => void;
}
const CodeValidationForm: FC<CodeValidationFormProps> = ({
  'data-testid': dataTestId = 'adelco-code-validation-form',
  limitExceeded = false,
  literals,
  emailAddress,
  errorMessage,
  onSubmit,
  onResend,
  onRequestNewCode
}) => {
  const l = { ...DEFAULT_LITERALS, ...literals };

  return (
    <div
      data-testid={dataTestId}
      className="text-center text-xs text-corporative-03"
    >
      <p className="mb-2.5">{l.bodyMessage}</p>
      <p className="font-bold mb-4 tablet:mb-6 desktop:mb-4">{emailAddress}</p>
      <InputCode
        onSubmit={onSubmit}
        className="mb-8 tablet:mb-6 desktop:mb-4"
        errorMessage={errorMessage}
      />
      {!limitExceeded && <ResendCode onResend={onResend} literals={l} />}
      {limitExceeded && (
        <RequestNewCode literals={l} onRequestNewCode={onRequestNewCode} />
      )}
    </div>
  );
};

export default CodeValidationForm;
