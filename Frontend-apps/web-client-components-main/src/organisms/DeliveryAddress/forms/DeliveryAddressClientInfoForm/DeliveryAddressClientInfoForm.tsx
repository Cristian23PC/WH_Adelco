/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import ClientInfoForm from '../../../registration/forms/partials/ClientInfoForm';
import DeliveryAddressClientInfoSchema, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_CLIENT_INFO_FORM
} from './DeliveryAddressClientInfoSchema';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type FormValues as ClientInfoFormValues } from './types';
import { postFormatPhone } from '../../../../utils/phone';
import { Button } from '../../../../uikit/actions';

const DEFAULT_LITERALS = {
  backButtonLabel: 'Atrás',
  continueButtonLabel: 'Confirmar',
  title: 'Ingresa los datos de contacto de esta sucursal',
  ...DEFAULT_LITERALS_CLIENT_INFO_FORM
};
export type FormValues = ClientInfoFormValues;
export type FormatedFormValues = Omit<ClientInfoFormValues, 'prefix'>;

export interface DeliveryAddressClientInfoFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormatedFormValues) => Promise<void> | void;
  onBack: VoidFunction;
  readOnly?: boolean;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
}

const DeliveryAddressClientInfoForm: React.FC<
  DeliveryAddressClientInfoFormProps
> = ({
  defaultValues = {},
  literals = {},
  readOnly = false,
  onSubmit,
  onBack
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals,
    clientTitle: ''
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(DeliveryAddressClientInfoSchema(l)),
    defaultValues
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const normalizeSubmitFormValues = async ({
    prefix,
    phone,
    ...rest
  }: FormValues): Promise<void> => {
    await onSubmit({ phone: postFormatPhone(prefix, phone), ...rest });
  };

  return (
    <div
      data-testid="adelco-delivery-address-client-info-form"
      className="text-corporative-03 mt-6 w-full tablet:w-[325px] tablet:mx-auto"
    >
      <h2 className="text-center font-semibold mb-4 tablet:mb-8 max-w-[15rem] mx-auto">
        {l.title}
      </h2>

      <FormProvider {...methods}>
        <form
          className="grid gap-6 tablet:gap-8"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(normalizeSubmitFormValues)}
        >
          <ClientInfoForm readOnly={readOnly} literals={l} />

          <div className="flex gap-[10px] w-full">
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
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {l.continueButtonLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default DeliveryAddressClientInfoForm;
