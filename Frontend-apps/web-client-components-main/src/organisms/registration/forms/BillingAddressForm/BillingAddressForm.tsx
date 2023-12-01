import React, { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { Stepper } from '../../../../uikit/navigation';
import { type Step } from '../../../../uikit/navigation/Stepper/Stepper';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../../../uikit/actions';
import { type FormValues } from './types';
import { type FormValues as BusinessAddressFormValues } from '../BusinessInformationForm/types';
import BillingAddressSchema, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_BILLING_ADDRESS_SCHEMA
} from './BillingAddressSchema';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import AddressForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_BILLING_ADDRESS_FORM
} from './partials/AddressForm';
import classNames from 'classnames';

const DEFAULT_LITERALS = {
  continueButtonLabel: 'Siguiente',
  backButtonLabel: 'Atrás',
  ...DEFAULT_LITERALS_BILLING_ADDRESS_SCHEMA,
  ...DEFAULT_LITERALS_BILLING_ADDRESS_FORM
};

export interface BillingAddressFormProps {
  steps?: Step[];
  onSubmit: (values: FormValues) => Promise<void> | void;
  onBack: VoidFunction;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  regionList: Array<{ value: string; label: string }>;
  communeList: Array<{ value: string; label: string }>;
  localityList: Array<{ value: string; label: string }>;
  onRegionChange: (value: string) => void;
  onCommuneChange: (value: string) => void;
  businessAddressValues: BusinessAddressFormValues;
  defaultValues?: FormValues;
}

const BillingAddressForm: FC<BillingAddressFormProps> = ({
  steps,
  onSubmit,
  onBack,
  literals = {},
  regionList,
  onRegionChange,
  communeList,
  onCommuneChange,
  localityList,
  businessAddressValues,
  defaultValues
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
    clearErrors
  } = useForm<FormValues>({
    resolver: yupResolver(
      BillingAddressSchema(DEFAULT_LITERALS_BILLING_ADDRESS_SCHEMA)
    )
  });

  return (
    <div
      data-testid="adelco-billing-address-form"
      className="text-corporative-03"
    >
      {steps && <Stepper currentStep={2} steps={steps} />}
      <form
        className={classNames(
          'flex flex-col gap-2 tablet:w-[300px] tablet:mx-auto',
          { 'mt-10 tablet:mt-16': !!steps }
        )}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <AddressForm
          literals={l}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
          errors={errors}
          register={register}
          regionList={regionList}
          onRegionChange={onRegionChange}
          communeList={communeList}
          onCommuneChange={onCommuneChange}
          localityList={localityList}
          businessAddressValues={businessAddressValues}
          clearErrors={clearErrors}
          defaultValues={defaultValues}
        />

        <div className="flex w-full gap-[10px]">
          <Button
            className="mt-4 desktop:mt-6 w-1/2"
            variant="tertiary"
            size={isMobile ? 'md' : 'sm'}
            type="button"
            onClick={onBack}
          >
            {l.backButtonLabel}
          </Button>
          <Button
            className="mt-4 desktop:mt-6 w-1/2"
            variant="secondary"
            size={isMobile ? 'md' : 'sm'}
            disabled={isSubmitting}
            loading={isSubmitting}
            type="submit"
          >
            {l.continueButtonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BillingAddressForm;
