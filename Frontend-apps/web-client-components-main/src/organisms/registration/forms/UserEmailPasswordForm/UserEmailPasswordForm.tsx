/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
import React, { type FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ClientInfoForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_CLIENT_INFO_FORM,
  type Values as ClientInfoValues,
  clientInfoSchema
} from '../partials/ClientInfoForm';
import BusinessInfoForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_BUSINESS_INFO_FORM,
  type Values as BusinessInfoValues,
  businessInfoSchema
} from '../partials/BusinessInfoForm';
import PasswordForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_PASSWORD_FORM,
  passwordSchema,
  type Values as PasswordValues
} from './partials/PasswordForm';
import { Button } from '../../../../uikit/actions';
import { yupResolver } from '@hookform/resolvers/yup';
import { mergeSchemas } from '../../../../utils/mergeSchemas';
import TermsForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_TERMS_FORM,
  termsSchema,
  type Values as TermsValues
} from './partials/TermsForm';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { postFormatPhone } from '../../../../utils/phone';

const DEFAULT_LITERALS = {
  backLabel: 'Atrás',
  submitLabel: 'Siguiente',
  ...DEFAULT_LITERALS_CLIENT_INFO_FORM,
  ...DEFAULT_LITERALS_BUSINESS_INFO_FORM,
  ...DEFAULT_LITERALS_PASSWORD_FORM,
  ...DEFAULT_LITERALS_TERMS_FORM
};

export interface ValuesForm
  extends ClientInfoValues,
    BusinessInfoValues,
    Partial<PasswordValues>,
    Partial<TermsValues> {}
export interface Values
  extends Omit<ValuesForm, 'prefix' | 'confirmPassword'> {}

export interface UserEmailPasswordFormProps {
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  defaultValues?: Partial<Values>;
  onSubmit: (values: Values) => Promise<void> | void;
  onBack: VoidFunction;
  termsUrl?: string;
  giroOptions?: Array<{ value: string; label: string }>;
}

const UserEmailPasswordForm: FC<UserEmailPasswordFormProps> = ({
  literals = {},
  defaultValues = {},
  onSubmit,
  onBack,
  termsUrl = '/terms',
  giroOptions = []
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const methods = useForm<ValuesForm>({
    defaultValues: {
      acceptTerms: false,
      ...defaultValues
    },
    resolver: yupResolver(
      mergeSchemas(
        clientInfoSchema(l),
        businessInfoSchema(l),
        passwordSchema(l),
        termsSchema(l)
      )
    )
  });
  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const normalizeSubmitFormValues = async ({
    prefix,
    phone,
    ...rest
  }: ValuesForm): Promise<void> => {
    await onSubmit({ phone: postFormatPhone(prefix, phone), ...rest });
  };

  return (
    <FormProvider {...methods}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(normalizeSubmitFormValues)}
        className="grid gap-8 tablet:gap-6 desktop:gap-8"
      >
        <ClientInfoForm literals={l} readOnly />
        <BusinessInfoForm
          literals={l}
          giroOptions={giroOptions}
          readOnly
          expanded
        />
        <div className="flex flex-col gap-8 tablet:gap-6 desktop:gap-4">
          <PasswordForm literals={l} />
          <TermsForm literals={l} termsUrl={termsUrl} />
        </div>
        <div className="flex gap-[10px] py-4">
          <Button
            variant="tertiary"
            className="flex-1"
            size={isMobile ? 'md' : 'sm'}
            onClick={onBack}
          >
            {l.backLabel}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            type="submit"
            size={isMobile ? 'md' : 'sm'}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {l.submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserEmailPasswordForm;
