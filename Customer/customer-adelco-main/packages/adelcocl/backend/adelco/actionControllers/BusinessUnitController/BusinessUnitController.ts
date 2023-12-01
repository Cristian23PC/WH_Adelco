import { Request, ActionContext, Response } from '@frontastic/extension-types';
import { formatOption } from '../../utils/mappers/common';
import {
  findRegions,
  findCommunes,
  findDeliveryZones,
  updateBusinessUnit,
  addBusinessDeliveryAddress as addBusinessDeliveryAddressApi,
  getUserBusinessUnits
} from '../../apis/BusinessUnitApi';
import {
  Commune,
  Region,
  DeliverZone,
  DeliveryAddressFormFormatedValues
} from '@Types/adelco/businessUnits';
import { UNIT_TYPES, findBusinessUnitCompany } from '../../utils/businessUnit';
import { AxiosErrorData } from '@Types/adelco/general/AdelcoError';
import { getDataFromContext } from '../../utils/axiosInstance';

export const getRegions = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'businessUnit'
    );
    const { data: regions, sessionData } = await findRegions(requestData);

    return {
      statusCode: 200,
      body: JSON.stringify(regions.map(formatOption) as Region[]),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

export const getCommunes = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  const { regionKey } = JSON.parse(request.body);
  const { data: communes, sessionData } = await findCommunes(
    requestData,
    regionKey
  );

  return {
    statusCode: 200,
    body: JSON.stringify(communes.map(formatOption) as Commune[]),
    sessionData: {
      ...request.sessionData,
      ...sessionData
    }
  };
};

export const getDeliveryZones = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  const { regionKey, communeKey } = JSON.parse(request.body);
  const { data: deliveryZones, sessionData } = await findDeliveryZones(
    requestData,
    regionKey,
    communeKey
  );

  const mappedDeliveryZones = deliveryZones.map(
    ({ id, dchDefault, commune, minimumOrderAmount, ...deliveryZone }) => ({
      ...formatOption(deliveryZone),
      id,
      dchDefault,
      commune,
      minimumOrderAmount
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(mappedDeliveryZones as DeliverZone[]),
    sessionData: {
      ...request.sessionData,
      ...sessionData
    }
  };
};

export const updateBusinessUnitData = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  const body = JSON.parse(request.body);
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );

  try {
    const { data, sessionData } = await updateBusinessUnit(requestData, body);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e as AxiosErrorData })
    };
  }
};

export const getBusinessUnitData = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );

  try {
    const { data, sessionData } = await getUserBusinessUnits(requestData);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e as AxiosErrorData })
    };
  }
};

export const addBusinessDeliveryAddress = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'businessUnit'
    );
    const body: DeliveryAddressFormFormatedValues = JSON.parse(request.body);

    const { data: userParentBusinessUnit } = await findBusinessUnitCompany(
      requestData
    );

    if (!userParentBusinessUnit?.id) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Could not find business unit with unitType ${UNIT_TYPES.COMPANY}`
        })
      };
    }

    const { data, sessionData } = await addBusinessDeliveryAddressApi(
      requestData,
      userParentBusinessUnit?.id,
      body
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        data
      }),
      sessionData: {
        ...request.sessionData,
        ...sessionData
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e as AxiosErrorData })
    };
  }
};
