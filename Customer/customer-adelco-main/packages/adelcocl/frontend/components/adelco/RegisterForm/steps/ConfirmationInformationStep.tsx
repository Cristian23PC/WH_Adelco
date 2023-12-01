import { FC } from 'react';
import { ConfirmationBusinessInformationForm } from '@adelco/web-components';
import useBusinessUnit from 'frontastic/actions/adelco/businessUnit/useBusinessUnit/useBusinessUnit';
import useLogin from 'frontastic/actions/adelco/user/useLogin/useLogin';
import { STEPS, Values } from '../useStep';
import { labelizeText } from 'helpers/utils/formatLocaleName';
import useUser from 'frontastic/actions/adelco/user/useUser';

const stepsData = [
  { title: 'Información de negocios', step: 1, isComplete: true },
  { title: 'Información de facturación', step: 2, isComplete: true },
  { title: 'Confirmación', step: 3 }
];

interface ConfirmationInformationStepProps {
  values: Values;
  onChangeStep: (step: string, values?: Values) => void;
}
const ConfirmationInformationStep: FC<ConfirmationInformationStepProps> = ({
  onChangeStep,
  values
}) => {
  const { trigger: updateBusinessUnit } = useBusinessUnit();
  const { trigger: login } = useLogin();
  const { user } = useUser();

  const handleNext = async () => {
    if (!user?.loggedIn) {
      await login({ username: values.username, password: values.password });
    }

    await updateBusinessUnit({
      ...values.addresses
    });

    await login({ username: values.username, password: values.password });

    onChangeStep(STEPS.SUCCESSFUL_CREATED_ACCOUNT);
  };
  const handlePrevious = () => {
    onChangeStep(STEPS.BILLING_INFORMATION);
  };

  const localityValue = values.addresses.billingAddress.locality;
  const locality =
    localityValue && localityValue !== values.addresses.billingAddress.commune
      ? labelizeText(localityValue)
      : undefined;

  return (
    <ConfirmationBusinessInformationForm
      steps={stepsData}
      customerInformation={{
        name: `${values.firstName} ${values.surname}`,
        email: values.username,
        phone: values.phone
      }}
      billingAddress={{
        region: labelizeText(values.addresses.billingAddress.region),
        commune: labelizeText(values.addresses.billingAddress.commune),
        locality,
        street: values.addresses.billingAddress.street,
        number: values.addresses.billingAddress.streetNumber
      }}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
};

export default ConfirmationInformationStep;
