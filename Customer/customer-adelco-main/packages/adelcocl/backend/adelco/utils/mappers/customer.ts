import { Zone, ZoneLabels } from '@Types/adelco/user';
import {
  CtBusinessUnits,
  CtAddress,
  CtBusinessUnit
} from '../../types/businessUnit';
import { formatZoneLabel } from './businessUnit';

const getAddressLabels = (address: CtAddress): ZoneLabels => {
  return {
    regionLabel: address.region,
    communeLabel: address.city,
    deliveryZoneLabel: [address.streetName, address.streetNumber].join(' ')
  };
};

export const getShippingAddressFromBU = (
  businessUnit: CtBusinessUnit
): CtAddress => {
  const shippingAddressId = businessUnit.shippingAddressIds[0];
  return businessUnit.addresses.find(
    (address) => address.id === shippingAddressId
  );
};

export const mapBussinessUnits = (
  businessUnits: CtBusinessUnits
): Zone | null => {
  const foundBusinessUnit = businessUnits?.businessUnits.find(
    ({ distributionChannelId, deliveryZoneKey }) =>
      distributionChannelId && deliveryZoneKey
  );

  if (!foundBusinessUnit) return null;

  const shippingAddress = getShippingAddressFromBU(foundBusinessUnit);

  const zoneLabel = shippingAddress
    ? formatZoneLabel(getAddressLabels(shippingAddress))
    : undefined;

  return {
    businessUnitId: foundBusinessUnit.id,
    dch: foundBusinessUnit.distributionChannelId,
    t2z: foundBusinessUnit.deliveryZoneKey,
    minAmount: foundBusinessUnit?.minimumOrderAmount,
    useT2Rate: foundBusinessUnit?.shouldApplyT2Rate,
    taxProfile: foundBusinessUnit?.taxProfile,
    zoneLabel
  };
};

export const mapShippingAddresses = (businessUnits: CtBusinessUnits) => {
  const validBus = businessUnits.businessUnits?.filter(
    (bu) => bu.distributionChannelId && bu.deliveryZoneKey
  );
  return validBus.map((bu) => {
    const address = getShippingAddressFromBU(bu);
    const zoneLabel = formatZoneLabel(getAddressLabels(address));
    return {
      shippingAddress: address,
      zone: {
        businessUnitId: bu.id,
        dch: bu.distributionChannelId,
        t2z: bu.deliveryZoneKey,
        minAmount: bu.minimumOrderAmount,
        zoneLabel
      }
    };
  });
};
