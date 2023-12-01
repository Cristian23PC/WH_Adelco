import React from 'react';
import { Values, STEPS } from '../useStep';
import { DeliveryAddressClientInfoForm, toast } from '@adelco/web-components';
import useAddDeliveryAddress from 'frontastic/actions/adelco/businessUnit/useAddDeliveryAddress';
import useSetZone from 'frontastic/actions/adelco/user/useSetZone';
import { useRouter } from 'next/router';
import { formatAddDeliveryAddress } from '../utils';

interface ContactInformationStepProps {
  values: Partial<Values>;
  onChangeStep: (step: string, values?: Partial<Values>) => void;
}

const DELIVERY_ADDRESS_ERRORS_MESSAGES: Record<number, string> = {
  401: 'No tienes permisos',
  403: 'No tienes permisos',
  404: 'No tienes asociada la unidad de negocio'
};

const ContactInformationStep: React.FC<ContactInformationStepProps> = ({
  values: prevStepsValues,
  onChangeStep
}) => {
  const router = useRouter();

  const { trigger: addDeliveryAddress } = useAddDeliveryAddress();
  const { trigger: setZone } = useSetZone();

  const handleOnGoBack = async () => {
    onChangeStep(STEPS.DELIVERY_ADDRESS_INFORMATION);
  };

  const handleOnError = (error: any) => {
    const statusCode = error?.status;

    toast.error({
      title: 'Ha ocurrido un error',
      iconName: 'error',
      position: 'top-right',
      text:
        (statusCode && DELIVERY_ADDRESS_ERRORS_MESSAGES[statusCode]) ||
        'No se ha podido agregar la sucursal'
    });
  };

  const handleOnSuccess = () => {
    router.push('/');

    toast.success({
      title: 'Registro exitoso',
      text: 'Nueva sucursal agregada',
      position: 'top-right',
      iconName: 'done'
    });
  };

  const handleSetZone = async (zone) => {
    const payload = {
      zoneId: zone.id,
      dch: zone.distributionChannelId,
      t2z: zone.deliveryZoneKey,
      regionLabel: zone.addresses[0]?.region,
      communeLabel: zone.addresses[0]?.city,
      deliveryZoneLabel: [
        zone.addresses[0]?.streetName,
        zone.addresses[0]?.streetNumber
      ].join(' ')
    };

    await setZone(payload);
  };

  const handleSubmit = async (data: Partial<Values>) => {
    try {
      const fullData = { ...prevStepsValues, ...data } as Values;
      const formatedFullData = formatAddDeliveryAddress(fullData);

      const response = await addDeliveryAddress(formatedFullData);

      if (!response?.data || response.error) {
        handleOnError(response.error);
      } else {
        handleOnSuccess();
        handleSetZone(response.data);
      }
    } catch (e) {
      handleOnError(e?.error);
    }
  };

  return (
    <DeliveryAddressClientInfoForm
      onSubmit={handleSubmit}
      onBack={handleOnGoBack}
    />
  );
};

export default ContactInformationStep;
