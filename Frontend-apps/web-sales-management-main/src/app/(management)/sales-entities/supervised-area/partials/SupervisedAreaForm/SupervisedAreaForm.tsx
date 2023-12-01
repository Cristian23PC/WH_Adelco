import { SupervisedArea } from '@/types/SupervisedAreas';
import { Button, DropdownSearchable, TextField } from '@adelco/web-components';
import { useForm } from 'react-hook-form';
import { FC, useEffect, useState } from 'react';
import useUsers from '@/hooks/users';
import { Role } from '@/types/User';
import { yupResolver } from '@hookform/resolvers/yup';
import supervisedAreaSchema, {
  SupervisedAreaFormValues
} from './supervisedAreaSchema';
import {
  OptionObject,
  getBranchesDefaultOptions,
  getSupervisedAreaDefaultValues,
  getSupervisorDefaultOptions,
  mapUsersToDropdownOptions,
  supervisedAreaLiterals
} from './utils';
import useGetBranches from '@/hooks/branches/useGetBranches';
import { getBranchesOptions } from '@/utils/mappers/branches/branches';

export interface SupervisedAreaFormProps {
  supervisedArea?: SupervisedArea;
  onSubmit: (values: SupervisedAreaFormValues) => void | Promise<void>;
  onRemove?: () => void;
  onClose: (isDirty: boolean, data: SupervisedAreaFormValues) => void;
  shouldValidateOnClose: boolean;
}

const SupervisedAreaForm: FC<SupervisedAreaFormProps> = ({
  supervisedArea,
  onSubmit,
  onRemove,
  onClose,
  shouldValidateOnClose
}) => {
  const [usersText, setUsersText] = useState('');
  const {
    branches,
    isLoading: isBranchesLoading,
    search: searchBranches
  } = useGetBranches({ limit: 500 });
  const { users, isLoading: isUsersLoading } = useUsers({
    text: usersText,
    role: Role.Supervisor
  });

  const {
    register,
    watch,
    formState: { isDirty, isSubmitting, isValid },
    handleSubmit,
    setValue,
    getValues
  } = useForm<SupervisedAreaFormValues>({
    defaultValues: getSupervisedAreaDefaultValues(supervisedArea),
    resolver: yupResolver(supervisedAreaSchema)
  });

  const [supervisorOptions, setSupervisorOptions] = useState<OptionObject[]>(
    getSupervisorDefaultOptions(supervisedArea)
  );

  const [branchesOptions, setBranchesOptions] = useState<OptionObject[]>(
    getBranchesDefaultOptions(supervisedArea)
  );

  const literals = supervisedArea
    ? supervisedAreaLiterals.edit
    : supervisedAreaLiterals.add;

  const handleOnClose = () => onClose(isDirty, getValues());

  useEffect(() => {
    if (users && !isUsersLoading) {
      setSupervisorOptions(mapUsersToDropdownOptions(users));
    }
  }, [isUsersLoading, users]);

  useEffect(() => {
    if (branches && !isBranchesLoading) {
      setBranchesOptions(getBranchesOptions(branches));
    }
  }, [isBranchesLoading, branches]);

  useEffect(() => {
    if (shouldValidateOnClose) {
      handleOnClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldValidateOnClose]);

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
          <p className="font-semibold">Nombre del área supervisada</p>
          <TextField
            {...register('name')}
            id="name"
            name="name"
            label="Nombre de la área supervisada"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold">Supervisor</p>
          <DropdownSearchable
            placeholder="Buscar supervisor"
            value={watch('supervisorId')}
            onChange={(supervisorId: any) =>
              setValue('supervisorId', supervisorId, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
              })
            }
            onSearch={setUsersText}
            isLoading={isUsersLoading}
            options={supervisorOptions}
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Sucursal asignada</p>
          <DropdownSearchable
            placeholder="Buscar sucursal"
            value={watch('branchId')}
            onChange={(branchId: any) => {
              setValue('branchId', branchId, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true
              });
            }}
            onSearch={searchBranches}
            isLoading={isBranchesLoading}
            options={branchesOptions}
          />
        </div>

        {(isDirty || !supervisedArea) && (
          <Button
            variant="secondary"
            size="sm"
            type="submit"
            loading={isSubmitting}
            disabled={!isValid}
          >
            {literals.buttonLabel}
          </Button>
        )}
        {supervisedArea && (
          <p
            className="text-sm font-semibold underline"
            onClick={onRemove}
            role="button"
          >
            Eliminar área supervisada
          </p>
        )}
      </form>
    </div>
  );
};

export default SupervisedAreaForm;
