import useUsers from '@/hooks/users';
import { Role } from '@/types/User';
import { Zone } from '@/types/Zones';
import { Button, DropdownSearchable, TextField } from '@adelco/web-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { ZoneFormValues, zoneFormSchema } from './zoneFormSchema';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import HeaderDataTable from '@/components/HeaderDataTable';
import {
  OptionObject,
  getZoneDefaultValues,
  getZoneManagerDefaultOptions,
  mapUsersToDropdownOptions,
  mapZoneBranchesToHeaderData,
  zoneLiterals
} from './utils';

export interface ZoneFormProps {
  zone?: Zone;
  onSubmit: (data: ZoneFormValues) => Promise<void> | void;
  onRemove: VoidFunction;
  onClose: (isDirty: boolean, data: ZoneFormValues) => void;
  shouldValidateOnClose: boolean;
}

const ZoneForm: React.FC<ZoneFormProps> = ({
  zone,
  onSubmit,
  onRemove,
  onClose,
  shouldValidateOnClose
}) => {
  const [usersText, setUsersText] = useState<string>('');
  const { users, isLoading: isUsersLoading } = useUsers({
    role: Role.ZoneManager,
    text: usersText
  });

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid, isDirty }
  } = useForm<ZoneFormValues>({
    resolver: yupResolver(zoneFormSchema),
    defaultValues: getZoneDefaultValues(zone)
  });
  const [managerOptions, setManagerOptions] = useState<OptionObject[]>(
    getZoneManagerDefaultOptions(zone?.zoneManager)
  );

  const literals = zone ? zoneLiterals.edit : zoneLiterals.add;

  const handleOnClose = () => onClose(isDirty, getValues());

  useEffect(() => {
    if (users && !isUsersLoading) {
      setManagerOptions(mapUsersToDropdownOptions(users));
    }
  }, [isUsersLoading, users]);

  useEffect(() => {
    if (shouldValidateOnClose) {
      handleOnClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldValidateOnClose]);

  const onSearchManager = (query: string) => {
    setUsersText(query);
  };

  const handleOnChangeManager = (value: string) => {
    setValue('zoneManagerId', value, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  return (
    <div className="relative flex w-[300px] flex-col gap-4">
      <h2 className="font-bold text-lg">{literals.title}</h2>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
        })}
      >
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Nombre de la zona</p>
          <TextField
            {...register('name')}
            id="name"
            name="name"
            label="Nombre de la zona"
            variant={errors.name ? 'failure' : 'none'}
            helperText={errors.name ? errors.name.message : ''}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold">Gerente</p>
          <DropdownSearchable
            value={watch('zoneManagerId')}
            onChange={handleOnChangeManager}
            onSearch={onSearchManager}
            options={managerOptions}
            placeholder="Buscar gerente"
            isLoading={isUsersLoading}
          />
        </div>

        {/* TODO: use real data once BE implemented*/}
        {/* {zone && (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Sucursales asignadas</p>
            <HeaderDataTable headerData={mapZoneBranchesToHeaderData(null)} />
          </div>
        )} */}

        {(isDirty || !zone) && (
          <Button
            variant="secondary"
            loading={isSubmitting}
            disabled={!isValid}
            size="sm"
            type="submit"
            data-testid="adelco-zone-form-submit-button"
          >
            {literals.buttonLabel}
          </Button>
        )}

        {zone && (
          <p
            className="text-sm font-semibold underline hover:cursor-pointer"
            onClick={onRemove}
            role="button"
          >
            Eliminar zona
          </p>
        )}
      </form>
    </div>
  );
};

export default ZoneForm;
