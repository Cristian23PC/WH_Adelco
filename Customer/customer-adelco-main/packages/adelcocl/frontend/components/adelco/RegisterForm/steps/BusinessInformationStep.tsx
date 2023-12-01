import { FC, useEffect } from 'react';
import Link from 'next/link';
import { BusinessInformationForm } from '@adelco/web-components';
import useZoneSelection from '../../../../helpers/hooks/useZoneSelection';
import { STEPS, Values } from '../useStep';
import useTrackRegister from 'helpers/hooks/analytics/useTrackRegister';

const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const mockSteps = [
  { title: 'Información de negocios', step: 1, isComplete: true },
  { title: 'Información de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

interface BusinessInformationStepProps {
  values: Values;
  onChangeStep: (step: string, values?: Values) => void;
}
const BusinessInformationStep: FC<BusinessInformationStepProps> = ({
  values,
  onChangeStep
}) => {
  const { trackCompanyRegistrationStep1 } = useTrackRegister();
  const {
    regions,
    communes,
    deliveryZones,
    handleRegionChange,
    handleCommuneChange
  } = useZoneSelection();
  const handleSubmit = async (data) => {
    onChangeStep(STEPS.BILLING_INFORMATION, { address: data });
  };

  useEffect(() => {
    trackCompanyRegistrationStep1();
  }, []);

  const handleOnLeaveRegister = () => {
    onChangeStep(STEPS.ABORTED_REGISTRATION);
  };

  const linkRenderer = (_, label) => (
    <span onClick={handleOnLeaveRegister}>{label}</span> // INFO: used only in leave register link
  );

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
      socialReason={values.razonSocial}
      leaveRegisterLink="/"
      steps={mockSteps}
      defaultValues={values.address}
      mapApiKey={mapApiKey}
    />
  );
};

export default BusinessInformationStep;
