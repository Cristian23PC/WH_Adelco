import { CustomObject } from '@commercetools/platform-sdk';
import { DeliveryZone, IDeliveryZoneCustomObjectValue } from '../models';

const convertDeliveryZone = (customObject: Partial<CustomObject>, dc2DistributionChannelMap: object) => {
  const { label, commune, dcCode, dcLabel } = customObject.value as IDeliveryZoneCustomObjectValue;

  return {
    id: customObject.id,
    key: customObject.key,
    label,
    commune,
    dcCode,
    dchDefault: dc2DistributionChannelMap[dcCode],
    dcLabel
  } as DeliveryZone;
};

export { convertDeliveryZone };
