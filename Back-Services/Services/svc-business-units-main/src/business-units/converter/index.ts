import { BusinessUnit } from '@commercetools/platform-sdk';
import { ConvertedBusinessUnit } from '../models';

const convertBusinessUnit = (businessUnit: BusinessUnit, distributionChannelId: string): ConvertedBusinessUnit => {
  return {
    ...businessUnit,
    distributionChannelId,
    deliveryZoneKey: businessUnit.custom?.fields.deliveryZone?.obj?.key,
    rut: businessUnit.custom?.fields.rut,
    custom: undefined,
    taxProfile: businessUnit.custom?.fields.taxProfile,
    shouldApplyT2Rate: businessUnit.custom?.fields.shouldApplyT2Rate,
    externalId: businessUnit.custom?.fields.externalId,
    customerGroupCode: businessUnit.custom?.fields.customerGroupCode,
    distributionCenter: businessUnit.custom?.fields.deliveryZone?.obj?.value?.dcCode,
    t2Rate: businessUnit.custom?.fields.deliveryZone?.obj?.value?.t2Rate,
    tradeName: businessUnit.custom?.fields.tradeName,
    creditLimit: businessUnit.custom?.fields.creditLimit,
    creditTermDays: businessUnit.custom?.fields.creditTermDays,
    isCreditBlocked: businessUnit.custom?.fields.isCreditBlocked,
    isCreditEnabled: businessUnit.custom?.fields.isCreditEnabled,
    creditExcessTolerance: businessUnit.custom?.fields.creditExcessTolerance
  };
};

export { convertBusinessUnit };
