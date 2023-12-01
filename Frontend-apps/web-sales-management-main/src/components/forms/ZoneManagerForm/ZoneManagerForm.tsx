import { Role, Supervisor, UserPayload } from '@/types/User';
import { DropdownSearchable } from '@adelco/web-components';
import { UseFormReturn } from 'react-hook-form';
import { FC } from 'react';
import useUsersByRole from '@/hooks/useUsersByRole';
import { getUserDefaultOption } from './utils';

const TITLE = {
  [Role.Supervisor]: 'Asignar Gerente zonal',
  [Role.SalesRep]: 'Asignar Supervisor',
  [Role.ZoneManager]: 'Asignar Gerente general'
};

interface Values extends Pick<UserPayload, 'reportsTo'> {
  role: Role.Supervisor | Role.SalesRep | Role.ZoneManager;
}

interface ZoneManagerFormProps {
  formController: UseFormReturn<Values>;
}

const ZoneManagerForm: FC<ZoneManagerFormProps> = ({ formController }) => {
  const { watch, setValue, getValues } = formController;
  const role = watch('role');
  const zmValue = getValues('reportsTo')?.username;
  const { users, isLoading, onSearch, getFullUser } = useUsersByRole(
    Supervisor[role]
  );

  return (
    <section className="flex flex-col gap-4">
      <h2>{TITLE[role]}</h2>
      <DropdownSearchable
        placeholder="Buscar usuario"
        onChange={(username) => {
          setValue('reportsTo', getFullUser(username), { shouldDirty: true });
        }}
        value={zmValue as string}
        onSearch={onSearch}
        options={
          watch('reportsTo')
            ? getUserDefaultOption(watch('reportsTo'))
            : users || []
        }
        isLoading={isLoading}
      />
    </section>
  );
};

export default ZoneManagerForm;
