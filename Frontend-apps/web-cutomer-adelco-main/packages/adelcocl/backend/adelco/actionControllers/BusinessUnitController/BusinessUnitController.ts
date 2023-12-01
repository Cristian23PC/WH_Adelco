import { Request, ActionContext, Response } from '@frontastic/extension-types';
import { formatOption } from '../../utils/mappers/common';
import { findRegions, findCommunes, findDeliveryZones } from '../../apis/BusinessUnitApi';
import { Commune, Region, DeliverZone } from '@Types/adelco/businessUnits';

export const getRegions = async (_: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.businessUnit;
  const regions = await findRegions(baseURL);

  return {
    statusCode: 200,
    body: JSON.stringify(regions.map(formatOption) as Region[]),
  };
};

export const getCommunes = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.businessUnit;
  const { regionKey } = JSON.parse(request.body);
  const communes = await findCommunes(baseURL, regionKey);

  return {
    statusCode: 200,
    body: JSON.stringify(communes.map(formatOption) as Commune[]),
  };
};

export const getDeliveryZones = async (request: Request, context: ActionContext): Promise<Response> => {
  const baseURL = context.frontasticContext?.project.configuration.msURL.businessUnit;
  const { regionKey, communeKey } = JSON.parse(request.body);
  const deliveryZones = await findDeliveryZones(baseURL, regionKey, communeKey);

  const mappedDeliveryZones = deliveryZones.map(({ dchDefault, commune, ...deliveryZone }) => ({
    ...formatOption(deliveryZone),
    dchDefault,
    commune,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(mappedDeliveryZones as DeliverZone[]),
  };
};
