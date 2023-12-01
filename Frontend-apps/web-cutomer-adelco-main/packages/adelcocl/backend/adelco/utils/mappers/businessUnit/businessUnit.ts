import { ZoneLabels } from '@Types/adelco/user';

export const formatZoneLabel = ({ regionLabel, communeLabel, deliveryZoneLabel }: ZoneLabels): string => {
  const normalizeDeliveryZoneLabel =
    deliveryZoneLabel && deliveryZoneLabel !== communeLabel ? `${deliveryZoneLabel}, Comuna de ` : '';

  return `${normalizeDeliveryZoneLabel}${communeLabel}, Region ${regionLabel}`;
};
