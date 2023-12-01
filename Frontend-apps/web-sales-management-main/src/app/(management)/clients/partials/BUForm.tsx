import { FC, useEffect, useState } from 'react';
import { DropdownSearchable, Button, Icon } from '@adelco/web-components';
import { useForm } from 'react-hook-form';
import HeaderDataTable from '@/components/HeaderDataTable';
import { BUInfoType } from '../mockData';
import useTerritory from '@/hooks/territory/useTerritory';
import { BUProfileTerritoryValues } from '../page';
import { getDefaultTerritoryOptions } from './utils';

interface BUFormProps {
  buInfo?: BUInfoType;
  onSubmit: (data: BUProfileTerritoryValues) => void;
  onClose: (isDirty: boolean, data: BUProfileTerritoryValues) => void;
  shouldValidateOnClose: boolean;
}

type OptionObject = {
  label: string;
  value: string;
};

const BUForm: FC<BUFormProps> = ({
  buInfo,
  onSubmit,
  onClose,
  shouldValidateOnClose
}) => {
  const headerData = [
    {
      title: 'ID',
      value: buInfo?.id
    },
    {
      title: 'Nombre de negocio',
      value: buInfo?.name
    },
    {
      title: 'Nombre de cliente',
      value: buInfo?.customerName
    },
    {
      title: 'Canal',
      value: buInfo?.channel
    },
    {
      title: 'Dirección',
      value: buInfo?.address
    },
    {
      title: 'Gerente zonal',
      value: buInfo?.zoneManagerName
    },
    {
      title: 'Supervisor',
      value: buInfo?.supervisorName
    }
  ];

  const {
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: {
      id: buInfo?.id,
      territory: '-'
    }
  });

  const { territories, search, query } = useTerritory();
  const [territoryOptions, setTerritoryOptions] = useState<OptionObject[]>(
    getDefaultTerritoryOptions(buInfo)
  );

  const handleOnClose = () => onClose(isDirty, getValues());

  useEffect(() => {
    if (shouldValidateOnClose) {
      handleOnClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldValidateOnClose]);

  useEffect(() => {
    if (territories && query) {
      const opts = territories.results
        .filter((territory) => territory.salesRep)
        .map((t) => ({
          value: t.id.toString(),
          label: [
            [t.salesRep.firstName, t.salesRep.lastName].join(' '),
            t.name
          ].join(' / ')
        }));
      setTerritoryOptions(opts);
    }
  }, [territories, query]);
  const onTerritoryChange = (value: string) => {
    setValue('territory', value, { shouldDirty: true });
  };

  return (
    <>
      <form
        className="flex w-[300px] flex-col gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="font-semibold">Información de cliente</p>
        <HeaderDataTable headerData={headerData} />
        <DropdownSearchable
          placeholder="Ingresar vendedor / territorio"
          value={watch('territory')}
          onChange={onTerritoryChange}
          onSearch={search}
          options={territoryOptions}
        />
        {buInfo && isDirty && (
          <Button
            variant="secondary"
            loading={isSubmitting}
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

export default BUForm;
