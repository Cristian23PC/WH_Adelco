import { FC } from 'react';
import { ConfirmationBusinessInformationForm } from '@adelco/web-components';
import { OnChangeStep, STEPS, Values } from '../useStep';
import { labelizeText } from 'helpers/utils/formatLocaleName';
import useCreateOrderContactRequest from 'frontastic/actions/adelco/cart/useCreateOrderContactRequest';

interface ConfirmationStepProps {
  values: Values;
  onChangeStep: OnChangeStep;
}
const ConfirmationStep: FC<ConfirmationStepProps> = ({
  onChangeStep,
  values
}) => {
  const { trigger } = useCreateOrderContactRequest();
  const handleNext = async () => {
    await trigger(values);
    onChangeStep(STEPS.SUCCESS);
  };
  const handlePrevious = () => {
    onChangeStep(STEPS.BILLING_ADDRESS);
  };

  const localityValue = values.addresses.billingAddress.locality;
  const locality =
    localityValue && localityValue !== values.addresses.billingAddress.commune
      ? labelizeText(localityValue)
      : undefined;

  return (
    <ConfirmationBusinessInformationForm
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

export default ConfirmationStep;
