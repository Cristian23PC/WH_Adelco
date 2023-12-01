import { Schedule } from '@/types/BUSalesProfile';

export const BUInfo = {
  id: '0012',
  name: 'Los tres chanchitos',
  customerName: 'Nombre y apellido',
  channel: 'Canal',
  address: 'Dirección',
  zonalManager: 'Nombre del Gerente zonal',
  supervisor: 'Nombre del Supervisor'
};

export type BUInfoType = {
  id: number;
  name: string;
  customerName: string;
  channel: string;
  address: string;
  zoneManagerName: string;
  supervisorName: string;
  salesRepName?: string;
  territoryName?: string;
  schedule?: Schedule;
};
