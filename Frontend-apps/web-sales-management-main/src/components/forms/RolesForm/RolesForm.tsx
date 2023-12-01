import { UserPayload, Role } from '@/types/User';
import { Dropdown } from '@adelco/web-components';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

const roles = [
  { label: 'Administrador', value: Role.Admin },
  { label: 'Gerente de venta', value: Role.GeneralManager },
  { label: 'Gerente zonal', value: Role.ZoneManager },
  { label: 'Supervisor', value: Role.Supervisor },
  { label: 'Vendedor', value: Role.SalesRep }
];

export interface Values extends Pick<UserPayload, 'role'> {}

interface RolesFormProps {
  formController: UseFormReturn<Values>;
}

const RolesForm: FC<RolesFormProps> = ({ formController }) => {
  const { register, setValue, watch } = formController;

  return (
    <section className="flex flex-col gap-4">
      <h2>Rol</h2>
      <Dropdown
        options={roles}
        {...register('role')}
        value={watch('role')}
        onChange={(rol: string) =>
          setValue('role', rol as Role, {
            shouldDirty: true,
            shouldValidate: true
          })
        }
      />
    </section>
  );
};

export default RolesForm;
