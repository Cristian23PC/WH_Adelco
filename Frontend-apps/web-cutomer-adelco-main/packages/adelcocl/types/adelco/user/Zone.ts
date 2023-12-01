export type Zone = {
  dch: string;
  t2z: string;
  zoneLabel?: string; // TODO: temporary to be able to display on navbar
  businessUnitId?: string;
};

export interface ZoneLabels {
  regionLabel: string;
  communeLabel: string;
  deliveryZoneLabel?: string;
}

export interface ZonePayload extends Pick<Zone, 'dch' | 't2z'>, ZoneLabels {}
