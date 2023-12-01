import { FC } from 'react';
import Link from 'next/link';
import { BusinessInformationForm } from '@adelco/web-components';
import useZoneSelection from '../../../../helpers/hooks/useZoneSelection';
import { STEPS, Values } from '../useStep';

const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const linkRenderer = (link, label) => <Link href={link}>{label}</Link>;

interface BusinessInformationStepProps {
  values: Values;
  onChangeStep: (step: STEPS, values?: Values) => void;
}
const BusinessInformationStep: FC<BusinessInformationStepProps> = ({
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
    onChangeStep(STEPS.BILLING_ADDRESS, { address: data });
  };

  return (
    <BusinessInformationForm
      regionList={regions}
      communeList={communes}
      localityList={deliveryZones}
      onSubmit={handleSubmit}
      onRegionChange={handleRegionChange}
      onCommuneChange={handleCommuneChange}
      linkRenderer={linkRenderer}
      RUT={values.rut}
      socialReason={values.razonSocial || ' '}
      leaveRegisterLink="/"
      defaultValues={values.address}
      mapApiKey={mapApiKey}
    />
  );
};

export default BusinessInformationStep;
