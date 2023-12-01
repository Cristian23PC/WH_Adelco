import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../../../../uikit';
import { type IconName } from '../../../../utils/types';
import { type ScreenSize } from '../../../../utils/hooks/useScreen/useScreen';
import { Benefit } from './partials/Benefit';
import { Button } from '../../../../uikit/actions';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';

export const DEFAULT_LITERALS = {
  title:
    'Es necesario que completes los datos de tu negocio para terminar tu registro.',
  benefitsTitle: 'Beneficios de ser un cliente registrado',
  customPrices: 'Podrás ver precios personalizados para tu negocio',
  freeShipping: 'Despacho gratis al comprar sobre nuestro pedido mínimo',
  customerSupport:
    'Atención personalizada por parte de nuestro equipo de ventas',
  continueAsGuest: 'Continuar como invitado',
  backToSignUp: 'Volver a registro'
};

export interface BenefitType {
  iconName: IconName;
  message: string;
}

export interface Props {
  'data-testid'?: string;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onKeepAsGuest: VoidFunction;
  onBackToSignUp: VoidFunction;
  benefits: BenefitType[];
}

const iconSize: { [key in keyof ScreenSize]: number } = {
  isMobile: 32,
  isTablet: 40,
  isDesktop: 50
};

const mainIconSize: { [key in keyof ScreenSize]: number } = {
  isMobile: 40,
  isTablet: 70,
  isDesktop: 100
};

const AbortedRegistration: FC<Props> = ({
  'data-testid': dataTestId = 'aborted-registration',
  literals,
  onBackToSignUp,
  onKeepAsGuest,
  benefits
}) => {
  const screenSize = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const size = Object.keys(screenSize).find(
    (key) => screenSize[key as keyof ScreenSize]
  );

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'flex flex-col items-center text-sm px-6 pb-4',
        'tablet:px-11'
      )}
    >
      <div className="w-full tablet:w-[500px] desktop:w-[800px] flex flex-col items-center">
        <Icon
          name="store_front"
          width={mainIconSize[size as keyof ScreenSize]}
          height={mainIconSize[size as keyof ScreenSize]}
          className="fill-corporative-01 my-2 tablet:mt-16 tablet:mb-4"
        />
        <p className="text-center font-bold tablet:text-lg">{l.title}</p>
        <p
          className={classNames(
            'text-center font-semibold tablet:text-base my-4',
            'tablet:mt-6 tablet:mb-12'
          )}
        >
          {l.benefitsTitle}
        </p>
      </div>
      <div
        className={classNames(
          'flex flex-col gap-4',
          'tablet:grid tablet:grid-cols-3',
          'desktop:w-[800px] desktop:gap-0'
        )}
      >
        {benefits.map((benefit, index) => (
          <Benefit
            iconName={benefit.iconName}
            key={index}
            message={benefit.message}
            iconSize={iconSize[size as keyof ScreenSize]}
          />
        ))}
      </div>
      <div
        className={classNames(
          'flex flex-col p-4 mt-4 gap-4 justify-center',
          'tablet:flex-row tablet:mt-12 tablet:gap-10'
        )}
      >
        <Button
          className="tablet:min-w-[200px] order-2 tablet:order-1"
          variant="tertiary"
          size={screenSize.isMobile ? 'md' : 'sm'}
          onClick={onKeepAsGuest}
        >
          {l.continueAsGuest}
        </Button>
        <Button
          className="tablet:min-w-[200px] order-1 tablet:order-2"
          variant="primary"
          size={screenSize.isMobile ? 'md' : 'sm'}
          onClick={onBackToSignUp}
        >
          {l.backToSignUp}
        </Button>
      </div>
    </div>
  );
};

export default AbortedRegistration;
