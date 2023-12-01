import { Money } from '../general';

export type Zone = {
  id?: string;
  dch: string;
  t2z: string;
  useT2Rate?: boolean;
  taxProfile?: string;
  minAmount?: Money;
  zoneLabel?: string; // TODO: temporary to be able to display on navbar
  businessUnitId?: string;
  anonymousUUID?: string;
  username?: string;
};

export interface ZoneLabels {
  regionLabel: string;
  communeLabel: string;
  deliveryZoneLabel?: string;
}

export interface ZonePayload extends Pick<Zone, 'dch' | 't2z' | 'businessUnitId' | 'minAmount'>, ZoneLabels {
  zoneId?: string;
}
