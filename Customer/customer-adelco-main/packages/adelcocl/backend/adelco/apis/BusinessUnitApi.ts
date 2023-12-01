import axios, { RequestData } from '../utils/axiosInstance';
import {
  AddDeliveryAddressResponse,
  DeliveryAddressFormFormatedValues
} from '@Types/adelco/businessUnits';
import {
  CtRegion,
  CtCommune,
  CtDeliveryZone,
  CtBusinessUnits
} from '../types/businessUnit';
import { ApiResponseType } from '../utils/Request';

export const findRegions = async (
  requestData: RequestData
): ApiResponseType<CtRegion[]> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<
    unknown,
    ApiResponseType<CtRegion[]>
  >(`${baseURL}/regions`, { headers });

  return { data, sessionData };
};

export const findCommunes = async (
  requestData: RequestData,
  regionKey: string
): ApiResponseType<CtCommune[]> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<
    unknown,
    ApiResponseType<CtCommune[]>
  >(`${baseURL}/regions/${regionKey}/communes`, { headers });
  return { data, sessionData };
};

export const findDeliveryZones = async (
  requestData: RequestData,
  regionKey: string,
  communeKey: string
): ApiResponseType<CtDeliveryZone> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<
    unknown,
    ApiResponseType<CtDeliveryZone>
  >(`${baseURL}/regions/${regionKey}/communes/${communeKey}/delivery-zones`, {
    headers
  });
  return { data, sessionData };
};

export const updateBusinessUnit = async (
  requestData: RequestData,
  businessUnit: any
): ApiResponseType<any> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.put<unknown, ApiResponseType<any>>(
    `${baseURL}/business-unit/${businessUnit.id}`,
    businessUnit,
    {
      headers
    }
  );

  return { data, sessionData };
};

export const getUserBusinessUnits = async (
  requestData: RequestData
): ApiResponseType<CtBusinessUnits> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<
    unknown,
    ApiResponseType<CtBusinessUnits>
  >(`${baseURL}/users/me/business-units`, { headers });

  return { data, sessionData };
};

export const addBusinessDeliveryAddress = async (
  requestData: RequestData,
  parentBusinessUnitId: string,
  body: DeliveryAddressFormFormatedValues
): ApiResponseType<AddDeliveryAddressResponse> => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.post<
    unknown,
    ApiResponseType<AddDeliveryAddressResponse>
  >(`${baseURL}/business-unit/${parentBusinessUnitId}/divisions`, body, {
    headers
  });

  return { data, sessionData };
};
