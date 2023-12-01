import React, { type FC } from 'react';
import classNames from 'classnames';
import { Button } from '../../../../uikit/actions';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';

export const DEFAULT_LITERALS = {
  title: 'Cuenta creada con éxito',
  clientInfo: 'Información de Cliente',
  billingAddress: 'Dirección de facturación',
  signInLabel: 'Ingresar',
  helperText: 'Si necesitas ayuda comuníquese con nuestro',
  callCenter: 'call center'
};

export interface Props {
  'data-testid'?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onClick: VoidFunction;
  clientData: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  billingAddress: {
    region: string;
    commune: string;
    streetName: string;
    number: string;
  };
  callCenter: string;
}

const ConfirmationScreen: FC<Props> = ({
  'data-testid': dataTestId = 'success-screen',
  literals,
  onClick,
  clientData,
  billingAddress,
  callCenter
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const { isMobile } = useScreen();

  const callCenterLabel = [l.callCenter, callCenter].join(' ');

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'flex flex-col items-center mx-auto',
        'text-corporative-03 text-sm font-sans',
        'mt-4 w-full',
        'tablet:mt-6 tablet:w-[442px]',
        'desktop:w-[468px] desktop:mt-[50px]'
      )}
    >
      <div className="flex items-center">
        <p className="font-semibold text-base mb-4">{l.title}</p>
      </div>
      <div className="w-[277px] tablet:w-[300px]">
        <div className="flex flex-col pt-4 mb-2 gap-1">
          <span className="font-bold">{l.clientInfo}</span>
          <span>{clientData.name}</span>
          <span>{clientData.email}</span>
          <span>{clientData.phoneNumber}</span>
        </div>
        <div className="flex flex-col pt-4 tablet:mb-2 gap-1">
          <span className="font-bold">{l.billingAddress}</span>
          <span>{billingAddress.region}</span>
          <span>{billingAddress.commune}</span>
          <span>{billingAddress.streetName}</span>
          <span>{billingAddress.number}</span>
        </div>
        {isMobile && (
          <div className="mt-16 text-center flex flex-col text-xs">
            <span>{l.helperText}</span>
            <span className="font-bold">{callCenterLabel}</span>
          </div>
        )}
      </div>
      <div
        className={classNames(
          'w-full py-4 fixed bottom-0 px-4',
          'tablet:relative tablet:w-[300px]'
        )}
      >
        <Button
          className="w-full"
          size={isMobile ? 'md' : 'sm'}
          variant="secondary"
          onClick={onClick}
        >
          {l.signInLabel}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
