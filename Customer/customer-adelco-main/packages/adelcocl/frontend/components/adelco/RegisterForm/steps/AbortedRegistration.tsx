import { useRouter } from 'next/router';
import { AbortedRegistration } from '@adelco/web-components';
import useLogout from 'frontastic/actions/adelco/user/useLogout/useLogout';
import { STEPS, Values } from '../useStep';
import useGetBusinessUnits from 'frontastic/actions/adelco/businessUnit/useGetBusinessUnits';
import { useEffect } from 'react';
import useTrackRegister from 'helpers/hooks/analytics/useTrackRegister';

interface AbortedRegistration {
  onChangeStep: (step: string, values?: Values) => void;
}

const AbortedRegistrationStep = ({ onChangeStep }) => {
  const router = useRouter();
  const { trigger: logout } = useLogout();
  const { businessUnits } = useGetBusinessUnits();
  const { trackCompanyRegistrationDropOff } = useTrackRegister();

  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnKeepAsGuest = () => {
    trackCompanyRegistrationDropOff();
    router.push('/');
  };

  const handleContinueRegistration = () => {
    let newRegisterFormData = {};

    if (router.query.incompleteRegistration === 'true') {
      const BUInfo = businessUnits[0];
      const BUUserInfo = BUInfo?.associates?.[0]?.customer?.obj;
      const phone = BUUserInfo?.addresses?.[0]?.phone;

      newRegisterFormData = {
        BUInfo,
        phone: phone && Number(phone),
        firstName: BUUserInfo?.firstName,
        surname: BUUserInfo?.lastName,
        username: BUUserInfo?.email,
        rut: BUInfo?.rut.replace(/[^0-9]/g, ''),
        razonSocial: BUInfo?.name,
        password: router.query.password
      };
    }

    onChangeStep(STEPS.BUSINESS_INFORMATION, newRegisterFormData);
  };

  return (
    <AbortedRegistration
      onBackToSignUp={handleContinueRegistration}
      onKeepAsGuest={handleOnKeepAsGuest}
      benefits={[
        {
          iconName: 'sales_outline',
          message: 'Podrás ver precios personalizados para tu negocio'
        },
        {
          iconName: 'delivery',
          message: 'Despacho gratis al comprar sobre nuestro pedido mínimo'
        },
        {
          iconName: 'customized_atention',
          message:
            'Atención personalizada por parte de nuestro equipo de ventas'
        }
      ]}
    />
  );
};

export default AbortedRegistrationStep;
