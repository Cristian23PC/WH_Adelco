import { AxiosError } from 'axios';
import axios from '@/utils/axiosInstance';
import { SALES_BASE_URL } from '../config';
import { Zone, ZonePayload, ZonesPageResultResponse } from '@/types/Zones';

const BASE_URL = `${SALES_BASE_URL}/zones`;

export const getZones = async (
  queryParams: string
): Promise<ZonesPageResultResponse> => {
  try {
    const { data } = await axios.get(`${BASE_URL}${queryParams}`);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const createZone = async (payload: ZonePayload): Promise<Zone> => {
  try {
    const { data } = await axios.post(`${BASE_URL}`, payload);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const editZone = async ({
  payload,
  id
}: {
  payload: ZonePayload;
  id: number;
}): Promise<Zone> => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};

export const removeZone = async (id: number): Promise<Zone> => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/${id}`);
    return data;
  } catch (e) {
    const error = (e as AxiosError)?.response;
    const errorData = error?.data || {};
    throw { ...errorData, statusCode: error?.status || 500 };
  }
};
