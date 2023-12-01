import React, { useEffect, type FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { Button } from '../../../../uikit/actions';
import { type FormValues } from './types';
import DeliveryAddressSchema, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_DELIVERY_ADDRESS_FORM_VALIDATIONS
} from './DeliveryAddressSchema';
import MapForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_MAP_FORM
} from '../../../registration/forms/BusinessInformationForm/partials/MapForm';
import BusinessAddressForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_DELIVERY_ADDRESS_FORM
} from '../../../registration/forms/BusinessInformationForm/partials/BusinessAddressForm';
import DeliveryAddressBusinessForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_DELIVERY_ADDRESS_BUSINESS_INFO_FORM
} from './partials/DeliveryAddressBusinessForm';

const DEFAULT_LITERALS = {
  title: 'Agregar nueva dirección',
  continueButtonLabel: 'Siguiente',
  backButtonLabel: 'Atrás',
  ...DEFAULT_LITERALS_DELIVERY_ADDRESS_BUSINESS_INFO_FORM,
  ...DEFAULT_LITERALS_DELIVERY_ADDRESS_FORM_VALIDATIONS,
  ...DEFAULT_LITERALS_DELIVERY_ADDRESS_FORM,
  ...DEFAULT_LITERALS_MAP_FORM
};

export interface DeliveryAddressFormProps {
  onSubmit: (values: FormValues) => Promise<void> | void;
  onBack: VoidFunction;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  regionList: Array<{ value: string; label: string }>;
  communeList: Array<{ value: string; label: string }>;
  localityList: Array<{ value: string; label: string }>;
  onRegionChange: (value: string) => void;
  onCommuneChange: (value: string) => void;
  defaultValues?: any;
  mapApiKey?: string;
}

const DeliveryAddressForm: FC<DeliveryAddressFormProps> = ({
  onSubmit,
  onBack,
  regionList,
  onRegionChange,
  onCommuneChange,
  communeList,
  localityList,
  literals = {},
  defaultValues = {},
  mapApiKey
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals,
    secondSectionTitle: ''
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(DeliveryAddressSchema(l))
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch
  } = methods;

  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      onCommuneChange(defaultValues.commune);
      onRegionChange(defaultValues.region);
      Object.keys(defaultValues).forEach((key) => {
        setValue(
          key as keyof FormValues,
          defaultValues[key as keyof FormValues]
        );
      });
    }
  }, []);

  return (
    <div
      data-testid="adelco-delivery-address-form"
      className="text-corporative-03 mt-6 w-full tablet:w-[325px] tablet:mx-auto"
    >
      <h2 className="text-center font-semibold mb-4 tablet:mb-8">{l.title}</h2>

      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-2"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <DeliveryAddressBusinessForm literals={l} />

          <BusinessAddressForm
            literals={l}
            regionList={regionList}
            communeList={communeList}
            localityList={localityList}
            onRegionChange={onRegionChange}
            onCommuneChange={onCommuneChange}
          />

          <MapForm literals={l} mapApiKey={mapApiKey} />

          <div className="flex gap-[10px] w-full mt-4 tablet:mt-6">
            <Button
              className="w-full"
              variant="tertiary"
              size={isMobile ? 'md' : 'sm'}
              disabled={isSubmitting}
              onClick={onBack}
            >
              {l.backButtonLabel}
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              size={isMobile ? 'md' : 'sm'}
              type="submit"
              disabled={watch('coordinates') === undefined || isSubmitting}
              loading={isSubmitting}
            >
              {l.continueButtonLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default DeliveryAddressForm;
