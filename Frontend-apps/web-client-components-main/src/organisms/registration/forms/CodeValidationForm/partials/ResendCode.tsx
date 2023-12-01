import React, { type FC } from 'react';
import { type Literals } from '../CodeValidationForm';

interface ResendCodeProps {
  literals: Literals;
  onResend: () => void;
}
const ResendCode: FC<ResendCodeProps> = ({ onResend, literals: l }) => {
  return (
    <div data-testid="adelco-resend-code">
      <p className="mb-1">{l.notSentMessage}</p>
      <p className="font-semibold underline cursor-pointer" onClick={onResend}>
        {l.resendText}
      </p>
    </div>
  );
};

export default ResendCode;
