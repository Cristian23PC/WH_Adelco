import { Zone, ZoneLabels } from '@Types/adelco/user';
import { CtBusinessUnits, CtAddress } from '../../types/businessUnit';
import { labelizeText } from './common';
import { formatZoneLabel } from './businessUnit';

const getAddressLabels = (address: CtAddress): ZoneLabels => {
  return {
    regionLabel: labelizeText(address.region),
    communeLabel: labelizeText(address.city),
    deliveryZoneLabel: labelizeText(address.department),
  };
};

export const mapBussinessUnits = (businessUnits: CtBusinessUnits): Zone | null => {
  const foundBusinessUnit = businessUnits?.businessUnits.find(
    ({ distributionChannelId, deliveryZoneKey }) => distributionChannelId && deliveryZoneKey,
  );

  if (!foundBusinessUnit) return null;

  const shippingAddress = foundBusinessUnit.addresses.find((address) => address.key === 'shipping-address');

  const zoneLabel = shippingAddress ? formatZoneLabel(getAddressLabels(shippingAddress)) : undefined;

  return {
    businessUnitId: foundBusinessUnit.id,
    dch: foundBusinessUnit.distributionChannelId,
    t2z: foundBusinessUnit.deliveryZoneKey,
    zoneLabel,
  };
};
