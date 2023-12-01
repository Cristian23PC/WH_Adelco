import { FC } from 'react';
import { BillingAddressForm } from '@adelco/web-components';
import useZoneSelection from '../../../../helpers/hooks/useZoneSelection';
import { STEPS, Values } from '../useStep';

const mockSteps = [
  { title: 'Información de negocios', step: 1, isComplete: true },
  { title: 'Información de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

interface BusinessInformationStepProps {
  values: Values;
  onChangeStep: (step: string, values?: Values) => void;
}
const BillingInformationStep: FC<BusinessInformationStepProps> = ({
  values,
  onChangeStep
}) => {
  const {
    regions,
    communes,
    deliveryZones,
    handleRegionChange,
    handleCommuneChange
  } = useZoneSelection();

  const handleSubmit = async (data) => {
    const addresses = {
      id: values.BUInfo.id,
      name: values.razonSocial,
      tradeName: values.address.localName,
      address: {
        country: 'CL',
        apartment: values.address.apartment,
        city: values.address.locality,
        streetName: values.address.street,
        otherInformation: values.address.additionalInformation,
        ...values.address
      },
      billingAddress: {}
    };
    if (data.useBusinessAddress) {
      addresses.billingAddress = addresses.address;
    } else {
      addresses.billingAddress = {
        country: 'CL',
        apartment: data.apartment,
        city: data.locality,
        streetName: data.street,
        otherInformation: data.additionalInformation,
        ...data
      };
    }

    onChangeStep(STEPS.CONFIRMATION_INFORMATION, { addresses });
  };

  const handleBack = () => {
    onChangeStep(STEPS.BUSINESS_INFORMATION);
  };

  return (
    <BillingAddressForm
      regionList={regions}
      communeList={communes}
      onCommuneChange={handleCommuneChange}
      onRegionChange={handleRegionChange}
      localityList={deliveryZones}
      onSubmit={handleSubmit}
      onBack={handleBack}
      steps={mockSteps}
      businessAddressValues={values.address}
      defaultValues={values.addresses?.billingAddress}
    />
  );
};

export default BillingInformationStep;
