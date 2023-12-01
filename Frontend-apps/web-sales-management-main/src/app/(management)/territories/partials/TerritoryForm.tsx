import { FC, useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  DropdownSearchable,
  TextField,
  TextArea,
  Button,
  Icon
} from '@adelco/web-components';
import HeaderDataTable from '@/components/HeaderDataTable';
import { Territory } from '@/types/Territory';
import { validationSchema } from './validationSchema';
import useUsers from '@/hooks/users';
import { Role } from '@/types/User';
import useSupervisedAreas from '@/hooks/supervisedAreas/useSupervisedAreas';
import { TerritoryFormValues } from '../page';
import { getDefaultSalesRepOptions, getSalesRepLabel } from './utils';

export interface TerritoryFormProps {
  territory?: Territory;
  onSubmit: (data: TerritoryFormValues) => void;
  onRemove: VoidFunction;
  onClose: (isDirty: boolean, data: TerritoryFormValues) => void;
  shouldValidateOnClose: boolean;
}

type OptionObject = {
  label: string;
  value: string;
};

const TerritoryForm: FC<TerritoryFormProps> = ({
  territory,
  onSubmit,
  onRemove,
  onClose,
  shouldValidateOnClose
}) => {
  const headerData = [
    {
      title: 'ID',
      value: territory?.id
    },
    {
      title: 'Clientes asignados',
      value: territory?.businessUnitsCounter
    }
  ];

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid, isDirty }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: territory?.name || '',
      supervisedArea: territory?.supervisedArea?.id.toString() || '',
      salesRep: territory?.salesRep?.username ?? '',
      description: territory?.description || ''
    }
  });

  const [salesRepQuery, setSalesRepQuery] = useState<string | undefined>(
    undefined
  );
  const { users, isLoading: isLoadingUsers } = useUsers({
    role: Role.SalesRep,
    text: salesRepQuery
  });
  const [salesRepOptions, setSalesRepOptions] = useState<OptionObject[]>(
    getDefaultSalesRepOptions(territory)
  );
  const {
    supervisedAreasFiltered,
    search: onSupervisedAreaSearch,
    query: supervisedAreaQuery
  } = useSupervisedAreas({ limit: 500 });
  const [areasOptions, setAreasOptions] = useState<OptionObject[]>(
    territory
      ? [
          {
            label: territory.supervisedArea?.name,
            value: territory.supervisedArea?.id?.toString()
          }
        ]
      : []
  );
  const [textAreaValue, setTextAreaValue] = useState(
    territory?.description || ''
  );

  const handleOnClose = () => onClose(isDirty, getValues());

  useEffect(() => {
    if (shouldValidateOnClose) {
      handleOnClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldValidateOnClose]);

  useEffect(() => {
    onSupervisedAreaSearch(territory?.supervisedArea?.name || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [territory?.supervisedArea?.name]);

  useEffect(() => {
    if (supervisedAreasFiltered?.results) {
      setAreasOptions(
        supervisedAreasFiltered?.results?.map((area) => ({
          label: area.name,
          value: area.id?.toString()
        }))
      );
    }
  }, [supervisedAreaQuery, supervisedAreasFiltered?.results]);

  useEffect(() => {
    if (!isLoadingUsers) {
      setSalesRepOptions(
        users?.map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.username
        })) || []
      );
    }
  }, [users, isLoadingUsers]);

  const handleAreaChange = (value: string) => {
    setValue('supervisedArea', value, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const onSalesRepSearch = (query: string) => {
    setSalesRepQuery(query);
  };

  const handleSalesRepChange = (value: string) => {
    setValue('salesRep', value, { shouldDirty: true, shouldValidate: true });
  };

  const handleChangeDescription = (data: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = data.target;
    setTextAreaValue(value);
    setValue('description', value, { shouldDirty: true });
  };

  return (
    <>
      <form
        className="relative flex w-[300px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {territory && (
          <div>
            <p className="font-semibold">Información de territorio</p>
            <HeaderDataTable headerData={headerData} />
          </div>
        )}
        <p className="font-semibold">Nombre de territorio</p>
        <TextField
          {...register('name')}
          id="name"
          name="name"
          label="Nombre de territorio"
          variant={errors.name ? 'failure' : 'none'}
          helperText={errors.name ? errors.name.message : ''}
        />

        <p className="font-semibold">Área supervisada</p>
        <DropdownSearchable
          value={watch('supervisedArea')}
          onChange={handleAreaChange}
          onSearch={onSupervisedAreaSearch}
          options={areasOptions}
          placeholder="Ingresar área supervisada"
        />

        <p className="font-semibold">Vendedor</p>
        <DropdownSearchable
          value={watch('salesRep')}
          onChange={handleSalesRepChange}
          onSearch={onSalesRepSearch}
          options={salesRepOptions}
          placeholder="Ingresar vendedor"
          isLoading={isLoadingUsers}
        />

        <p className="font-semibold">Descripción</p>
        <TextArea
          {...register('description')}
          rows={6}
          onChange={handleChangeDescription}
          value={textAreaValue}
          maxLength={140}
          placeholder="Ingresar comentarios en el siguiente campo de texto"
          variant={errors.description ? 'failure' : 'none'}
          helperText={errors.description ? errors.description.message : ''}
        />
        {territory && (
          <p
            className="text-sm font-semibold underline hover:cursor-pointer"
            onClick={onRemove}
          >
            Eliminar territorio
          </p>
        )}
        {!territory && (
          <Button
            variant="secondary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            size="sm"
            type="submit"
          >
            Crear territorio
          </Button>
        )}
        {territory && isDirty && (
          <Button
            variant="secondary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            size="sm"
            type="submit"
          >
            Guardar cambios
          </Button>
        )}
      </form>
    </>
  );
};

export default TerritoryForm;
