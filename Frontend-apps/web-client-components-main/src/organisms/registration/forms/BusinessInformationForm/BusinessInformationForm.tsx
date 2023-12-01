import React, { useEffect, type FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Stepper } from '../../../../uikit/navigation';
import { type Step } from '../../../../uikit/navigation/Stepper/Stepper';
import { yupResolver } from '@hookform/resolvers/yup';
import { type LinkRenderer } from '../../../../utils/types';
import { Button } from '../../../../uikit/actions';
import { type FormValues } from './types';
import BusinessInformationSchema, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_BUSSINES_INFO_FORM
} from './BusinessInformationSchema';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import MapForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_MAP_FORM
} from './partials/MapForm';
import BusinessAddressForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_DISPATCH_FORM
} from './partials/BusinessAddressForm';
import BusinessInformationFormSection, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_BUSINESS_INFORMATION_FORM_SECTION
} from './partials/BusinessInformationFormSection';
import classNames from 'classnames';

const DEFAULT_LITERALS = {
  continueButtonLabel: 'Siguiente',
  leaveRegisterLabel: 'Abandonar registro',
  ...DEFAULT_LITERALS_BUSINESS_INFORMATION_FORM_SECTION,
  ...DEFAULT_LITERALS_BUSSINES_INFO_FORM,
  ...DEFAULT_LITERALS_DISPATCH_FORM,
  ...DEFAULT_LITERALS_MAP_FORM
};

export interface BusinessInformationFormProps {
  steps?: Step[];
  onSubmit: (values: FormValues) => Promise<void> | void;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  RUT: string;
  regionList: Array<{ value: string; label: string }>;
  communeList: Array<{ value: string; label: string }>;
  localityList: Array<{ value: string; label: string }>;
  onRegionChange: (value: string) => void;
  onCommuneChange: (value: string) => void;
  socialReason: string;
  linkRenderer: LinkRenderer;
  leaveRegisterLink: string;
  defaultValues?: any;
  mapApiKey?: string;
  hideSocialReason?: boolean;
}
const BusinessInformationForm: FC<BusinessInformationFormProps> = ({
  steps,
  RUT,
  socialReason,
  onSubmit,
  regionList,
  onRegionChange,
  onCommuneChange,
  communeList,
  localityList,
  linkRenderer,
  leaveRegisterLink,
  literals = {},
  defaultValues = {},
  mapApiKey,
  hideSocialReason = false
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(BusinessInformationSchema(l))
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
      data-testid="adelco-business-information-form"
      className="text-corporative-03"
    >
      {steps && <Stepper currentStep={1} steps={steps} />}
      <FormProvider {...methods}>
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
          <BusinessInformationFormSection
            literals={l}
            RUT={RUT}
            socialReason={socialReason}
            hideSocialReason={hideSocialReason}
          />
          <BusinessAddressForm
            literals={l}
            regionList={regionList}
            communeList={communeList}
            localityList={localityList}
            onRegionChange={onRegionChange}
            onCommuneChange={onCommuneChange}
          />
          <MapForm literals={l} mapApiKey={mapApiKey} />

          <Button
            className="mt-4 desktop:mt-6"
            variant="secondary"
            size={isMobile ? 'md' : 'sm'}
            type="submit"
            disabled={watch('coordinates') === undefined || isSubmitting}
            loading={isSubmitting}
          >
            {l.continueButtonLabel}
          </Button>

          <p className="text-center text-xs underline mt-2 py-1">
            {linkRenderer(
              leaveRegisterLink,
              <span className="cursor-pointer">{l.leaveRegisterLabel}</span>
            )}
          </p>
        </form>
      </FormProvider>
    </div>
  );
};

export default BusinessInformationForm;
