import { Branch } from '@/types/Branch';
import { Button, DropdownSearchable, TextField } from '@adelco/web-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { BranchFormValues, branchFormSchema } from './branchFormSchema';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import HeaderDataTable from '@/components/HeaderDataTable';
import {
  OptionObject,
  getBranchDefaultValues,
  getZoneDefaultOptions,
  mapSupervicedAreasToHeaderData,
  branchLiterals,
  mapZonesToDropdownOptions
} from './utils';
import useGetZones from '@/hooks/zones/useGetZones';

export interface BranchFormProps {
  branch?: Branch;
  onSubmit: (data: BranchFormValues) => Promise<void> | void;
  onRemove: VoidFunction;
  onClose: (isDirty: boolean, data: BranchFormValues) => void;
  shouldValidateOnClose: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({
  branch,
  onSubmit,
  onRemove,
  onClose,
  shouldValidateOnClose
}) => {
  const { zones, isLoading: isZonesLoading } = useGetZones({ limit: 50 });
  const [zonesOptionsText, setZonesOptionsText] = useState('');
  const [zonesOptions, setZonesOptions] = useState<OptionObject[]>(
    getZoneDefaultOptions(branch?.zone)
  );

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid, isDirty }
  } = useForm<BranchFormValues>({
    resolver: yupResolver(branchFormSchema),
    defaultValues: getBranchDefaultValues(branch)
  });

  const literals = branch ? branchLiterals.edit : branchLiterals.add;

  const handleOnClose = () => onClose(isDirty, getValues());

  useEffect(() => {
    if (zones?.results && !isZonesLoading) {
      setZonesOptions(mapZonesToDropdownOptions(zones.results));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isZonesLoading]);

  useEffect(() => {
    if (shouldValidateOnClose) {
      handleOnClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldValidateOnClose]);

  const onSearchZone = (query: string) => {
    setZonesOptionsText(query);
  };

  const handleOnChangeZone = (value: string) => {
    setValue('zoneId', value, {
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
          <p className="font-semibold">Nombre de la sucursal</p>
          <TextField
            {...register('name')}
            id="name"
            name="name"
            label="Nombre de la sucursal"
            variant={errors.name ? 'failure' : 'none'}
            helperText={errors.name ? errors.name.message : ''}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold">Código de la sucursal</p>
          <TextField
            {...register('code')}
            id="code"
            name="code"
            label="Código de la sucursal"
            variant={errors.code ? 'failure' : 'none'}
            helperText={errors.code ? errors.code.message : ''}
            maxLength={4}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold">Zona asignada</p>
          <DropdownSearchable
            value={watch('zoneId')}
            onChange={handleOnChangeZone}
            onSearch={onSearchZone}
            options={zonesOptions.filter(({ label }) =>
              label
                .toLocaleLowerCase()
                .includes(zonesOptionsText.toLocaleLowerCase().trim())
            )}
            placeholder="Buscar zona"
            isLoading={isZonesLoading}
          />
        </div>

        {/* TODO: use real data once BE implemented*/}
        {/* {branch && (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Áreas supervisadas asignadas</p>
            <HeaderDataTable
              headerData={mapSupervicedAreasToHeaderData(null)}
            />
          </div>
        )} */}

        {(isDirty || !branch) && (
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

        {branch && (
          <p
            className="text-sm font-semibold underline hover:cursor-pointer"
            onClick={onRemove}
            role="button"
          >
            Eliminar sucursal
          </p>
        )}
      </form>
    </div>
  );
};

export default BranchForm;
