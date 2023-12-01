import React from 'react';
import useZoneSelection from 'helpers/hooks/useZoneSelection';
import { useRouter } from 'next/router';
import { Values, STEPS } from '../useStep';
import { DeliveryAddressForm } from '@adelco/web-components';

const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface DeliveryAddressInformationStepProps {
  values: Partial<Values>;
  onChangeStep: (step: string, values?: Partial<Values>) => void;
}

const DeliveryAddressInformationStep: React.FC<
  DeliveryAddressInformationStepProps
> = ({ onChangeStep, values }) => {
  const router = useRouter();
  const {
    regions,
    communes,
    deliveryZones,
    handleRegionChange,
    handleCommuneChange
  } = useZoneSelection();

  const handleOnGoBack = async () => {
    router.back();
  };

  const handleSubmit = async (data) => {
    onChangeStep(STEPS.CONTACT_INFORMATION, data);
  };

  return (
    <DeliveryAddressForm
      regionList={regions}
      communeList={communes}
      localityList={deliveryZones}
      onSubmit={handleSubmit}
      onRegionChange={handleRegionChange}
      onCommuneChange={handleCommuneChange}
      onBack={handleOnGoBack}
      mapApiKey={mapApiKey}
      defaultValues={values}
    />
  );
};

export default DeliveryAddressInformationStep;
