import { FC } from 'react';
import { Notification, UserEmailForm } from '@adelco/web-components';
import { OnChangeStep, STEPS } from '../useStep';
import { useRouter } from 'next/router';

interface HomeStepProps {
  onChangeStep: OnChangeStep;
}

const HomeStep: FC<HomeStepProps> = ({ onChangeStep }) => {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    onChangeStep(STEPS.BUSINESS_INFORMATION, formData);
  };

  const handleBack = () => {
    router.back();
  };

  const component = (
    <Notification
      iconName="error"
      className="w-full"
      title="Advertencia"
      text="Los precios podrían sufrir variaciones"
      type="warning"
    />
  );

  return (
    <UserEmailForm
      literals={{
        clientTitle: 'Déjanos tus datos y te contactaremos para crear el pedido'
      }}
      onSubmit={handleSubmit}
      onBack={handleBack}
      externalComponent={component}
    />
  );
};

export default HomeStep;
