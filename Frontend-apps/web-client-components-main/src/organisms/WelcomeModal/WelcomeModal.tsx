import React, { type FC } from 'react';
import { Modal, Button, Icon } from '../../uikit';
import useScreen from '../../utils/hooks/useScreen/useScreen';
import BackgroundMobile from './partials/BackgroundMobile';
import BackgroundTablet from './partials/BackgroundTablet';
import BackgroundDesktop from './partials/BackgroundDesktop';
import IllustrationMobile from './partials/IllustrationMobile';
import IllustrationTablet from './partials/IllustrationTablet';

import { type LinkRenderer } from '../../utils/types';

export const DEFAULT_LITERALS = {
  title1: '¡Hola!',
  title2: 'Somos el nuevo Adelco',
  subtitle:
    'Te invitamos a una <strong>nueva experiencia</strong> de compra <strong>para tu negocio</strong>',
  registerButton: 'Regístrate',
  haveAccount: '¿Ya tienes cuenta?',
  haveAccountLink: 'Inicia sesión'
};

export interface WelcomeModalProps {
  open?: boolean;
  onClose: VoidFunction;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  linkRenderer: LinkRenderer;
  registerLink: string;
  onClickLogin?: () => void;
}

const WelcomeModal: FC<WelcomeModalProps> = ({
  open = false,
  onClose,
  literals = {},
  linkRenderer,
  registerLink,
  onClickLogin
}) => {
  const { isMobile, isTablet, isDesktop } = useScreen();

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <Modal
      id="login-modal"
      open={open}
      onClose={onClose}
      showClose={false}
      className="rounded-[24px] tablet:rounded-[16px]"
      style={
        isMobile
          ? { width: '288px', paddingLeft: '0px', paddingRight: '0px' }
          : {}
      }
    >
      {isMobile && <BackgroundMobile />}
      {isTablet && <BackgroundTablet />}
      {isDesktop && <BackgroundDesktop />}
      <Icon
        name="close"
        onClick={onClose}
        width={30}
        height={30}
        className="absolute right-4 top-4"
      />
      <div className="flex flex-col w-[256px] tablet:w-[300px] items-center gap-4 tablet:gap-8">
        {isMobile && <IllustrationMobile />}
        {!isMobile && <IllustrationTablet />}
        <div className="tablet:pt-0 desktop:text-sm ">
          <p className="font-bold tablet:text-xl tablet:font-title tablet:font-normal tablet:mt-4 desktop:mt-8">
            {l.title1}
          </p>
          <p className="font-bold tablet:text-xl tablet:font-title tablet:font-normal">
            {l.title2}
          </p>
          <p
            className="mt-4 text-sm"
            dangerouslySetInnerHTML={{ __html: l.subtitle }}
          />
        </div>
        <div className="w-full">
          {linkRenderer(
            registerLink,
            <Button
              block
              className="mt-4 mb-2 tablet:my-0"
              variant="secondary"
              type="submit"
              size={isMobile ? 'md' : 'sm'}
            >
              {l.registerButton}
            </Button>
          )}
        </div>
        <div className="text-sm">
          <div>
            {l.haveAccount}
            <span
              className="ml-1 font-bold underline hover:cursor-pointer"
              onClick={onClickLogin}
            >
              {l.haveAccountLink}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
