import { ZoneLabels } from '@Types/adelco/user';
import { labelizeText } from '../common';

export const formatZoneLabel = ({
  regionLabel,
  communeLabel,
  deliveryZoneLabel
}: ZoneLabels): string => {
  const normalizeDeliveryZoneLabel =
    deliveryZoneLabel && deliveryZoneLabel !== communeLabel
      ? `${labelizeText(deliveryZoneLabel)}, `
      : '';

  return `${normalizeDeliveryZoneLabel}${labelizeText(
    communeLabel
  )}, ${labelizeText(regionLabel)}`;
};
