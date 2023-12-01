import React, { type FC } from 'react';
import { type Literals } from '../CodeValidationForm';

interface RequestNewCodeProps {
  literals: Literals;
  onRequestNewCode?: () => void;
}
const RequestNewCode: FC<RequestNewCodeProps> = ({
  literals,
  onRequestNewCode
}) => {
  return (
    <div data-testid="adelco-request-new-code" className="mt-8">
      <p
        onClick={onRequestNewCode}
        className="font-semibold underline cursor-pointer"
      >
        {literals.requestNewCode}
      </p>
    </div>
  );
};

export default RequestNewCode;
