import { FC } from 'react';
import { UserPayload } from '@/types/User';
import { TextField } from '@adelco/web-components';
import { UseFormReturn } from 'react-hook-form';
import { formatPhone } from '@/utils/phone';

export interface Values
  extends Pick<UserPayload, 'username' | 'firstName' | 'lastName' | 'phone'> {}

interface UserInfoFormProps {
  values?: Values;
  formController: UseFormReturn<Values>;
  viewMode?: boolean;
  title?: string;
}

const UserInfoForm: FC<UserInfoFormProps> = ({
  values,
  viewMode = false,
  title = 'Información de usuario',
  formController
}) => {
  const {
    register,
    setValue,
    formState: { errors }
  } = formController;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-bold">{title}</h2>
      {viewMode ? (
        <div className="text-xs text-left p-2 rounded border border-silver">
          <div className="font-semibold">Correo electrónico</div>
          <div>{values?.username}</div>
        </div>
      ) : (
        <TextField
          id="username"
          label="Correo electrónico"
          {...register('username')}
        />
      )}
      <TextField id="firstName" label="Nombre" {...register('firstName')} />
      <TextField id="lastName" label="Apellido" {...register('lastName')} />
      <div className="grid gap-2 grid-cols-[54px,1fr]">
        <TextField id="prefix" readOnly value="+56" />
        <TextField
          label="Teléfono móvil"
          helperIcon="error"
          variant={errors.phone ? 'failure' : 'none'}
          type="tel"
          id="phone"
          placeholder="9 XXXX XXXX"
          {...register('phone', {
            onChange: (e) => {
              setValue('phone', formatPhone(e.currentTarget.value));
            }
          })}
        />
      </div>
    </section>
  );
};

export default UserInfoForm;
