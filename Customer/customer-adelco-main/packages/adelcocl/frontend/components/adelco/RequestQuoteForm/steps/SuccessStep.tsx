import { Button, WarningScreen } from '@adelco/web-components';
import useScreen from 'helpers/hooks/useScreen';
import { useRouter } from 'next/router';

const SuccessStep = () => {
  const { isMobile } = useScreen();
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <WarningScreen
      variant="done"
      title="Solicitud creada con éxito. Serás contactado a la brevedad."
    >
      <Button
        size={isMobile ? 'md' : 'sm'}
        variant="secondary"
        block={isMobile}
        onClick={handleClick}
      >
        Entendido
      </Button>
    </WarningScreen>
  );
};

export default SuccessStep;
