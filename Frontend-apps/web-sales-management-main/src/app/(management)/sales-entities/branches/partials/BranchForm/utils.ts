import { Branch } from '@/types/Branch';
import { BranchFormValues } from './branchFormSchema';
import { HeaderDataTableProps } from '@/components/HeaderDataTable/HeaderDataTable';
import { Zone } from '@/types/Zones';

export type OptionObject = {
  label: string;
  value: string;
};

export const branchLiterals = {
  edit: {
    title: 'Información de la sucursal',
    buttonLabel: 'Guardar cambios'
  },
  add: {
    title: 'Crear sucursal',
    buttonLabel: 'Crear sucursal'
  }
};

export const getBranchDefaultValues = (branch?: Branch): BranchFormValues => {
  return {
    name: branch?.name || '',
    zoneId: branch?.zone?.id?.toString() ?? '',
    code: branch?.code || ''
  };
};

const transformZoneToDropdownOption = (
  zone: Branch['zone'] | Zone
): OptionObject => {
  return {
    label: zone.name,
    value: zone?.id?.toString() ?? ''
  };
};

export const getZoneDefaultOptions = (
  zone?: Branch['zone']
): OptionObject[] => {
  return zone ? [transformZoneToDropdownOption(zone)] : [];
};

export const mapZonesToDropdownOptions = (zones: Zone[]): OptionObject[] => {
  return zones?.map(transformZoneToDropdownOption);
};

// TODO: fix this function when we have the right data
export const mapSupervicedAreasToHeaderData = (
  supervicedAreas: any
): HeaderDataTableProps['headerData'] => {
  return [
    { title: 'Área', value: 'ABC123' },
    { title: 'Área', value: 'ABC456' },
    { title: 'Área', value: 'ABC789' }
  ];
};
