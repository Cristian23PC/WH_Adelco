import { FC } from 'react';
import { Button, Modal } from '@adelco/web-components';
import useScreen from 'helpers/hooks/useScreen';
import Link from 'next/link';
import useTrackCart from 'helpers/hooks/analytics/useTrackCart';
import { CartReturnType } from 'helpers/mappers/analyticsMapper';

interface NoLoggedModalProps {
  open: boolean;
  onClose: VoidFunction;
  onButtonClick: VoidFunction;
  cart: CartReturnType;
}
const NoLoggedModal: FC<NoLoggedModalProps> = ({
  open,
  onClose,
  onButtonClick,
  cart
}) => {
  const { isMobile, isDesktop } = useScreen();
  const { trackAskForAQuote } = useTrackCart();

  const handleOnRequestQuote = () => {
    trackAskForAQuote(cart);
  };

  return (
    <Modal onClose={onClose} open={open}>
      <div className="w-[300px]">
        <p className="pb-12 text-sm font-semibold">
          Para terminar tus compras debes iniciar sesión
        </p>
        <div className="mb-4 flex justify-center">
          <Button
            size={isMobile ? 'md' : 'sm'}
            block={!isDesktop}
            onClick={onButtonClick}
            variant="secondary"
          >
            Iniciar sesión
          </Button>
        </div>
        <span
          className="cursor-pointer underline"
          onClick={handleOnRequestQuote}
        >
          <Link href="/request-quote">
            o Solicita la atención de un ejecutivo
          </Link>
        </span>
      </div>
    </Modal>
  );
};

export default NoLoggedModal;
