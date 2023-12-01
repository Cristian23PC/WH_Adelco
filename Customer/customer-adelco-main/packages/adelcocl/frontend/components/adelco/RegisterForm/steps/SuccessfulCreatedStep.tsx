import { useRouter } from 'next/router';
import { Button, WarningScreen } from '@adelco/web-components';
import useTrackRegister from 'helpers/hooks/analytics/useTrackRegister';

const SuccesfulCreatedStep = () => {
  const { push } = useRouter();
  const { trackCompanyRegistrationNewCompanySuccess } = useTrackRegister();

  const handleClick = () => {
    trackCompanyRegistrationNewCompanySuccess();
    push('/');
  };

  const buttonLabel = (
    <span className="px-[38.5px] tablet:px-8">Ir a comprar</span>
  );

  return (
    <WarningScreen variant="done" title="Tu cuenta fue creada con éxito">
      <Button
        onClick={handleClick}
        variant="secondary"
        size="sm"
        className="hidden tablet:block"
      >
        {buttonLabel}
      </Button>
      <Button
        onClick={handleClick}
        variant="secondary"
        className="tablet:hidden"
      >
        {buttonLabel}
      </Button>
    </WarningScreen>
  );
};

export default SuccesfulCreatedStep;
