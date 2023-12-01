import React, { type FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../../../uikit/actions';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import ClientInfoForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_CLIENT_INFO_FORM,
  clientInfoSchema,
  type Values as ClientInfoValues
} from '../partials/ClientInfoForm';
import BusinessInfoForm, {
  DEFAULT_LITERALS as DEFAULT_LITERALS_BUSSINES_INFO_FORM,
  businessInfoSchema,
  type Values as BusinessInfoValues
} from '../partials/BusinessInfoForm';
import { mergeSchemas } from '../../../../utils/mergeSchemas';
import { postFormatPhone } from '../../../../utils/phone';

const DEFAULT_LITERALS = {
  backLabel: 'Atrás',
  submitLabel: 'Siguiente',
  ...DEFAULT_LITERALS_BUSSINES_INFO_FORM,
  ...DEFAULT_LITERALS_CLIENT_INFO_FORM
};

export interface ValuesForm extends ClientInfoValues, BusinessInfoValues {}
export type Values = Omit<ValuesForm, 'prefix'>;

export interface UserEmailFormProps {
  defaultValues?: Partial<ValuesForm>;
  onSubmit: (values: Values) => Promise<void> | void;
  onBack?: VoidFunction;
  externalComponent?: React.ReactNode;
  readOnly?: boolean;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
}

const UserEmailForm: FC<UserEmailFormProps> = ({
  defaultValues = {},
  literals = {},
  readOnly = false,
  externalComponent,
  onSubmit,
  onBack
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const methods = useForm<ValuesForm>({
    resolver: yupResolver(
      mergeSchemas(clientInfoSchema(l), businessInfoSchema(l))
    ),
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
  }: ValuesForm): Promise<void> => {
    await onSubmit({ phone: postFormatPhone(prefix, phone), ...rest });
  };

  return (
    <FormProvider {...methods}>
      <form
        className="grid gap-8 tablet:gap-6 desktop:gap-8"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(normalizeSubmitFormValues)}
      >
        <ClientInfoForm readOnly={readOnly} literals={l} />

        <BusinessInfoForm
          readOnly={readOnly}
          literals={l}
          externalComponent={externalComponent}
        />

        <div className="flex gap-[10px]">
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
            size={isMobile ? 'md' : 'sm'}
            type="submit"
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

export default UserEmailForm;
