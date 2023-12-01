import { FC } from 'react';
import { useRouter } from 'next/router';
import { ConfirmationScreen, toast } from '@adelco/web-components';
import { Values } from '../useStep';
import useTrackRegister from 'helpers/hooks/analytics/useTrackRegister';

interface AccountSuccefulCreatedProps {
  values: Values;
}

const AccountSuccefulCreated: FC<AccountSuccefulCreatedProps> = ({
  values
}) => {
  const router = useRouter();
  const { trackCompanyRegistrationUserValidationSuccess } = useTrackRegister();

  const handleClick = async () => {
    router.push('/');
    trackCompanyRegistrationUserValidationSuccess();

    toast.success({
      title: '',
      text: 'Sesión iniciada'
    });
  };

  const clientData = {
    name: `${values.firstName} ${values.surname}`,
    email: values.username,
    phoneNumber: values.phone
  };

  const billingAddress = {
    region: values.billingAddress.region,
    commune: values.billingAddress.commune,
    city: values.billingAddress.city,
    streetName: values.billingAddress.streetName,
    number: values.billingAddress.streetNumber
  };

  return (
    <ConfirmationScreen
      onClick={handleClick}
      callCenter="+576006006363"
      clientData={clientData}
      billingAddress={billingAddress}
    />
  );
};

export default AccountSuccefulCreated;
