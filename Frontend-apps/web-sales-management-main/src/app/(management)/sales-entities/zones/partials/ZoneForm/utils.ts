import { Zone, ZoneManager } from '@/types/Zones';
import { ZoneFormValues } from './zoneFormSchema';
import { User } from '@/types/User';
import { HeaderDataTableProps } from '@/components/HeaderDataTable/HeaderDataTable';

export type OptionObject = {
  label: string;
  value: string;
};

export const zoneLiterals = {
  edit: {
    title: 'Información de la zona',
    buttonLabel: 'Guardar cambios'
  },
  add: {
    title: 'Crear zona',
    buttonLabel: 'Crear zona'
  }
};

export const getZoneDefaultValues = (zone?: Zone): ZoneFormValues => {
  return {
    name: zone?.name || '',
    zoneManagerId: zone?.zoneManager?.username
  };
};

const transformUserToDropdownOption = (
  user: User | ZoneManager
): OptionObject => {
  return {
    label: `${user.firstName} ${user.lastName}`,
    value: user.username
  };
};

export const getZoneManagerDefaultOptions = (
  zoneManager?: ZoneManager
): OptionObject[] => {
  return zoneManager ? [transformUserToDropdownOption(zoneManager)] : [];
};

export const mapUsersToDropdownOptions = (users: User[]): OptionObject[] => {
  return users?.map(transformUserToDropdownOption);
};

// TODO: fix this function when we have the right data
export const mapZoneBranchesToHeaderData = (
  branches: any
): HeaderDataTableProps['headerData'] => {
  return [
    { title: 'Área', value: 'ABC123' },
    { title: 'Área', value: 'ABC456' },
    { title: 'Área', value: 'ABC789' }
  ];
};
